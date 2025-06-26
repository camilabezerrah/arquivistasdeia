import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// __dirname para ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir frontend (se tiver)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Instanciar modelo Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Funções auxiliares para Function Calling
function getCurrentTime() {
  return { currentTime: new Date().toLocaleString('pt-BR') };
}

async function getWeather(args) {
  const location = args.location;
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric&lang=pt_br`;

  try {
    const res = await axios.get(url);
    return {
      location: res.data.name,
      temperature: res.data.main.temp,
      description: res.data.weather[0].description,
    };
  } catch (err) {
    return { error: 'Erro ao obter o clima: ' + err.message };
  }
}

const availableFunctions = {
  getCurrentTime,
  getWeather,
};

// Conexão com MongoDB
const mongoUriLogs = process.env.MONGO_URI_LOGS;
const mongoUriHistoria = process.env.MONGO_URI_HISTORIA;

let dbLogs, dbHistoria;

async function connectToMongoDB(uri, dbName) {
  const client = new MongoClient(uri);
  await client.connect();
  return client.db(dbName);
}

async function initializeDatabases() {
  dbLogs = await connectToMongoDB(mongoUriLogs, "IIW2023B_Logs");
  dbHistoria = await connectToMongoDB(mongoUriHistoria, "chatbotHistoriaDB");
}

initializeDatabases();

// Rota básica para teste
app.get('/', (req, res) => {
  res.send('✅ Backend do Chatbot está online!');
});

// Endpoint principal do chatbot Gemini
app.post('/chat', async (req, res) => {
  const { message, historico } = req.body;

  const chat = model.startChat({
    tools: [
      {
        functionDeclarations: [
          {
            name: 'getCurrentTime',
            description: 'Obtém a data e hora atuais.',
            parameters: { type: 'object', properties: {} },
          },
          {
            name: 'getWeather',
            description: 'Obtém a previsão do tempo para uma cidade.',
            parameters: {
              type: 'object',
              properties: {
                location: {
                  type: 'string',
                  description: 'Cidade desejada, ex: "São Paulo, BR"',
                },
              },
              required: ['location'],
            },
          },
        ],
      },
    ],
    history: historico || [],
  });

  try {
    let response = await chat.sendMessage(message);

    if (response.functionCalls().length > 0) {
      const funcCall = response.functionCalls()[0];
      const functionName = funcCall.name;
      const args = funcCall.args;

      const result = await availableFunctions[functionName](args);

      const resultFromFunctionCall = await chat.sendMessage([
        {
          functionResponse: {
            name: functionName,
            response: result,
          },
        },
      ]);

      res.json({
        resposta: resultFromFunctionCall.response.text(),
        historico: chat.getHistory(),
      });
    } else {
      res.json({
        resposta: response.response.text(),
        historico: chat.getHistory(),
      });
    }
  } catch (error) {
    console.error('❌ Erro no backend:', error);
    res.status(500).json({ resposta: 'Erro interno no servidor.', historico: [] });
  }
});

// Novo endpoint para processar mensagem e atualizar histórico
app.post('/api/chat/processar-mensagem', async (req, res) => {
  try {
    const { mensagem, historico } = req.body;
    if (!mensagem) {
      return res.status(400).json({ error: 'Mensagem é obrigatória' });
    }

    // Use a lógica simples (ou adapte para Gemini se preferir)
    // Exemplo simples de resposta:
    const respostaBot = `Você disse: "${mensagem}". Resposta automática temporária.`;

    // Atualiza histórico
    const novoHistorico = [
      ...(historico || []),
      { from: 'user', text: mensagem },
      { from: 'bot', text: respostaBot }
    ];

    // Retorna resposta e histórico atualizado
    res.json({ resposta: respostaBot, historico: novoHistorico });

  } catch (err) {
    console.error('Erro no endpoint /processar-mensagem:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// Endpoint para salvar histórico no MongoDB
app.post('/api/chat/salvar-historico', async (req, res) => {
  try {
    const { sessionId, userId, botId, startTime, endTime, messages } = req.body;

    if (!dbHistoria) {
      return res.status(500).json({ error: "Sem conexão com o banco de histórico." });
    }
    if (!sessionId || !botId || !messages?.length) {
      return res.status(400).json({ error: "Dados incompletos." });
    }

    const novaSessao = {
      sessionId,
      userId: userId || 'anonimo',
      botId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      messages,
      loggedAt: new Date()
    };

    await dbHistoria.collection("sessoesChat").insertOne(novaSessao);

    res.status(201).json({ message: "Histórico salvo!", sessionId });
  } catch (err) {
    console.error('Erro ao salvar histórico:', err);
    res.status(500).json({ error: 'Erro ao salvar histórico.' });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
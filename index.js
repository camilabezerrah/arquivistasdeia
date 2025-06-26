// Importa a interface 'readline' do Node.js, que é usada para ler entradas do usuário de forma interativa.
import * as readline from 'node:readline/promises';

// Importa 'stdin' e 'stdout' do módulo 'process' do Node.js para lidar com a entrada e saída do terminal.
import { stdin as input, stdout as output } from 'node:process';

// A função tem a tarefa de responder perguntas sobre chocolate.
function responderPergunta(pergunta) {
  // Ela utiliza um objeto que associa perguntas específicas às suas respectivas respostas.
  const perguntas = {
    "qual chocolate você mais gosta?": "Eu adoro chocolate amargo, com mais de 70% de cacau!",
    "o que é chocolate?": "Chocolate é uma iguaria feita a partir dos grãos de cacau. Pode ser amargo, ao leite ou branco.",
    "chocolate faz bem à saúde?": "Sim, o chocolate amargo, especialmente, é conhecido por seus benefícios, como melhorar a saúde do coração e fornecer antioxidantes.",
    "qual é o melhor chocolate?": "O melhor chocolate é o que mais combina com o seu gosto! Eu sou fã do chocolate amargo.",
    "chocolate branco é chocolate?": "Sim, o chocolate branco é feito com manteiga de cacau, mas não contém sólidos de cacau como os chocolates amargo e ao leite."
  };

  // A função verifica se a pergunta está presente nesse objeto e, se estiver, retorna a resposta correta.
  // Se a pergunta não for reconhecida, ela oferece uma resposta padrão para questões desconhecidas.
  return perguntas[pergunta.toLowerCase()] || "Desculpe, não sei a resposta para essa pergunta. Pergunte sobre chocolate!";
}

// Além disso, existe uma função principal que opera de forma assíncrona e gerencia a interação do chatbot.
async function main() {
  // Essa função também cria uma interface para ler as entradas e exibir as saídas no terminal.
  const rl = readline.createInterface({ input, output });

  try {
    // Apresenta uma mensagem de boas-vindas ao usuário.
    console.log("Olá! Eu sou o ChocoBot, seu chatbot sobre chocolate. Pergunte-me algo!");

    // Inicia um ciclo contínuo onde o chatbot ficará disponível para responder perguntas.
    while (true) {
      // Realiza a leitura da pergunta do usuário de maneira assíncrona.
      const pergunta = await rl.question("\nFaça uma pergunta ao ChocoBot: ");

      // Verifica se o usuário digitou "sair" para finalizar a conversa.
      if (pergunta.toLowerCase() === "sair") {
        console.log("Até logo! Volte para conversar sobre chocolate qualquer dia.");
        break;  // Interrompe o loop e encerra a conversa.
      }

      // Chama a função 'responderPergunta' para obter a resposta à dúvida do usuário.
      const resposta = responderPergunta(pergunta);

      // Mostra a resposta que o chatbot forneceu no terminal.
      console.log(resposta);
    }
  } finally {
    // Assegura que a interface de leitura seja encerrada quando a interação terminar.
    rl.close();
  }
}

// Chama a função principal para dar início ao chatbot.
main();
# ChocoBot - Chatbot Inteligente com Function Calling

ChocoBot é um chatbot inteligente que utiliza a API **Google Gemini** para fornecer respostas naturais e úteis, além de executar funções do backend, como obter a data/hora atual e a previsão do tempo. Ele também interage com os usuários por meio de um frontend simples.

## 🚀 Funcionalidades

### 1. **Function Calling**
O recurso de **Function Calling** da API Gemini permite que o chatbot execute funções reais do backend, como obter a data/hora ou buscar informações de previsão do tempo, ao invés de apenas responder com texto. Isso torna o bot mais inteligente e capaz de realizar tarefas mais avançadas.

#### Como Funciona?
- O chatbot recebe uma mensagem do usuário.
- Se a mensagem requisitar uma ação que pode ser realizada com uma função específica (ex: obter hora ou clima), o bot chama a função apropriada.
- O backend executa a função, obtém o resultado e o retorna para o Gemini.
- O Gemini utiliza o resultado para gerar uma resposta natural e relevante.

Exemplo de uma interação:
- Usuário: "Que horas são?"
- Bot: "Agora são 15:23 de 08/05/2025."

### 2. **Funções Implementadas**

#### 🕒 `getCurrentTime`
Esta função retorna a data e hora atual no formato brasileiro.

##### Descrição:
- A função `getCurrentTime` busca e retorna a hora atual do servidor.

##### Exemplo de uso:
- **Entrada**: "Que horas são?"
- **Saída**: "Agora são 15:23 de 08/05/2025."

#### 🌤️ `getWeather`
Esta função consulta a API OpenWeather para fornecer a previsão do tempo para uma cidade especificada.

##### Descrição:
- A função `getWeather` aceita o nome de uma cidade e retorna a temperatura atual e a descrição do clima.

##### Exemplo de uso:
- **Entrada**: "Como está o clima em São Paulo?"
- **Saída**: "A previsão para São Paulo é de 25°C com céu limpo."

---

## 🔁 Histórico de Conversa

Agora o **ChocoBot** lembra das mensagens anteriores para manter uma conversa mais natural. O frontend envia o histórico ao backend, que reenvia à API **Gemini**. Isso permite que o bot tenha uma memória durante a interação, proporcionando um diálogo contínuo e sem necessidade de reiniciar a conversa a cada nova mensagem.

---

## 🛡️ Tratamento de Erros

Se houver falha na conexão com a API, o usuário verá uma mensagem amigável na interface, evitando travamentos ou mensagens genéricas. Isso melhora a experiência do usuário, ao mesmo tempo que permite que o sistema se recupere e continue funcionando sem grandes interrupções.

Por exemplo:
- Caso a API do **Gemini** ou a API de clima não esteja acessível, o bot exibirá uma mensagem amigável ao usuário, como "Oops! Algo deu errado. Tente novamente."

---

## 💬 Indicador de Carregamento

Enquanto o **ChocoBot** está processando a resposta, um indicador de "digitando..." será exibido para simular uma conversa real. Isso ajuda a melhorar a experiência do usuário, tornando a interação mais fluida e menos frustrante, como se fosse uma conversa com uma pessoa real.

---

## 🔧 Como Configurar

Para rodar o ChocoBot em sua máquina local, siga os seguintes passos:

### 1. Instale as Dependências
Certifique-se de ter o **Node.js** instalado. Depois, instale as dependências do projeto:

```bash
npm install
let chatHistory = [];

document.getElementById('send-btn').addEventListener('click', async () => {
  const userInput = document.getElementById('user-input').value.trim();
  const chatBox = document.getElementById('chatHistory');
  const sendBtn = document.getElementById('send-btn');

  if (userInput === '') return;

  chatBox.innerHTML += `<div class="user-msg"><strong>Você:</strong> ${userInput}</div>`;
  document.getElementById('user-input').value = '';

  const loadingMsg = document.createElement('div');
  loadingMsg.classList.add('bot-msg');
  loadingMsg.textContent = "ChocoBot está digitando...";
  chatBox.appendChild(loadingMsg);

  sendBtn.disabled = true;

  try {
    const res = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userInput, historico: chatHistory })
    });    

    if (!res.ok) {
      throw new Error(`Erro HTTP: ${res.status}`);
    }

    const data = await res.json();

    loadingMsg.remove();

    chatBox.innerHTML += `<div class="bot-msg"><strong>ChocoBot:</strong> ${data.resposta}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
    chatHistory = data.historico;
  } catch (error) {
    console.error(error);
    loadingMsg.textContent = "❌ Oops! Algo deu errado. Tente novamente.";
    loadingMsg.style.color = 'orange';
  } finally {
    sendBtn.disabled = false;
  }
});
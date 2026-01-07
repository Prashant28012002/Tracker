const chatIcon = document.getElementById("chatIcon");
const chatBox = document.getElementById("chatBox");
const sendBtn = document.getElementById("sendBtn");
const chatBody = document.getElementById("chatBody");
const userInput = document.getElementById("userInput");

// Toggle chat box
chatIcon.addEventListener("click", () => {
  chatBox.classList.toggle("active");
});

// Send message
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  // User message
  const userMsg = document.createElement("div");
  userMsg.className = "user-message chat-message";
  userMsg.textContent = message;
  chatBody.appendChild(userMsg);

  userInput.value = "";
  chatBody.scrollTop = chatBody.scrollHeight;

  // Bot reply
  setTimeout(() => {
    const botReply = document.createElement("div");
    botReply.className = "bot-message chat-message";
const msg = message.toLowerCase();
if (msg.includes("batch")) {
  botReply.textContent = "You can track batch details in the Production Tracker. Each batch has a unique ID, production date, and operator details.";
} else if (msg.includes("hii")) {
  botReply.textContent = "Hii may I help you with something related to Chemical Production Tracking?";
} else if (msg.includes("temperature")) {
  botReply.textContent = "Ideal reactor temperature range is 70°C–90°C depending on the chemical process. Monitor sensors regularly to ensure stability.";
} else if (msg.includes("pressure")) {
  botReply.textContent = "Maintain stable pressure between 2–4 bar for optimal reaction. Pressure deviations can affect yield and safety.";
} else if (msg.includes("raw material") || msg.includes("material")) {
  botReply.textContent = "You can monitor raw material inventory in real time, including quantity, quality, and supplier details.";
} else if (msg.includes("efficiency") || msg.includes("yield")) {
  botReply.textContent = "Production efficiency is calculated based on output vs. input. The system provides efficiency reports per batch and overall.";
} else if (msg.includes("output") || msg.includes("product")) {
  botReply.textContent = "Track production outputs by batch, product type, and quantity. You can also generate daily or weekly production reports.";
} else if (msg.includes("maintenance")) {
  botReply.textContent = "Regular maintenance of equipment is crucial. The tracker can schedule reminders for calibration, cleaning, and preventive maintenance.";
} else if (msg.includes("safety")) {
  botReply.textContent = "Always follow safety protocols. Monitor temperature, pressure, and chemical handling procedures to prevent accidents.";
} else {
  botReply.textContent = "I'm not sure, but I can help you explore it soon! Try asking about batch, raw material, efficiency, or temperature.";
}

    chatBody.appendChild(botReply);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 300);
}

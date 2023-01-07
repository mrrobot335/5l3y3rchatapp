// Import the `socket.io` library and create a new socket connection to the server at the specified URL
const socket = io("http://localhost:3000");
 
// Select the `.container` element from the DOM
const body = document.querySelector(".container");
 
// Select the `#chatBox` element from the DOM
const chatBox = document.getElementById("chatBox");
 
// Select the `#concurrentUsers` element from the DOM
const concurrentUsers = document.getElementById("concurrentUsers");
 
// Select the `#chatting` element from the DOM
const messageContainer = document.getElementById("chatting");
 
// Select the `#messageForm` element from the DOM
const form = document.getElementById("messageForm");
 
// Select the `#messageInput` element from the DOM
const messageInput = document.getElementById("messageInput");
 
// Define two arrays of words to be used for generating a random username
verbs = ["quick", "lazy", "sleepy", "noisy", "hungry"];
adjectives = ["fox", "dog", "racoon", "heyana", "crow", "cat"];
 
// Generate two random numbers to select a verb and an adjective from the above arrays
var randNum1 = Math.floor(Math.random() * adjectives.length);
var randNum2 = Math.floor(Math.random() * verbs.length);
 
// Generate a random username by concatenating a random verb and a random adjective
const name = verbs[randNum2] + " " + adjectives[randNum1];
 
// Emit an event called "userJoined" to the server, along with the randomly generated username
socket.emit("userJoined", name);
 
// Listen for an "increaseUserCount" event from the server and update the value of the `concurrentUsers` element accordingly
socket.on("increaseUserCount", (data) => {
  concurrentUsers.innerText = data;
});
 
// Listen for a "disconnected" event from the server and update the UI accordingly
socket.on("disconnected", (data) => {
  userJoinUiUpdate(`${data.name} left the Chat`, "center");
  concurrentUsers.innerHTML = data.concurrentUsers;
});
 
socket.on("disconnected", (data) => {
  userJoinUiUpdate(`${data.name} left the Chat`, "center");
  concurrentUsers.innerHTML = data.concurrentUsers;
});
//////////////////
 
// Listen for a "user-joined" event from the server and update the UI accordingly
socket.on("user-joined", (data) => {
  userJoinUiUpdate(`${data.name} Joined the Chat`, "center");
  concurrentUsers.innerText = data.concurrentUsers;
});
 
// Listen for a "receive" event from the server and update the UI accordingly
socket.on("receive", (data) => {
  messageUiUpdate(data.message, data.name, "left", data.id);
});
 
// Add an event listener to the `form` element that listens for the "submit" event
form.addEventListener("submit", (e) => {
  // Prevent the default behavior of the form submission
  e.preventDefault();
 
  // Get the value of the `messageInput` element
  const message = messageInput.value;
 
  // If the message is empty, return without doing anything
  if (message === "") {
    return;
  }
 
  // Generate a random ID for the message
  const id = Math.round(Math.random() * 100000);
 
  // Update the UI with the new message
  messageUiUpdate(message, "You", "right", id);
 
  // Emit a "send" event to the server, along with the message and its ID
  socket.emit("send", { message, id });
 
  // Clear the `messageInput` element
  messageInput.value = "";
});
 
////
const userJoinUiUpdate = (message, position) => {
  // Create a new `div` element to contain the message
  const messageUi = document.createElement("div");
 
  // Create a new `p` element to contain the text of the message
  const pElement = document.createElement("p");
 
  // Set the text of the `p` element to be the message passed to the function
  pElement.innerText = message;
 
  // Add the "message" and "position" classes to the `div` element
  messageUi.classList.add("message");
  messageUi.classList.add(position);
 
  // Append the `p` element to the `div` element
  messageUi.append(pElement);
 
  // Append the `div` element to the message container
  messageContainer.append(messageUi);
 
  // Set the scroll position of the message container to the bottom
  messageContainer.scrollTop = messageContainer.scrollHeight;
};
 
const messageUiUpdate = (message, user, position, id) => {
  // Create a new `div` element to contain the message
  const messageUi = document.createElement("div");
 
  // Create a new `span` element to contain the user's name
  const span = document.createElement("span");
 
  // Create a new `i` element to contain the user's avatar (not shown in the code)
  const i = document.createElement("i");
 
  // Create a new `p` element to contain the text of the message
  const p = document.createElement("p");
 
  // Set the text of the `p` element to be the message passed to the function
  p.innerText = message;
 
  // Set the text of the `span` element to be the user's name passed to the function
  span.innerText = user;
 
  // Append the `span`, `i`, and `p` elements to the `div` element
  messageUi.append(span);
  messageUi.append(i);
  messageUi.append(p);
 
  // Add the "message" and "position" classes to the `div` element
  messageUi.classList.add(position);
  messageUi.classList.add("message");
 
  // Set the `id` attribute of the `div` element to be the `id` passed to the function
  messageUi.setAttribute("id", id);
 
  // Append the `div` element to the message container
  messageContainer.append(messageUi);
 
  // Set the scroll position of the message container to the bottom
  messageContainer.scrollTop = messageContainer.scrollHeight;
};
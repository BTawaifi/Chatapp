const socket = io();
const messageContainer = document.querySelector('#message-container')
const messageForm = document.getElementById('sent-container')
const messageInput = document.getElementById('message-input')
const onlineUsersNum = document.getElementById('online-Users')
var audio = new Audio("swiftly-610.mp3");


let onlineUsers = {};

let name = "";
do {
    name = prompt('Enter your name');
} while (name == null || name == "");




appendMessageSelf('--Welcome: ' + name + '--')
socket.emit('new-user', name)

socket.on('chat-message', data => {
    if (data.name != '' && data.name != null && data.name != undefined) {
        appendMessage(`${data.name}: ${data.message}`)
        $(messageContainer).scrollTop(2000);
        audio.play();
    }

})
socket.on('user-connected', name => {
    appendMessage(name + " connected")
})
socket.on('user-disconnected', name => {
    if (name != '' && name != null && name != undefined) {
        appendMessage(name + " disconnected")
    }
})

socket.on('users-online', Users => {
    onlineUsers = Users;
    onlineUsersNum.innerText = Object.values(onlineUsers);
})

messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessageSelf(`${message}`)
    socket.emit('send-chat-message', message)
    messageInput.value = '';
    $(messageContainer).scrollTop(2000);
})

function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageContainer.append(messageElement)
}
function appendMessageSelf(message) {

    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.className = "text-primary ";
    messageContainer.append(messageElement)
}


const newThread = document.getElementById("newThread");
const reportThread = document.getElementById("reportThread");
const deleteThread = document.getElementById("deleteThread");
const newReply = document.getElementById("newReply");
const reportReply = document.getElementById("reportReply");
const deleteReply = document.getElementById("deleteReply");
const boardList = document.getElementById("boardList");

const board1 = document.getElementById("board1");
const board2 = document.getElementById("board2");
const board3 = document.getElementById("board3");
const board4 = document.getElementById("board4");
const board5 = document.getElementById("board5");
const board6 = document.getElementById("board6");

const thread_id4 = document.getElementById("thread_id4");

const reportThreadStatus = document.getElementById("reportThreadStatus");
const deleteThreadStatus = document.getElementById("deleteThreadStatus");
const reportReplyStatus = document.getElementById("reportReplyStatus");
const deleteReplyStatus = document.getElementById("deleteReplyStatus");
const newReplyStatus = document.getElementById("newReplyStatus");

const boardListUrl = "/api/boards";

fetch(boardListUrl)
.then(response => response.json())
.then(data => {
  data.forEach(e => {
    boardList.innerHTML += `<div class="boardListItem"><a href="/b/${e}/">${e}</a></div>`;
  })
})

newThread.addEventListener("submit", e => {
  e.preventDefault();
  
  const url = `/api/threads/${board1.value}`
  
  fetch(url, {
    method: "post",
    body: new URLSearchParams(new FormData(newThread))
  })
  .then(response => {
    window.location.pathname = `/b/${board1.value}/`;
  })
})

reportThread.addEventListener("submit", e => {
  e.preventDefault();
  
  reportThreadStatus.textContent = "";
  
  const url = `/api/threads/${board2.value}`
  
  fetch(url, {
    method: "put",
    body: new URLSearchParams(new FormData(reportThread))
  })
  .then(response => response.text())
  .then (data => {
    reportThreadStatus.textContent = data;
  })
})

deleteThread.addEventListener("submit", e => {
  e.preventDefault();
  
  deleteThreadStatus.textContent = "";
  
  const url = `/api/threads/${board3.value}`
  
  fetch(url, {
    method: "delete",
    body: new URLSearchParams(new FormData(deleteThread))
  })
  .then(response => response.json())
  .then (data => {
    deleteThreadStatus.textContent = data;
  })
})

newReply.addEventListener("submit", e => {
  e.preventDefault();
  
  newReplyStatus.textContent = "";
  
  const url = `/api/replies/${board4.value}`
  
  fetch(url, {
    method: "post",
    body: new URLSearchParams(new FormData(newReply))
  })
  .then(response => {
    if (response.redirected === false) return response.json();
    else window.location.pathname = `/b/${board4.value}/${thread_id4.value}/`;
  })
  .then(data => {
    newReplyStatus.textContent = data;
  })
})

reportReply.addEventListener("submit", e => {
  e.preventDefault();
  
  reportReplyStatus.textContent = "";
  
  const url = `/api/replies/${board5.value}`
  
  fetch(url, {
    method: "put",
    body: new URLSearchParams(new FormData(reportReply))
  })
  .then(response => response.json())
  .then (data => {
    reportReplyStatus.textContent = data;
  })
})

deleteReply.addEventListener("submit", e => {
  e.preventDefault();
  
  deleteReplyStatus.textContent = "";
  
  const url = `/api/replies/${board6.value}`
  
  fetch(url, {
    method: "delete",
    body: new URLSearchParams(new FormData(deleteReply))
  })
  .then(response => response.json())
  .then (data => {
    deleteReplyStatus.textContent = data;
  })
})
let currentURL = window.location.pathname.slice(3);

currentURL = currentURL.split('/');

const url = `/api/replies/${currentURL[0]}?thread_id=${currentURL[1]}`;
const threadUrl = `/api/threads/${currentURL[0]}`;
const replyUrl = `/api/replies/${currentURL[0]}`;

const backToBoard = document.getElementById("backToBoard");
const threadTitle = document.getElementById("threadTitle");

threadTitle.textContent = window.location.pathname.slice(2);
backToBoard.innerHTML = `<a href="/b/${currentURL[0]}">Back to /${currentURL[0]}</a>`;

getThread();

function getThread() {
  fetch(url)
  .then(response => response.json())
  .then(ele => {
    let boardThreads= [];
    let thread = ['<div class="thread">'];

    thread.push('<div class="details">');
    thread.push('<p class="text">' + ele.text + '</p>');
    thread.push('<p class="id"><span>ID: </span>' + ele._id + '</p>');
    thread.push('<p class="created_on"><span>Created on: </span>' + new Date(ele.created_on) + '</p>');

    if (ele.reported === true) {
      thread.push('<p class="reported"><span>Reported</span></p>');
    }

    if (ele.deleted === true) {
      thread.push('<p class="deleted"><span>Deleted</span></p>');
    }

    thread.push('<form class="reportThread"><input type="hidden" name="thread_id" value="' + ele._id + '"><input type="submit" value="Report"></form>');
    thread.push('<form class="deleteThread"><input type="hidden" name="thread_id" value="' + ele._id + '" required=""><input type="text" placeholder="Password" name="delete_password" required=""><input type="submit" value="Delete"></form>');
    thread.push('</div><div class="replies">');

    thread.push('<h3>' + ele.replies.length + ' replies total:</h3>');

    ele.replies.forEach(function(rep) {
      thread.push('<div class="reply">')
      thread.push('<p>' + rep.text + '</p>');
      thread.push('<p class="id"><span>ID: </span>' + rep._id + '</p>');
      thread.push('<p class="created_on"><span>Created on: </span>' + new Date(rep.created_on) + '</p>');

      if (rep.reported === true) {
        thread.push('<p class="reported"><span>Reported</span></p>');
      }

      thread.push('<form class="reportReply"><input type="hidden" name="thread_id" value="' + ele._id + '"><input type="hidden" name="reply_id" value="' + rep._id + '"><input type="submit" value="Report"></form>');
      thread.push('<form class="deleteReply"><input type="hidden" value="' + ele._id + '" name="thread_id" required=""><input type="hidden" value="' + rep._id + '" name="reply_id" required=""><input type="text" placeholder="Password" name="delete_password" required=""><input type="submit" value="Delete"></form>');
      thread.push('</div>')
    });

    thread.push('<div class="newReply">')
    thread.push('<form action="/api/replies/' + currentURL[0] + '/" method="post" id="newReply">');
    thread.push('<input type="hidden" name="thread_id" value="' + ele._id + '">');
    thread.push('<textarea rows="5" cols="80" type="text" placeholder="Quick reply..." name="text" required=""></textarea><br>');
    thread.push('<input type="text" placeholder="password to delete" name="delete_password" required=""><input style="margin-left: 5px" type="submit" value="Submit">')
    thread.push('</form></div></div></div>')

    boardThreads.push(thread.join(''));

    const boardDisplay = document.getElementById("boardDisplay");

    boardDisplay.innerHTML = boardThreads.join("");
  })
  .then(() => {
    newReply();
    reportThread();
    deleteThread();
    reportReply();
    deleteReply();
  })
}

function newReply() {
  const newReply = document.getElementById("newReply");

  newReply.addEventListener("submit", e => {
    e.preventDefault();

    fetch(replyUrl, {
      method: "post",
      body: new URLSearchParams(new FormData(newReply))
    })
    .then(response => response.json())
    .then(data => {
      //alert(data);
      newReply.reset();
      getThread();
    })
  })
}

function reportThread() {
  const reportThread = document.querySelector(".reportThread");

  reportThread.addEventListener("submit", e => {
    e.preventDefault();

    fetch(threadUrl, {
      method: "put",
      body: new URLSearchParams(new FormData(reportThread))
    })
    .then(response => response.text())
    .then(data => {
      getThread();
    })
  })
}

function deleteThread() {
  const deleteThread = document.querySelector(".deleteThread");

  deleteThread.addEventListener("submit", e => {
    e.preventDefault();

    fetch(threadUrl, {
      method: "delete",
      body: new URLSearchParams(new FormData(deleteThread))
    })
    .then(response => response.text())
    .then(data => {
      //alert(data);
      getThread();
    })
  })
}

function reportReply() {
  const reportReply = document.querySelectorAll(".reportReply");

  reportReply.forEach(e => {
    e.addEventListener("submit", f => {
      f.preventDefault();

      fetch(replyUrl, {
        method: "put",
        body: new URLSearchParams(new FormData(e))
      })
      .then(response => response.json())
      .then(data => {
        //alert(data);
        getThread();
      })
    })
  })
}

function deleteReply() {
  const deleteReply = document.querySelectorAll(".deleteReply");

  deleteReply.forEach(e => {
    e.addEventListener("submit", f => {
      f.preventDefault();

      fetch(replyUrl, {
        method: "delete",
        body: new URLSearchParams(new FormData(e))
      })
      .then(response => response.json())
      .then(data => {
        //alert(data);
        getThread();
      })
    })
  })
}
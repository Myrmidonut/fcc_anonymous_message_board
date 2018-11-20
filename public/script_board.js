const currentBoard = window.location.pathname.slice(3);
const threadUrl = `/api/threads/${currentBoard}`;
const replyUrl = `/api/replies/${currentBoard}`;
const boardTitle = document.getElementById("boardTitle");

boardTitle.textContent = `Welcome to ${window.location.pathname.slice(2)}`

getThreads()

function getThreads() {
  fetch(threadUrl)
  .then(response => response.json())
  .then(data => {
    let boardThreads= [];

    data.forEach(function(ele) { 
      let thread = ['<div class="thread">'];
      
      thread.push('<div class="details">');
      thread.push('<p class="text">' + ele.text + '</p>');
      thread.push('<p class="id"><span>ID: </span>' + ele._id + '</p>');
      thread.push('<p class="created_on"><span>Created on: </span>' + new Date(ele.created_on) + '</p>');
      
      if (ele.reported === true) {
        thread.push('<p class="reported"><span>Reported</span></p>');
      }
      
      thread.push('<form class="reportThread"><input type="hidden" name="thread_id" value="' + ele._id + '"><input type="submit" value="Report"></form>');
      thread.push('<form class="deleteThread"><input type="hidden" value="' + ele._id + '" name="thread_id" required=""><input type="text" placeholder="Password" name="delete_password" required=""><input type="submit" value="Delete"></form>');
      thread.push('</div><div class="replies">');
      
      let hiddenCount = ele.replycount - 3;
      if (hiddenCount < 1) hiddenCount = 0;
      
      thread.push('<h3>' + ele.replycount + ' replies total (' + hiddenCount + ' hidden) - <a href="' + window.location.pathname + '/' + ele._id + '">See the full thread here</a></h3>');
      
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
      thread.push('<form action="/api/replies/' + currentBoard + '/" method="post" id="newReply">');
      thread.push('<input type="hidden" name="thread_id" value="' + ele._id + '">');
      thread.push('<textarea type="text" placeholder="Quick reply" name="text" required=""></textarea><br>');
      thread.push('<input type="text" placeholder="Password" name="delete_password" required=""><input type="submit" value="Submit">')
      thread.push('</form></div></div></div>')
      
      boardThreads.push(thread.join(''));
    });
    
    const boardDisplay = document.getElementById("boardDisplay")
    
    boardDisplay.innerHTML = boardThreads.join("");
  })
  .then(() => {
    newThread();
    reportThread();
    deleteThread();
    reportReply();
    deleteReply();
  });
}

function newThread() {
  const newThread = document.getElementById("newThread");
  
  newThread.addEventListener("submit", e => {
    e.preventDefault();
    
    fetch(threadUrl, {
      method: "post",
      body: new URLSearchParams(new FormData(newThread))
    })
    .then(response => response.text())
    .then(data => {
      alert("success");
      newThread.reset();
      getThreads();
    })
  })
}

function reportThread() {
  const reportThread = document.querySelectorAll(".reportThread");
  
  reportThread.forEach(e => {
    e.addEventListener("submit", f => {
      f.preventDefault();
      
      fetch(threadUrl, {
        method: "put",
        body: new URLSearchParams(new FormData(e))
      })
      .then(response => response.text())
      .then(data => {
        alert(data);
        getThreads();
      })
    })
  })
}

function deleteThread() {
  const deleteThread = document.querySelectorAll(".deleteThread");
  
  deleteThread.forEach(e => {
    e.addEventListener("submit", f => {
      f.preventDefault();
      
      fetch(threadUrl, {
        method: "delete",
        body: new URLSearchParams(new FormData(e))
      })
      .then(response => response.json())
      .then(data => {
        alert(data);
        getThreads();
      })
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
      .then(response => response.text())
      .then(data => {
        alert(data);
        getThreads();
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
        alert(data);
        getThreads();
      })
    })
  })
}
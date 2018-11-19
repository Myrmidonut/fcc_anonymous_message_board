$(function() {
  const currentBoard = window.location.pathname.slice(3);
  const url = `/api/threads/${currentBoard}`;
  
  $('#boardTitle').text('Welcome to ' + window.location.pathname)
  
  $.ajax({
    type: "GET",
    url: url,
    success: function(data)
    {
      let boardThreads= [];
      
      //
      // THIS ARRAY SET UP IS FOR CODE READABILITIES AND TESTING!
      // THIS IS NOT WHAT IT WOULD LOOK LIKE TO GO LIVE
      //
      
      data.forEach(function(ele) {     
        let thread = ['<div class="thread">'];
        
        thread.push('<div class="details">');
        thread.push('<p class="text">' + ele.text + '</p>');
        thread.push('<p class="id"><span>ID: </span>' + ele._id + '</p>');
        thread.push('<p class="created_on"><span>Created on: </span>' + new Date(ele.created_on) + '</p>');
        thread.push('<form class="reportThread"><input type="hidden" name="report_id" value="' + ele._id + '"><input type="submit" value="Report"></form>');
        thread.push('<form class="deleteThread"><input type="hidden" value="' + ele._id + '" name="thread_id" required=""><input type="text" placeholder="Password" name="delete_password" required=""><input type="submit" value="Delete"></form>');
        thread.push('</div><div class="replies">');
        
        let hiddenCount = ele.replycount - 3;
        if (hiddenCount < 1) hiddenCount = 0;
        
        thread.push('<h3>' + ele.replycount + ' replies total (' + hiddenCount + ' hidden) - <a href="' + window.location.pathname + ele._id + '">See the full thread here</a></h3>');
        
        ele.replies.forEach(function(rep) {
          thread.push('<div class="reply">')
          thread.push('<p>' + rep.text + '</p>');
          thread.push('<p class="id"><span>ID: </span>' + rep._id + '</p>');
          thread.push('<p class="created_on"><span>Created on: </span>' + new Date(rep.created_on) + '</p>');
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
      
      $('#boardDisplay').html(boardThreads.join(''));
    }
  });
  
  
  
  
  
  $('#newThread').submit(function(){
    $(this).attr('action', "/api/threads/" + currentBoard);
  });

  $('#boardDisplay').on('submit','#reportThread', function(e) {
    var url = "/api/threads/"+currentBoard;
    $.ajax({
      type: "PUT",
      url: url,
      data: $(this).serialize(),
      success: function(data) { alert(data) }
    });
    e.preventDefault();
  });

  $('#boardDisplay').on('submit','#reportReply', function(e) {
    var url = "/api/replies/"+currentBoard;
    $.ajax({
      type: "PUT",
      url: url,
      data: $(this).serialize(),
      success: function(data) { alert(data) }
    });
    e.preventDefault();
  });

  $('#boardDisplay').on('submit','#deleteThread', function(e) {
    var url = "/api/threads/"+currentBoard;
    $.ajax({
      type: "DELETE",
      url: url,
      data: $(this).serialize(),
      success: function(data) { alert(data) }
    });
    e.preventDefault();
  });

  $('#boardDisplay').on('submit','#deleteReply', function(e) {
    var url = "/api/replies/"+currentBoard;
    $.ajax({
      type: "DELETE",
      url: url,
      data: $(this).serialize(),
      success: function(data) { alert(data) }
    });
    e.preventDefault();
  });              
});
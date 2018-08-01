/*
*
*
*       Complete the API routing below
*
*
*/

/*

helmet:

Only allow your site to be loading in an iFrame on your own pages.
Do not allow DNS prefetching.
Only allow your site to send the referrer for your own pages.

-------------------------
/api/threads:

I can GET an array of the most recent 10 bumped threads on the board with only the most recent 3 replies from /api/threads/{board}.
The reported and delete_password fields will not be sent.

I can POST a thread to a specific message board by passing form data text and delete_password to /api/threads/{board}.
(Recomend res.redirect to board page /b/{board})
Saved will be _id, text, created_on(date&time), bumped_on(date&time, starts same as created_on), reported(boolean), delete_password, & replies(array).

I can report a thread and change it's reported value to true by sending a PUT request to /api/threads/{board} and pass along the thread_id. 
(Text response will be 'success')

I can delete a thread completely if I send a DELETE request to /api/threads/{board} and pass along the thread_id & delete_password.
(Text response will be 'incorrect password' or 'success')

-------------------------
/api/replies:

I can GET an entire thread with all it's replies from /api/replies/{board}?thread_id={thread_id}. Also hiding the same fields.

I can POST a reply to a thread on a specific board by passing form data text, delete_password, & thread_id to /api/replies/{board}
and it will also update the bumped_on date to the comments date.
(Recomend res.redirect to thread page /b/{board}/{thread_id})
In the thread's 'replies' array will be saved _id, text, created_on, delete_password, & reported.

I can report a reply and change it's reported value to true by sending a PUT request to /api/replies/{board} and pass along the thread_id & reply_id. 
(Text response will be 'success')

I can delete a post(just changing the text to '[deleted]') if I send a DELETE request to /api/replies/{board} and pass along the thread_id, reply_id, & delete_password.
(Text response will be 'incorrect password' or 'success')

*/

'use strict';

const expect      = require('chai').expect;
const mongoClient = require('mongodb');
const ObjectId    = require('mongodb').ObjectID;

const URL = process.env.DB;

mongoClient.connect(URL, (err, db) => {
  if (err) {
    console.log("Database error: " + err);
  } else {
    console.log("Successful database connection");
  }
});

module.exports = function (app) {
  
  app.route('/api/threads/:board')
  
    .get((req, res) => {
      const board = req.params.board;
    
      mongoClient.connect(URL, (err, db) => {
        if (err) console.log(err);
        else {
          const collection = db.collection(board);
          
          // get array of most recent 10 bumped threads
          // shot last 3 replies
          // hide delete_password and reported
          
          collection.find().sort({bumped_on: -1}).limit(10).toArray((err, result) => {
            // limit replies to 3
            res.json(result);
          })
        }
      })
      
    })
  
    .post((req, res) => {
      const board  = req.params.board;
    
      const text            = req.body.text;
      const delete_password = req.body.delete_password;
      const created_on      = new Date();
      const bumped_on       = created_on;
      const replies         = [];
      const reported        = false;
    
      mongoClient.connect(URL, (err, db) => {
        if (err) console.log(err);
        else {
          const collection = db.collection(board);
          collection.insert({text: text, delete_password: delete_password, created_on: created_on, bumped_on: bumped_on, replies: replies, reported: reported}, (err, result) => {
            console.log("created db entry: ", result.ops[0], "board: ", board);
            
            res.redirect("/b/" + board + "/");
          })
        }
      })
    
    })
  
    .put((req, res) => {
      
    })
  
    .delete((req, res) => {
      
    })
    
  app.route('/api/replies/:board')
  
    .get((req, res) => {
      
    })
  
    .post((req, res) => {
      
    })
  
    .put((req, res) => {
      
    })
  
    .delete((req, res) => {
      
    })
  
};
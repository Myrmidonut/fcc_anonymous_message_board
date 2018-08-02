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

I can POST a reply to a thread on a specific message board by passing form data text, thread_id, and delete_password to /api/threads/{board}.

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
    
      //console.log("get call on thread");
    
      mongoClient.connect(URL, (err, db) => {
        if (err) console.log(err);
        else {
          const collection = db.collection(board);
          
          collection.find({}, {delete_password: 0, reported: 0}).sort({bumped_on: -1}).limit(10).toArray((err, result) => {
            result.forEach(e => {
              if (e.replies.length > 3) {
                e.replies = e.replies.slice(0, 3);
              }
            })
            
            res.json(result);
          })
        }
      })
      
    })
  
    .post((req, res) => {
      const board           = req.params.board;
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
      const board     = req.params.board;
      const report_id = ObjectId(req.body.report_id);
      
      mongoClient.connect(URL, (err, db) => {
        if (err) console.log(err);
        else {
          const collection = db.collection(board);
          
          collection.findOneAndUpdate({_id: report_id}, {$set: {reported: true}}, {returnOriginal: false}, (err, result) => {
            if (result.value) {
              res.json("success");
            } else if (result.value === null) {
              res.json("unsuccessful");
            }
          })
        }
      })
      
    })
  
    .delete((req, res) => {
      const board  = req.params.board;
      const thread_id = ObjectId(req.body.thread_id);
      const delete_password = req.body.delete_password;
    
      //console.log("board: ", board, " delete id: ", thread_id, " password: ", delete_password);
    
      mongoClient.connect(URL, (err, db) => {
        if (err) console.log(err);
        else {
          const collection = db.collection(board);
          
          collection.findOneAndUpdate({_id: thread_id, delete_password: delete_password}, {deleted: true}, {returnOriginal: false}, (err, result) => {
            //console.log("result: ", result);
            
            if (result.value) {
              //console.log("found with correct password");
              
              res.json("success");
            } else if (result.value === null) {
              //console.log("wrong password");
              
              res.json("incorrect password");
            }
            
          })
        }
      })
    
    })
    
  app.route('/api/replies/:board')
  
    .get((req, res) => {
      // I can GET an entire thread with all it's replies from /api/replies/{board}?thread_id={thread_id}. Also hiding the same fields.
    
      const board     = req.params.board;
      const thread_id = ObjectId(req.query.thread_id);
    
      //console.log(board, thread_id);
      
      mongoClient.connect(URL, (err, db) => {
        if (err) console.log(err);
        else {
          const collection = db.collection(board);
          
          collection.findOne({_id: thread_id}, {delete_password: 0, reported: 0, "replies.delete_password": 0, "replies.reported": 0}, (err, result) => {
            //console.log(result);
              
            res.json(result);
          })
        }
      })
     
    })
  
    .post((req, res) => {
      // I can POST a reply to a thread on a specific board by passing form data text, delete_password, & thread_id to /api/replies/{board}
      // and it will also update the bumped_on date to the comments date.
      // (Recomend res.redirect to thread page /b/{board}/{thread_id})
      // In the thread's 'replies' array will be saved _id, text, created_on, delete_password, & reported.
    
      const board           = req.params.board;
      const text            = req.body.text;
      const delete_password = req.body.delete_password;
      const thread_id       = ObjectId(req.body.thread_id);
      const reply_id        = new ObjectId();
      const created_on      = new Date();
      const bumped_on       = created_on;
    
      mongoClient.connect(URL, (err, db) => {
        if (err) console.log(err);
        else {
          const collection = db.collection(board);
          
          collection.findOneAndUpdate({_id: thread_id}, {$set: {bumped_on: bumped_on}, $push: {replies: {_id: reply_id, text: text, created_on: created_on, delete_password: delete_password, reported: false}}}, {returnOriginal: false}, (err, result) => {
            //console.log(result.value);
            
            res.redirect("/b/" + board + "/" + thread_id + "/");
          })
        }
      })
    })
  
    .put((req, res) => {
      // I can report a reply and change it's reported value to true by sending a PUT request to /api/replies/{board} and pass along the thread_id & reply_id. 
      // (Text response will be 'success')
    
      const board     = req.params.board;
      const thread_id = ObjectId(req.body.thread_id);

      mongoClient.connect(URL, (err, db) => {
        if (err) console.log(err);
        else {
          const collection = db.collection(board);
          
        }
      })
    })
  
    .delete((req, res) => {
      // I can delete a post(just changing the text to '[deleted]') if I send a DELETE request to /api/replies/{board} and pass along the thread_id, reply_id, & delete_password.
      // (Text response will be 'incorrect password' or 'success')
    
      const board           = req.params.board;
      const thread_id       = ObjectId(req.body.thread_id);
      const reply_id        = ObjectId(req.body.reply_id);
      const delete_password = req.body.delete_password;
      
      mongoClient.connect(URL, (err, db) => {
        if (err) console.log(err);
        else {
          const collection = db.collection(board);
          
          
          
          
          
          
          
          // array search ?
          
          
          
          collection.findOneAndUpdate({_id: thread_id, replies: {$elemMatch: {_id: reply_id, delete_password: delete_password}}}, {$set: {"replies.text": "[deleted]"}}, {returnOriginal: false}, (err, result) => {
            console.log(result);
            
            if (result.value) {
              console.log("found and deleted");
              
              res.json("success");
            } else if (result.value === null) {
              console.log("wrong password");
              
              res.json("incorrect password");
            }
          })
        }
      })
    })
  
};
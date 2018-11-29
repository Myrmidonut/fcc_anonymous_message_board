'use strict';

const expect      = require('chai').expect;
const MongoClient = require('mongodb');
const ObjectId    = require('mongodb').ObjectID;

const URL = process.env.DB;

MongoClient.connect(URL, (err, db) => {
  if (err) console.log("Database error: " + err);
  else console.log("Successful database connection");
});

module.exports = app => {
  app.route("/api/boards")
    .get((req, res) => {
      //console.log("get boards");
      
      MongoClient.connect(URL, (err, db) => {
        if (err) console.log(err);
        else {
          db.listCollections().toArray((err, result) => {
            const boards = result.map(e => e.name)
            res.json(boards);
          })
        }
      })
    })
  
  app.route("/api/threads/:board")
    .get((req, res) => {
      //console.log("get all threads for board");
      
      const board = req.params.board;
      
      MongoClient.connect(URL, (err, db) => {
        if (err) console.log(err);
        else {
          const collection = db.collection(board);
          
          collection
          .find({deleted: false}, {delete_password: 0, "replies.delete_password": 0}) // reported: 0, "replies.reported": 0 for testing
          .sort({bumped_on: -1})
          .limit(10)
          .toArray((err, result) => {     
            result.forEach(e => {
              e.replycount = e.replies.length;
              
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
      //console.log("post thread")
      
      const board           = req.params.board;
      const text            = req.body.text;
      const delete_password = req.body.delete_password;
      const created_on      = new Date();
      const bumped_on       = created_on;
      const replies         = [];
      const reported        = false;
      const deleted         = false;
      
      MongoClient.connect(URL, (err, db) => {
        if (err) console.log(err);
        else {
          const collection = db.collection(board);
          collection.insert({
            text: text,
            delete_password: delete_password,
            created_on: created_on,
            bumped_on: bumped_on,
            replies: replies,
            reported: reported,
            deleted: deleted
          }, (err, result) => {
            if (err) console.log(err);
            else {
              //res.redirect(`/b/${board}/`);
              res.send("Success")
            }
          })
        }
      })
    })
    
    .put((req, res) => {
      //console.log("report thread");
      
      const thread_id = req.body.thread_id;
      const board = req.params.board;
      
      if (thread_id.length !== 24) {
        res.json("ID invalid");
      } else {
        MongoClient.connect(URL, (err, db) => {
          if (err) console.log(err);
          else {
            const collection = db.collection(board);
            
            collection.findOneAndUpdate({_id: ObjectId(thread_id)}, {$set: {reported: true}}, {returnOriginal: false}, (err, result) => {
              if (err) {
                console.log(err);
                
                res.send("could not update " + req.body.thread_id);
              } else if (result.value !== null) {
                res.send("reported")
              } else {
                res.send("unsuccessful");
              }
            })
          }
        })
      }
    })
    
    .delete((req, res) => {
      //console.log("delete thread");
      
      const board  = req.params.board;
      const thread_id = req.body.thread_id;
      const delete_password = req.body.delete_password;
      
      if (thread_id.length !== 24) {
        res.json("ID invalid");
      } else {
        MongoClient.connect(URL, (err, db) => {
          if (err) console.log(err);
          else {
            const collection = db.collection(board);
            
            collection.findOneAndUpdate({_id: ObjectId(thread_id), delete_password: delete_password}, {$set: {deleted: true}}, {returnOriginal: false}, (err, result) => {
              if (result.value) {
                res.json("success");
              } else if (result.value === null) {
                res.json("incorrect password");
              }
            })
          }
        })
      }
    })
    
  app.route("/api/replies/:board")
    .get((req, res) => {
      //console.log("get thread on specific board")
      
      const board     = req.params.board;
      const thread_id = req.query.thread_id;
      
      MongoClient.connect(URL, (err, db) => {
        if (err) console.log(err);
        else {
          const collection = db.collection(board);
          
          collection.findOne({_id: ObjectId(thread_id)}, {delete_password: 0, "replies.delete_password": 0}, (err, result) => { // reported: 0, "replies.reported": 0 for testing
            res.json(result);
          })
        }
      })
    })
    
    .post((req, res) => {
      //console.log("post reply");
      
      const board           = req.params.board;
      const text            = req.body.text;
      const delete_password = req.body.delete_password;
      const thread_id       = req.body.thread_id;
      const reply_id        = new ObjectId();
      const created_on      = new Date();
      const bumped_on       = created_on;
      const reported        = false;
      
      if (thread_id.length !== 24) {
        res.json("ID invalid");
      } else {
        MongoClient.connect(URL, (err, db) => {
          if (err) console.log(err);
          else {
            const collection = db.collection(board);
            
            collection.findOneAndUpdate({_id: ObjectId(thread_id)}, {
              $set: {bumped_on: bumped_on},
              $push: {
                replies: {
                  _id: reply_id,
                  text: text,
                  created_on: created_on,
                  delete_password: delete_password,
                  reported: reported
                }
              }
            }, {returnOriginal: false}, (err, result) => {
              if (err) console.log(err)
              else if (result.value === null) {
                res.json("ID not found")
              } else {
                //res.redirect("/b/" + board + "/" + thread_id + "/");
                res.json("Success");
              }
            })
          }
        })
      }
    })
    
    .put((req, res) => {
      //console.log("report reply");
      
      const board     = req.params.board;
      const thread_id = req.body.thread_id;
      const reply_id  = req.body.reply_id;
      
      if (thread_id.length !== 24 || reply_id.length !== 24) {
        res.json("ID invalid");
      } else {
        MongoClient.connect(URL, (err, db) => {
          if (err) console.log(err);
          else {
            const collection = db.collection(board);
            
            collection.findOneAndUpdate({_id: ObjectId(thread_id), "replies._id": ObjectId(reply_id)}, {$set: {"replies.$.reported": true}}, {returnOriginal: false}, (err, result) => {
              if (result.value) {
                res.json("reported");
              } else if (result.value === null) {
                res.json("unsuccessful");
              }
            })
          }
        })
      }
    })
    
    .delete((req, res) => {
      //console.log("delete reply");
      
      const board           = req.params.board;
      const thread_id       = req.body.thread_id;
      const reply_id        = req.body.reply_id;
      const delete_password = req.body.delete_password;
      
      if (thread_id.length !== 24 || reply_id.length !== 24) {
        res.json("ID invalid");
      } else {
        MongoClient.connect(URL, (err, db) => {
          if (err) console.log(err);
          else {
            const collection = db.collection(board);
            
            collection.findOneAndUpdate({_id: ObjectId(thread_id), "replies._id": ObjectId(reply_id), "replies.delete_password": delete_password}, {$set: {"replies.$.text": "[deleted]"}}, {returnOriginal: false}, (err, result) => {
              if (result.value) {
                res.json("success");
              } else if (result.value === null) {
                res.json("incorrect password");
              }
            })
          }
        })
      }
    })
};
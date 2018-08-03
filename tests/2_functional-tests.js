/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chaiHttp = require('chai-http');
const chai     = require('chai');
const assert   = chai.assert;
const server   = require('../server');

let thread_id1;
let thread_id2;
let reply_id;

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      
      test("Create a thread", function(done) {
        chai.request(server)
          .post("/api/threads/test")
          .send({text: "text", delete_password: "password"})
          .end((err, res) => {
            assert.equal(res.status, 200);
          })
        
        chai.request(server)
          .post("/api/threads/test")
          .send({text: "text", delete_password: "password"})
          .end((err, res) => {
            assert.equal(res.status, 200);
            
            done();
          })
      })
    });
    
    suite('GET', function() {
      
      test("Show all threads", function(done) {
        chai.request(server)
          .get("/api/threads/test")
          .end((err, res) => {
            assert.equal(res.status, 200);
          
            assert.isArray(res.body);
            assert.isAtMost(res.body.length, 10);
          
            assert.isAtMost(res.body[0].replies.length, 3);
            assert.notProperty(res.body[0], "reported");
            assert.notProperty(res.body[0], "delete_password");
            assert.property(res.body[0], "_id");
            assert.property(res.body[0], "text");
            assert.property(res.body[0], "created_on");
            assert.property(res.body[0], "bumped_on");
            assert.property(res.body[0], "replies");
          
            thread_id1 = res.body[0]._id;
            thread_id2 = res.body[1]._id;
          
            done();
          })
      })
    });
    
    suite('DELETE', function() {
      
      test("Wrong password to delete a thread", function(done) {
        chai.request(server)
          .delete("/api/threads/test")
          .send({thread_id: thread_id1, delete_password: "asdf"})
          .end((err, res) => {
            assert.equal(res.status, 200);
            
            assert.equal(res.body, "incorrect password");
            
            done();
          })
      })
      
      test("Correct password to delete a thread", function(done) {
        chai.request(server)
          .delete("/api/threads/test")
          .send({thread_id: thread_id2, delete_password: "password"})
          .end((err, res) => {
            assert.equal(res.status, 200);
          
            assert.equal(res.body, "success");
            
            done();
          })
      })
    });
    
    suite('PUT', function() {
      
      test("Report a thread", function(done) {
        chai.request(server)
          .put("/api/threads/test")
          .send({report_id: thread_id2})
          .end(function(err, res){
            assert.equal(res.status, 200);
          
            assert.equal(res.body, "reported");
          
            done();
          });
      })
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      
      test("Create a reply", function(done) {
        chai.request(server)
          .post("/api/replies/test")
          .send({text: "text", delete_password: "password", thread_id: thread_id1})
          .end((err, res) => {
            assert.equal(res.status, 200);
          
            done();
          })
      })
    });
    
    suite('GET', function() {
      
      test("Show all replies", function(done) {
        chai.request(server)
          .get("/api/replies/test")
          .query({thread_id: thread_id1})
          .end((err, res) => {
            assert.equal(res.status, 200);
          
            assert.property(res.body, '_id');
          
            reply_id = res.body.replies[0]._id;
          
            done();
          })
      })
    });
    
    suite('PUT', function() {
      
      test("Report a reply, wrong reply_id", function(done) {
        chai.request(server)
          .put("/api/replies/test")
          .send({thread_id: thread_id1, reply_id: 1})
          .end(function(err, res){
            assert.equal(res.status, 200);
          
            console.log(res.body);
          
            assert.equal(res.body, "unsuccessful");
          
            done();
          });
      })
      
      test("Report a reply", function(done) {
        this.timeout(5000);
        chai.request(server)
          .put("/api/replies/test")
          .send({thread_id: thread_id1, reply_id: reply_id})
          .end(function(err, res){
            assert.equal(res.status, 200);
          
            console.log(res.body)
          
            assert.equal(res.body, "reported");
          
            done();
          });
      })
    });
    
    suite('DELETE', function() {
      
      test("Delete a reply, wrong password", function(done) {
        chai.request(server)
          .delete("/api/replies/test")
          .send({thread_id: thread_id1, reply_id: reply_id, delete_password: "asdf"})
          .end((err, res) => {
            assert.equal(res.status, 200);
          
            assert.equal(res.body, "incorrect password");
          
            done();
          })
      })
      
      test("Delete a reply", function(done) {
        chai.request(server)
          .delete("/api/replies/test")
          .send({thread_id: thread_id1, reply_id: reply_id, delete_password: "password"})
          .end((err, res) => {
            assert.equal(res.status, 200);
          
            assert.equal(res.body, "success");
          
            done();
          })
      })
    });
    
  });

});
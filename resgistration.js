var http = require('http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
//var database = require(__dirname+"/"+"dataBase.js");
var couchbase = require("couchbase");
var cluster = new couchbase.Cluster('192.168.1.88');
var path = require('path');
var N1qlQuery = couchbase.N1qlQuery;
var ViewQuery = couchbase.ViewQuery;
app.use(express.static(path.normalize(__dirname+'/')));
app.use(express.static(path.normalize(__dirname+'/app')));
app.use(bodyParser.json());
var urlEncodedParser = bodyParser.urlencoded({ extended : false});

// html pages
app.get('/',function(req,res){
  res.sendFile(__dirname+"/app/index.html");
})

// Requests
app.post('/employeeDetails',urlEncodedParser,function(req,res){
  console.log(req.body);
  response = {
    first_name : req.body.firstName,
    last_name : req.body.lastName,
    age : req.body.age,
    gender : req.body.gender,
    previous_company: req.body.prevCompany,
    role : req.body.role,
    experience: req.body.experience,
    email:req.body.email,
    mobile: req.body.mobile,
    alternate_mobile:req.body.altMobile
   }
//   console.log(response);
   var bucket = cluster.openBucket('employee', function(err) {
    if (err) {
      throw err;
    }
    bucket.insert(response.first_name+" "+response.last_name, response, function(err, resp) {
      if (err) {
        console.log('Error in inserting the document', err);
        console.log(err.code+""+typeof(err.code));
        if(err.code === 12){
          response.couchbaseMessage = "User Name"+" : "+response.first_name+","+" "+"Already Exist in Data Base!!!";
        }
        console.log(response);
        res.end(JSON.stringify(response));
        return;
      }
      response.couchbaseMessage = "Successfully Registered";
      res.end(JSON.stringify(response));
//      console.log('success!', res);
    });
  });
//  res.end(JSON.stringify(response));
});

app.post('/getEmployeeDetails',function(req,res){
  var bucket = cluster.openBucket('employee', function(err) {
    if(err){
      console.log("****While fetching all documents from the bucket****");
      console.log(err);
    }
    var query = ViewQuery.from('getEmply','getEmply');
//    var query = ViewQuery.from('testGetEmply','testGetEmply');
    bucket.query(query, function(err, results) {
      res.end(JSON.stringify(results));
    })
  });
});


var server = app.listen('8028',function(){
//  var host = server.address().address;
//  var port = server.address().port;
  var host = "127.0.0.1";
  var port = "8951";
  console.log("myWebApp is listenting at http://%s:%s",host,port);
})

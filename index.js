var express = require("express");
var mongoose = require("mongoose");
var bodyparser = require("body-parser");
var app = express();

mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;

db.once("open",function(){
  console.log("db connected");
});

db.on("error",function(err){
  console.log("db error : ",err);
});

app.set("view engine","ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

var contactschema = mongoose.Schema({
  name:{type:String, required:true, unique:true},
  email:{type:String},
  phone:{type:String}
});
var contact = mongoose.model("contact", contactschema);

app.get("/hello",function(req,res){
  res.render("hello", {name:req.query.nameQuery});
});

app.get("/hello/:nameParam",function(req,res){
  res.render("hello", {name:req.params.nameParam});
});

app.get("/contacts",function(req,res){
  contact.find({}, function(err,contacts){
    if(err) return res.json(err);
    res.render("contacts/index",{contacts:contacts});
  });
});

app.get("/contacts/new",function(req,res){
  res.render("contacts/new");
});

app.post("/contacts",function(req,res){
  contact.create(req.body,function(err,contact){
    if(err) return res.json(err);
    res.redirect("/contacts");
  });
});

app.listen(3000, function(){
  console.log('server on!');
});

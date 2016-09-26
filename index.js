var express = require("express");
var mongoose = require("mongoose");
var bodyparser = require("body-parser");
var methodoverride = require("method-override");
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
app.use(methodoverride("_method"));

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

app.get("/contacts/:id",function(req,res){
  contact.findOne({_id:req.params.id},function(err,contact){
    if(err) return res.json(err);
    res.render("contacts/show",{contact:contact});
  });
});

app.get("/contacts/:id/edit",function(req,res){
  contact.findOne({_id:req.params.id},function(err,contact){
    if(err) return res.json(err);
    res.render("contacts/edit",{contact:contact});
  });
});

app.post("/contacts",function(req,res){
  contact.create(req.body,function(err,contact){
    if(err) return res.json(err);
    res.redirect("/contacts");
  });
});

app.put("/contacts/:id",function(req,res){
  contact.findOneAndUpdate({_id:req.params.id},req.body,function(err,contact){
    if(err) return res.json(err);
    res.redirect("/contacts/"+req.params.id);
  });
});

app.delete("/contacts/:id",function(req,res){
  contact.remove({_id:req.params.id},function(err,contact){
    if(err) return res.json(err);
    res.redirect("/contacts");
  });
});

app.listen(8080, function(){
  console.log('server on!');
});

const express=require("express");
const exphbs = require("express-handlebars");
const bodyParser=require("body-parser"); 
//const Calender = require("./calendar");

const app = express();
//const calendar=calender();

app.engine("handlebars",exphbs({
    partialsDir: "./views/partials",
    viewPath:  './views',
    layoutsDir : './views/layouts'
}));

app.set("view engine","handlebars");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.get("/", function(req, res){
    res.redirect("/dashboard");
  });

app.get("/dashboard", function(req,res){
    res.render('dashboard');
});

app.post("/bill", function(req,res){
    console.log(req.body)

});

app.get("/bill", function(req,res){
    res.render('bill');
});
  
app.post("/loadsheding", function(req,res){
    console.log(req.body)

});

app.get("/loadsheding", function(req,res){
    res.render('loadsheding');
});

app.post("/usage", function(req,res){
    console.log(req.body)

});
app.get("/usage", function(req,res){
    res.render('usage')

});




const PORT = process.env.PORT|| 9000

app.listen(PORT,function(){
    console.log("App started at port:", PORT)
});
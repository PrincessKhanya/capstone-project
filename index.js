const express=require("express");
const exphbs = require("express-handlebars");
const bodyParser=require("body-parser");
const session=require('express-session') 
//const Calender = require("./calendar");

const app = express();
//const calendar=Calender();

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))

const users=[];

app.engine("handlebars",exphbs({
    partialsDir: "./views/partials",
    viewPath:  './views',
    layoutsDir : './views/layouts'
}));

app.set("view engine","handlebars"
);

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.get("/", function (req, res) {
    res.render('index.handlebars'
    // , { user: req.user }
    );
  });
  
  // const isLoggedIn=async (req, res, next) => {
  //   // console.log(req.cookies);
  //   if( req.cookies.jwt) {
  //     try {
  //       //1) verify the token
  //       const decoded = await promisify(jwt.verify)(req.cookies.jwt,
  //       process.env.JWT_SECRET
  //       );
  
  //       console.log(decoded);
  
  //       //2) Check if the user still exists
  //       db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (error, result) => {
  //         console.log(result);
  
  //         if(!result) {
  //           return next();
  //         }
  
  //         req.user = result[0];
  //         console.log("user is")
  //         console.log(req.user);
  //         return next();
  
  //       });
  //     } catch (error) {
  //       console.log(error);
  //       return next();
  //     }
  //   } else {
  //     next();
  //   }
  // }
  
  app.get("/login", function (req, res) {
    res.render('login.handlebars');
  
  });
  
  app.post("/login", async function (req, res) {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).render('login', {
          message: 'Please provide an email and password'
        })
      }
  
      db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
        console.log(results);
        if (!results || !(await bcrypt.compare(password, results[0].password))) {
          res.status(401).render('login', {
            message: 'Email or Password is incorrect'
          })
        } else {
          const id = results[0].id;
  
          const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
          });
  
          console.log("The token is: " + token);
  
          const cookieOptions = {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
          }
  
          res.cookie('jwt', token, cookieOptions);
          res.status(200).redirect("/");
        }
  
      })
  
    } catch (error) {
      console.log(error);
    }
  
    req.session.name=req.body.name;
    res.redirect("/dashboard")
  
  });
  
  app.get("/register", function (req, res) {
    res.render('register.handlebars');
  });
  
  app.post("/register", function (req, res) {
  
    console.log(req.body);
    const name = req.body.name;
    const email = req.body.email;
    const meterNumber = req.body.meterNumber;
    const address = req.body.address;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;
  
    db.query('SELECT email FROM user WHERE email = ?', [email], async (error, results) => {
      if (error) {
        console.log(error)
      }
  
      if (results.length > 0) {
        return res.render('register', {
          message: "That email is already in use"
        });
      } else if (password !== passwordConfirm) {
        return res.render('register', {
          message: "Passwords do not match"
        });
      }
  
      let hashedPassword = await bcrypt.hash(password, 8);
  
      console.log(hashedPassword);
  
      db.query('INSERT INTO user SET ? ', { name: name, email: email, meterNumber: meterNumber, address: address, password: hashedPassword }, (error, results) => {
        if (error) {
          console.log(error);
        } else {
          console.log(results)
          return res.render('register', {
            message: "User registered"
          }), res.redirect('/login');
        }
      })
    });
  });
  
  
  app.get("/dashboard", function (req, res) {
    res.render('dashboard');
    // console.log(req.user);
    // if (req.user) {
    //   res.render('profile', {
    //     user: req.user
    //   });
    // } else {
    //   res.redirect('/dashboard');
    // }
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
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const User = require('./models/user');
const Doctor = require('./models/doctor');
const util = require('util');
const TextEncoder = new util.TextEncoder();
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static('public'));
mongoose.connect('mongodb://localhost:27017/medic', {useNewUrlParser: true, useUnifiedTopology: true});
const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/medic',
    collection: 'sessions'
  });
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store:store,
  }));

app.use(flash());
app.use((req, res, next)=>{
    if(!req.session.user){
        next();
    } else{
        User.findById(req.session.user._id, (err, user)=>{
             if(!err){
              req.user = user;
              next();
             }
        })
        
    }
});
app.use((req, res, next)=>{
    if(!req.session.doctor){
        next();
    } else{
        Doctor.findById(req.session.doctor._id, (err, doctor)=>{
             if(!err){
              req.doctor = doctor;
              next();
             }
        })
        
    }
});

app.use((req, res, next)=>{
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.isAdmin = req.session.adminLoggedIn;
    res.locals.isDoctor = req.session.doctorLoggedIn;
    res.locals.error = req.flash("error");
    res.locals.msg = req.flash("msg");
   
    next();
});

//routes
const authRoute = require('./routes/auth');
const adminRoute = require('./routes/admin');
const medicRoute = require('./routes/medic');

app.get("/",(req, res)=>{
    res.render("home");
})

//middleware
app.use(authRoute);
app.use(adminRoute);
app.use(medicRoute);

app.listen(3000, ()=>{
    console.log("server is running on port 3000!");
});

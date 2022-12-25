const bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
const User = require('../models/user');
const Doctor = require('../models/doctor');
var options = {
  auth: {
      api_key: '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'
  }
}
var mailer = nodemailer.createTransport(sgTransport(options));


exports.getLogin = (req, res, next)=>{
    res.render("auth/login");
}

exports.getRegister = (req, res, next)=>{
    res.render("auth/register");
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
     
    User.findOne({email:email})
      .then(user => {
        if(!user){
           Doctor.findOne({email:email}, (err, doctor)=>{
               if(!doctor){
                req.flash('error','invalid user or password!')
                res.redirect("/login")
               }else{
                bcrypt.compare(password, doctor.password, function(err, doMatch){
                    if(doMatch){
                      req.session.isLoggedIn = true;
                      req.session.doctorLoggedIn = true;
                      req.session.doctor = doctor;
                      req.session.save(err => {
                      console.log(err);
                      req.flash('msg','successfully logged in');
                       res.redirect('/');
                         });
                    }else{
                      req.flash('error','invalid password!')
                      res.redirect("/login");
                      
                    }
                  })
               }
           });
          
        } else if(user.email ==="admin@gmail.com"){
               
          bcrypt.compare(password, user.password, function(err, doMatch){
            if(doMatch){
              req.session.isLoggedIn = true;
              req.session.adminLoggedIn = true;
              req.session.user = user;
              req.session.save(err => {
              console.log(err);
              req.flash('msg','successfully logged in with email: '+user.email);
               res.redirect('/');
                 });
            }else{
              req.flash('error','invalid password!')
              res.redirect("/login");
              
            }
          })
        } else{
          bcrypt.compare(password, user.password, function(err, doMatch){
            if(doMatch){
              req.session.isLoggedIn = true;
              req.session.user = user;
              req.session.save(err => {
              console.log(err);
              req.flash('msg','successfully logged in with email: '+user.email);
               res.redirect('/');
               
                 });
            }else{
              req.flash('error','invalid password!')
              res.redirect("/login")
            }
          })
        }
        
      })
      .catch(err => console.log(err));
  };
  
  exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    bcrypt.hash(password, 12).then(hashedPassword=>{
      User.findOne({email:email}, function(err, user){
        if(user){
          req.flash('error','email already in use');
          console.log("email already exist!!!");
          res.redirect("/register")
        } else{
          const user = new User({
            email:email,
            password:hashedPassword,
          });
          user.save(function(err){
            if(!err){
              req.flash('msg', 'successfully registered yourself!!!');
              res.redirect("/login");
              var email = {
                to: req.body.email,
                from: 'virusspi269@gmail.com',
                subject: 'Hi there',
                text: 'Awesome sauce',
                html: '<h1>successfully registered in medic app</h1>'
            };
             
            mailer.sendMail(email, function(err, res) {
                if (err) { 
                    console.log(err) 
                }
                console.log(res);
            });
            }
          })
        }
      })
  
    })
    const confirmPasssword = req.body.confirmPasssword;
    
  };

  exports.getLogout = (req, res, next) => {
    req.session.destroy(err => {
      console.log(err);
      res.redirect('/');
    });
  };
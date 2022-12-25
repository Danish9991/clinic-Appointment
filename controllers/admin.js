const bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
const User = require('../models/user');
const Doctor = require('../models/doctor');
const Notification = require('../models/notification');
const Appointment = require('../models/appointment');
var options = {
  auth: {
      api_key: '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'
  }
}
var mailer = nodemailer.createTransport(sgTransport(options));
exports.getAddDoctor = (req, res, next)=>{
    res.render("admin/addDoctor")
}

exports.postAddDoctor = (req, res, next) => {
  if(req.body.hid===''){
    const email = req.body.email;
    const password = req.body.password;
    bcrypt.hash(password, 12).then(hashedPassword=>{
      Doctor.findOne({email:email}, function(err, doctor){
        if(doctor){
          req.flash('error','email already in use');
          console.log("email already exist!!!");
          res.redirect("/register")
        } else{
          var imageFile=req.file.filename;
          const doctor = new Doctor({
            email:email,
            name:req.body.name,
            image:imageFile,
            specialization :req.body.specialization,
            description:req.body.description,
            password:hashedPassword,
          });
          doctor.save(function(err){
            if(!err){
              req.flash('msg', 'doctor added successfully!!!');
              res.redirect("/view-administration");
              var email = {
                to: req.body.email,
                from: 'virusspi269@gmail.com',
                subject: 'Hi there',
                text: 'Awesome sauce',
                html: '<h1>successfully registered in shop app</h1>'
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
  }else{
    Doctor.findById({_id:req.body.hid},(err, doctor)=>{
      if(!err){
        var password = req.body.password;
        bcrypt.hash(password, 12).then(hashedPassword=>{
        doctor.name = req.body.name;
        doctor.email = req.body.email;
        doctor.image = req.file.filename;
        doctor.specialization = req.body.specialization;
        doctor.description = req.body.description;
        doctor.password = hashedPassword;
        doctor.save((err)=>{
          if(!err){
            req.flash('msg','administrator updated successfully')
            res.redirect('/doctorDetails/'+req.body.hid);
          }
        })
      })
    };
    })
  }
    const confirmPasssword = req.body.confirmPasssword;
    
  };

 exports.getAddAdminitration = (req, res, next)=>{
   res.render("admin/add-administration",{doctor:req.body});
 }
 
 exports.getAdministration = (req, res, next)=>{
   Doctor.find({}, (err, doctors)=>{
    res.render("admin/view-administration",{doctors:doctors});
   })

 }
 exports.getAdministrationDetails = (req, res, next)=>{
  var doctorId = req.params.id;
  Doctor.findById({_id:doctorId}, (err, doctor)=>{
    res.render("admin/administration-details",{doctor:doctor});
  })
 }

 exports.getEditAdminitration = (req, res, next)=>{
   Doctor.findById({_id:req.params.id},(err, doctor)=>{
     if(!err){
      res.render("admin/add-administration",{doctor:doctor});
     }

   })
 
}
exports.getDeleteAdministration = (req, res, next)=>{
  Doctor.findByIdAndRemove({_id:req.params.id},(err, doctor)=>{
    if(!err){
      req.flash('msg','administrator deleted successfully')
      res.redirect("/view-administration")
    }
  })
}

exports.getAddNotification = (req, res, next)=>{
  res.render("admin/add-notification");
}

exports.postAddNotification = (req, res, next)=>{
  var notification = new Notification({
    description: req.body.description,
  });
  notification.save((err)=>{
    if(!err){
      req.flash('msg','notification uploaded successfully');
      res.redirect("/adminDashboard");
    }
  })
}

exports.viewAdminAppointments = (req, res, next)=>{
  var y = 1;
  Appointment.find({})
  .populate('doctorId', 'name specialization')
  .populate('userId','email')
  .exec(function(err, complete){
         if(!err){
              console.log("complete",complete);
              res.render('admin/all-appointments',{appointment:complete,x:y});
         }           
      })
}

exports.getAdminDashboard = (req, res, next)=>{
  res.render("admin/dashboard")
}
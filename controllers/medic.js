const Notification = require('../models/notification');
const Doctor = require('../models/doctor');
const Appointment = require('../models/appointment');
var ObjectId = require('mongoose').Types.ObjectId;
exports.getNotification = (req, res, next)=>{
    Notification.find({}).sort({create: 'desc'}).exec((err, notifications)=>{
        if(!err){
            res.render("medic/notification",{notifications:notifications});
        }
        
    })
    
}

exports.getNotify = (req, res, next)=>{
    Notification.findById({_id:new ObjectId(req.params.id)},(err, notif)=>{
        if(!err){
            console.log(notif);
            res.render("medic/view-notification",{notify:notif});
        }

    })
}

exports.getAppointment = (req, res, next)=>{
    Doctor.find({},(err, doctors)=>{
        res.render("medic/appointment",{doctors:doctors})
    })    
}

exports.postAppointment = (req, res, next)=>{
    Doctor.findOne({name:req.body.doctor},(err, doctor)=>{
        var appointment = new Appointment({
           contact: req.body.contact,
           time:req.body.time,
           userId: req.session.user._id,
           doctorId: doctor._id,
        });
        appointment.save((err)=>{
            if(!err){
                req.flash('msg','appointment successfuly booked');
                res.redirect('/');
            }
        })
    })
    
}
exports.viewAppointments = (req, res, next)=>{
    var y = 1;
    Appointment.find({userId:req.session.user._id})
    .populate('doctorId', 'name specialization')
    .exec(function(err, complete){
           if(!err){
                console.log(JSON.stringify(complete));
                res.render('medic/view-appointments',{appointment:complete,x:y});
           }           
        })
}

exports.viewDoctorAppointments = (req, res, next)=>{
    var y = 1;
    Appointment.find({doctorId:req.session.doctor._id})
    .populate('userId', 'email')
    .exec(function(err, complete){
           if(!err){
                console.log(complete);
                res.render('medic/viewDoctor-appointments',{appointment:complete,x:y});
           }           
        })
}


exports.getServices = (req, res, next)=>{
    res.render("medic/services");
}

exports.getAdministration = (req, res, next)=>{
    Doctor.find({}, (err, doctors)=>{
        res.render("medic/view-administration",{doctors:doctors});
       })
}
const express = require('express');

const multer = require('multer');

const path = require('path');

const router = express.Router();

const adminController = require('../controllers/admin');

var Storage= multer.diskStorage({
    destination:"./public/uploads/",
    filename:(req,file,cb)=>{
      cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
    }
  });
  var upload = multer({
    storage:Storage
  }).single('file');

const auth = require('../middlewares/adminAuth');

// router.get('/addDoctor',auth.adminauth, adminController.getAddDoctor);

// router.post('/addDoctor',auth.adminauth, adminController.postAddDoctor);

router.get('/add-administration',auth.adminauth, adminController.getAddAdminitration);

router.post('/add-administration',auth.adminauth,upload, adminController.postAddDoctor);

router.get('/view-administration',auth.adminauth, adminController.getAdministration);

router.get('/doctorDetails/:id',auth.adminauth, adminController.getAdministrationDetails);

router.get('/editDoctor/:id',auth.adminauth, adminController.getEditAdminitration);

router.get('/deleteDoctor/:id',auth.adminauth, adminController.getDeleteAdministration);

router.get('/addNotification',auth.adminauth, adminController.getAddNotification);

router.post('/addNotification',auth.adminauth, adminController.postAddNotification);

router.get('/allAppointments',auth.adminauth, adminController.viewAdminAppointments);

router.get('/adminDashboard',auth.adminauth, adminController.getAdminDashboard);


module.exports = router;
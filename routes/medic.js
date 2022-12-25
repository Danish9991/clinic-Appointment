const express = require('express');

const router = express.Router();

const medicController = require('../controllers/medic');

const auth = require('../middlewares/userAuth');

const docauth = require('../middlewares/doctorAuth');

router.get('/notification/:id',auth.authenticate, medicController.getNotify);

router.get('/notifications', medicController.getNotification);

router.get('/appointment',auth.authenticate, medicController.getAppointment);

router.post('/appointment',auth.authenticate, medicController.postAppointment);

router.get('/viewAppointment',auth.authenticate, medicController.viewAppointments);

router.get('/doctorAppointments',docauth.adminauth, medicController.viewDoctorAppointments);

router.get("/services", medicController.getServices);

router.get("/administration", medicController.getAdministration);

module.exports = router;
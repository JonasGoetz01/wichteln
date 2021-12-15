const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.get('/wichteln/', controller.home);

router.get('/wichteln/userview/:uuid', controller.userview);
//router.get('/wichteln/pdf/', controller.createpdf);
router.get('/wichteln/createuuid/', controller.createuuid);
router.get('/wichteln/makeassignment/', controller.makeAssignments);
router.get('/wichteln/createpdf/', controller.createpdf);
router.get('/wichteln/deleteassignment/', controller.deleteAssignment);
router.get('/wichteln/usermanagement/', controller.viewuser);
router.post('/wichteln/usermanagement/', controller.finduser);
router.get('/wichteln/usermanagement/adduser', controller.formuser);
router.post('/wichteln/usermanagement/adduser', controller.createuser);
router.get('/wichteln/usermanagement/edituser/:id', controller.edituser);
router.post('/wichteln/usermanagement/edituser/:id', controller.updateuser);
router.get('/wichteln/usermanagement/viewuser/:id', controller.viewalluser);
router.get('/wichteln/usermanagement/:id',controller.deleteuser);
  
module.exports = router;
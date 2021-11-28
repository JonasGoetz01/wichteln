const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

// Routes
router.get('/', controller.home);

router.get('/usermanagement/', controller.viewuser);
router.post('/usermanagement/', controller.finduser);
router.get('/usermanagement/adduser', controller.formuser);
router.post('/usermanagement/adduser', controller.createuser);
router.get('/usermanagement/edituser/:id', controller.edituser);
router.post('/usermanagement/edituser/:id', controller.updateuser);
router.get('/usermanagement/viewuser/:id', controller.viewalluser);
router.get('/usermanagement/:id',controller.deleteuser);
  
module.exports = router;
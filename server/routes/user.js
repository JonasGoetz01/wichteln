const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Routes
router.get('/', userController.home);
router.get('/sale/:id',userController.sale);
router.get('/sale/',userController.sale);
router.get('/overview/:id',userController.overview);
router.get('/makesale/:id/:drink',userController.makesale);
router.get('/admin/', userController.admin);
router.get('/pay/:user_id/:id', userController.pay);
router.get('/payall/:user_id/', userController.payall);

router.get('/admin/drinkmanagement/', userController.viewdrink);
router.get('/admin/drinkmanagement/adddrink', userController.formdrink);
router.post('/admin/drinkmanagement/adddrink', userController.createdrink);
router.get('/admin/drinkmanagement/editdrink/:id', userController.editdrink);
router.post('/admin/drinkmanagement/editdrink/:id', userController.updatedrink);
router.get('/admin/drinkmanagement/viewdrink/:id', userController.viewalldrink);
router.get('/admin/drinkmanagement/:id',userController.deletedrink);

router.get('/admin/usermanagement/', userController.viewuser);
router.post('/admin/usermanagement/', userController.finduser);
router.get('/admin/usermanagement/adduser', userController.formuser);
router.post('/admin/usermanagement/adduser', userController.createuser);
router.get('/admin/usermanagement/edituser/:id', userController.edituser);
router.post('/admin/usermanagement/edituser/:id', userController.updateuser);
router.get('/admin/usermanagement/viewuser/:id', userController.viewalluser);
router.get('/admin/usermanagement/:id',userController.deleteuser);
  
module.exports = router;
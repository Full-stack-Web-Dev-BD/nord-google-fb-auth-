const router=require('express').Router()
const userController=require('../controller/userController')





router.post('/register',userController.register)
router.post('/login',userController.login)
router.get('/single-user/:id',userController.getSingleUser)
router.post('/socialLogin',userController.socialLogin)
router.get('/confirm/:jwt',userController.confirmation)




module.exports=router
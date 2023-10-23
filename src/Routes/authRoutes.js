import { Router } from 'express'
import * as controller from '../Controllers/authController.js'
const router = Router()

router.post('/login', controller.loginController)

router.post('/register', controller.signupController)

router.delete('/remove-account', controller.deleteAccountController)

export default router

import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  console.log('first')
  res.send('<h1> hello </h1>')
})

export default router

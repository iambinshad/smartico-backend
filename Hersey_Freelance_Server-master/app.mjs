import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import userRouter from './Router/userRoutes.mjs'
import vendorRouter from './Router/vendorRoutes.mjs'
import adminRouter from './Router/adminRoutes.mjs'

const app = express()

app.use((req, res, next) => {
  res.header("Cache-Control", "private,no-cache,no-store,must-revalidate");
  next();
});

// fixing "413 Request Entity Too Large" errors
app.use(express.json({ limit: "5mb" }))
app.use(express.urlencoded({ limit: "5mb", extended: true, parameterLimit: 50000 }))

app.use(cors({ origin: true }));
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false})),
app.use(cookieParser())

app.use('/', userRouter)
app.use('/admin', adminRouter)
app.use('/vendor', vendorRouter)
// app.use('*',(req, res) =>{
//   res.render('pageNotFound')
// })

export default app;
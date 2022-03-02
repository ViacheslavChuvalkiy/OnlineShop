const dotenv = require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 5000;
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')


//Connect to Server
connectDB();

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(errorHandler)

app.get('/', (req,res) => {
  res.status(200).json({message: "hello"})
})

//Routes
app.use('/api/users', require('./routes/userRoutes'));

app.listen(PORT, () => {
  console.log(`server started on PORT ${PORT}`)
})


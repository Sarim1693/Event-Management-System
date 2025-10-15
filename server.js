const express=require('express');
const app=express();
const userRoutes=require('./routes/user');
const eventRoutes=require('./routes/event');
require('dotenv').config();
const bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(express.json());
app.use('/users', userRoutes);
app.use('/events', eventRoutes);
const PORT=process.env.PORT || 4000;
app.listen(PORT, ()=>{
    console.log("Server is Running");
});
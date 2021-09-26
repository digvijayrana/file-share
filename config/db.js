require('dotenv').config();
const mongoose = require('mongoose');


const connectDB = async()=>{
    await mongoose.connect(process.env.MONGO_CONNECTION_URL ||Uri,{ useNewUrlParser: true ,useUnifiedTopology:true })
    console.log("Database Connected...");
}

module.exports= connectDB;
const mongoose = require('mongoose');

const connectToDb = async () => {
    try{
        mongoose.connect(process.env.MONGO_URI);
        console.log("mongoDB connected successfully");
        
    }
    catch (e){
        console.error('mongoDB connection failed');
        process.exit(1)
    }
}
 
module.exports = connectToDb;
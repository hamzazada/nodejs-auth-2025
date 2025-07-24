require ('dotenv').config();
const express = require ('express')
const connectToDb  = require('./Data_base/db')
const authRoutes = require ('./routes/auth-routes')
const homeRoutes = require ('./routes/home-routes')
const adminRoutes = require ('./routes/admin-routes')
const uploadImageRoutes = require ('./routes/image-routes')
connectToDb();

const app = express();
const PORT = process.env.PORT || 4000;
//Middleware
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/image', uploadImageRoutes);

app.listen(PORT, ()=>{
    console.log(`server is now running on http://localhost:${PORT}`);

})
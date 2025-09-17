import "dotenv/config"
import express from 'express';
import cors from 'cors';
import connectDB from './utils/db.js';
import cookieParser from 'cookie-parser';
import userRoutes from "./routes/user.route.js"


const PORT = process.env.PORT

const app = express()

app.use(express.json());



const corsOptions = {
  origin: process.env.FRONT_URL,
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use('/api/v1/user' ,userRoutes);


app.listen(PORT, () => {
    connectDB();
  console.log(`Server is running on port ${PORT}`);
})
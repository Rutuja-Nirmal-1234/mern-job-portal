import express from  "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js"
import companyRoute from "./routes/company.route.js"
import jobRoute from "./routes/job.route.js"
import applicationRoute from "./routes/application.route.js"


dotenv.config({});
const app = express();


//middleware
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
const corsOptions = {
  origin: "https://mern-job-portal-rose.vercel.app",
  credentials: true,
};
app.use(cors(corsOptions));


const PORT = process.env.PORT;

//api's

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MERN Job Portal Backend is running 🚀",
  });
});

app.use("/api/v1/user",userRoute);
app.use("/api/v1/company",companyRoute);
app.use("/api/v1/job",jobRoute);
app.use("/api/v1/application",applicationRoute);




// app.listen(PORT, ()=>{
//   connectDB();
//   console.log(`Server running at port ${PORT}`);
// })

const startServer = async () => {
  await connectDB();

  app.listen(PORT, ()=>{
    console.log(`Server running at port ${PORT}`);
  });
}

startServer();
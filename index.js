import { configure } from './config.js';
import express from 'express';
import bodyParser from 'body-parser';
import swagger from 'swagger-ui-express';
import apiDocs from './swagger.json' assert {type: 'json'};
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectUsingMongoose } from './src/config/mongooseConfig.js';
import userRouter from './src/User/User-Routes/userRoutes.js';
import cookieParser from 'cookie-parser';
import jwtAuth from './src/middleware/jwtAuth.js';
import postRouter from './src/features/posts/Post-Routes/postRoutes.js';
import commentRouter from './src/features/comments/Comment-routes/commentsRoutes.js';
import likesRouter from './src/features/likes/Likes-routes/likesRoutes.js';
import friendsRouter from './src/features/friends/FriendsRoutes/FriendsRoutes.js';
import OTPRouter from './src/OTPManagement/otpRoutes.js';
import { ApplicationError } from './src/error-handler/applicationError.js';
import logger from './src/middleware/loggerMiddleWare.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Middleware for serving static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const corsOptions = {
    origin:"http://localhost:3200"
}
app.use(cookieParser());
app.use(cors(corsOptions));
//Convert the request body to json.
app.use(bodyParser.json());

app.use((req, res, next) => {
    logger.info(`Request: ${req.method} ${req.url}`);
    next();
  });
// //Bearer <token>
// //for all requests related to product, redirect to product routes.
// //localhost:3200/api/products
app.use("/api-docs", 
swagger.serve, 
swagger.setup(apiDocs)
);

app.use('/api/users',userRouter);

app.use('/api/posts',jwtAuth,postRouter);

app.use('/api/comments',jwtAuth,commentRouter);

app.use('/api/likes',jwtAuth,likesRouter);

app.use('/api/friends',jwtAuth,friendsRouter);

app.use('/api/otp',OTPRouter);

//Default request handlere
app.get("/",(req,res)=>{
    const link = `<a href = 'http://localhost:${process.env.PORT}/api-docs'>Click Here</a>`
    res.send(`Welcome to Social Networking APIs For ${link}`);
});

//Error Handler Middlewware
app.use((err, req, res, next)=>{
    
    logger.error(`Error: ${err.message} - URL: ${req.originalUrl}`);
    if (err instanceof ApplicationError){
         return res.status(err.code).send(err.message);
    }
  
    // server errors.
   
    res
    .status(500)
    .send(
      'Something went wrong, please try later'
      );
  });

app.listen(process.env.PORT,()=>{
    console.log(`Server is running at ${process.env.PORT}`);  
    connectUsingMongoose();  
});







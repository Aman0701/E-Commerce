import mongoose from "mongoose";


const url = process.env.DB_URL;

export const connectUsingMongoose = async() =>{
    try{
        await mongoose.connect(url);

        console.log("MongoDB using mongoose is connected");
        
    }catch(err){
        throw new ApplicationError("Something went wrong with database",500);
    }
}
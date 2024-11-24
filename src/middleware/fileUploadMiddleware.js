
import multer from "multer";
import path from 'path';

const storageConfig = multer.diskStorage({
    destination:(req,file,cb)=>{
       
        
        cb(null,'uploads/');
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+ path.extname(file.originalname));
    },
});

export const upload = multer({storage:storageConfig});
import multer from 'multer';
import fs from 'fs';
import path from "path";


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, process.env.imageStoragePath);
    },
    filename: (req, file, callback) => {  
      callback(null, file.originalname);
    }
  });
  
  const upload = multer({ storage: storage }).array('uploader', process.env.maxUploadVideo);

  const uploadFile = {};

uploadFile.saveImage = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) return Promise.reject(err);
    next();
  });
}

uploadFile.deleteFile = (req, res, next) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (req.body.imageNames) {
        for (let index = 0; index < req.body.imageNames.length; index++) {
          const element = req.body.imageNames[index];
          await deleteSingleFile(element);
        }
      } else if (req.params.imageName) {
        await deleteSingleFile(req.params.imageName);
      }
      next();
    } catch (error) {
      reject(error)
    }


  });

}

const deleteSingleFile = (imageName) => {
  fs.stat(path.resolve(`${process.env.imageStoragePath}/${imageName}`), (err, stats) => {
    if (err) {
      reject(err);
    }
    fs.unlink(path.resolve(`${process.env.imageStoragePath}/${imageName}`), (err) => {
      if (err) reject(err);
    });
  });
}
export default uploadFile;
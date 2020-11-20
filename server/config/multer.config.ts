import * as multer from 'multer';
import * as path from 'path';
import * as uniqid from 'uniqid';

const upload = (() => {
  const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      cb(null, path.resolve(__dirname, '../upload/images'));
    },
    filename: (req, file, callback) => {
      callback(null, uniqid('', `-${file.originalname.trim()}`));
    },
  });

  const imageFilter = (req: any, file: any, cb: any) => {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    return cb(null, true);
  };

  return multer({ storage, fileFilter: imageFilter }).single('image');
})();

export default upload;

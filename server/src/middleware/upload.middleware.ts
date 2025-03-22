import multer from 'multer';
import path from 'path';

// הגדרת אחסון מקומי
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // ← שמור בתיקיית uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // שם ייחודי
  }
});

const upload = multer({ storage });

export default upload;

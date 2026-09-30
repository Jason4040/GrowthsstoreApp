import path from "path";
import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
import { authenticate } from "../middlewares/authMiddleware.js";

dotenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "MERN-E-Commerce-Store",
    allowed_formats: ["jpg", "png", "jpeg", "webp", "mp4", "webm"],
    resource_type: "auto",
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp|mp4|webm/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp|video\/mp4|video\/webm/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Images and videos only"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
});
const uploadSingleImage = upload.single("image");

router.post("/", authenticate, (req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      res.status(400).send({ message: err.message });
    } else if (req.file) {
      res.status(200).send({
        message: "File uploaded successfully",
        image: req.file.path,
      });
    } else {
      res.status(400).send({ message: "No file provided" });
    }
  });
});

const proofStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "MERN-E-Commerce-Store-Proofs",
    resource_type: "auto",
  },
});

const proofFileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp|pdf|docx?/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp|application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images, PDFs, or Word documents are allowed"), false);
  }
};

const uploadProof = multer({
  storage: proofStorage,
  fileFilter: proofFileFilter,
  limits: { fileSize: 8 * 1024 * 1024 },
});
const uploadSingleProof = uploadProof.single("image");

router.post("/proof", authenticate, (req, res) => {
  uploadSingleProof(req, res, (err) => {
    if (err) {
      res.status(400).send({ message: err.message });
    } else if (req.file) {
      res.status(200).send({
        message: "Proof file uploaded successfully",
        image: req.file.path,
      });
    } else {
      res.status(400).send({ message: "No file provided" });
    }
  });
});

export default router;

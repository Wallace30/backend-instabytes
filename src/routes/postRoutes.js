import express from 'express';
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from '../controllers/postController.js';
import multer from 'multer';
import cors from "cors";

const corsOptions = {
    origin: "http://localhost:8000",
    optionsSuccessStatus: 200
}
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

router.get("/posts", listarPosts);
router.post("/posts", postarNovoPost);
router.post("/upload", upload.single("imagem"), uploadImagem);
router.put("/upload/:id", atualizarNovoPost);
router.use(cors(corsOptions))
export default router;

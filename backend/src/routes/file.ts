import { Router } from 'express';
import { uploadFile, getFiles, downloadFile, deleteFile } from '../controllers/file'; 
import { authenticate } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

router.post('/upload', authenticate, upload.single('file'), uploadFile);
router.get('/', authenticate, getFiles);
router.get('/:id', authenticate, downloadFile);
router.delete('/:id', authenticate, deleteFile); 

export default router;
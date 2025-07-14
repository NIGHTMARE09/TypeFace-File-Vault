import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import fileRoutes from './routes/file';

// backend apis :
// upload file
// get list of all files
// download file
// delete file (optional)
// Define routes and controllers for file management

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();


app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);

app.listen(PORT, () => {  
    console.log(`Server is running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
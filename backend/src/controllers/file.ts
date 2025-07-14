import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import prisma from '../utils/prisma';

export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user.id;
    const { filename, originalname, mimetype, size, path: filePath } = req.file;

    // Save file metadata to database
    const file = await prisma.file.create({
      data: {
        filename,
        originalName: originalname,
        mimetype,
        size,
        path: filePath,
        userId
      }
    });

    res.status(201).json(file);
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getFiles = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    // Get all files for user
    const files = await prisma.file.findMany({
      where: { userId },
      orderBy: { uploadedAt: 'desc' }
    });

    res.json(files);
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const downloadFile = async (req: Request, res: Response) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.id;

    // Find file
    const file = await prisma.file.findUnique({
      where: { id: fileId }
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Check if user owns the file
    if (file.userId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if file exists on disk
    if (!fs.existsSync(file.path)) {
      return res.status(404).json({ message: 'File not found on disk' });
    }

    // Set headers
    res.setHeader('Content-Disposition', `attachment; filename=${file.originalName}`);
    res.setHeader('Content-Type', file.mimetype);

    // Stream the file
    const fileStream = fs.createReadStream(file.path);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Download file error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.id; // Get user ID from authenticated request

    // Find the file to ensure it exists and belongs to the user
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Check if the authenticated user is the owner of the file
    if (file.userId !== userId) {
      return res.status(403).json({ message: 'Access denied. You do not own this file.' });
    }

    // Delete the file record from the database
    await prisma.file.delete({
      where: { id: fileId },
    });

    // Delete the file from the file system
    // Use the absolute path stored in the database
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error('Error deleting file from file system:', err);
        // Note: Database record is already deleted. You might want to log this error
        // or have a separate process to clean up orphaned files.
      }
    });

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
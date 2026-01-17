import { Router } from 'express';
import path from 'path';
import { Request, Response } from 'express';

const router = Router();

// Serve static files from the uploads directory
router.get('/blog-images/:filename', (req: Request, res: Response) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../../../uploads/blog-images', filename);
  
  // Check if file exists first
  const fs = require('fs');
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Image not found');
  }
  
  // Send the file
  return res.sendFile(filePath);
});

// Serve team member images
router.get('/team-images/:filename', (req: Request, res: Response) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../../../uploads/team-images', filename);
  
  // Check if file exists first
  const fs = require('fs');
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Image not found');
  }
  
  // Send the file
  return res.sendFile(filePath);
});

// Serve static files from the uploads directory
router.get('/course-images/:filename', (req: Request, res: Response) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../../../uploads/course-images', filename);

  // Check if file exists first
  const fs = require('fs');
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Image not found');
  }
  
  // Send the file
  return res.sendFile(filePath);
});

// Serve testimonial images
router.get('/testimonial-images/:filename', (req: Request, res: Response) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../../../uploads/testimonial-images', filename);

  // Check if file exists first
  const fs = require('fs');
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Image not found');
  }
  
  // Send the file
  return res.sendFile(filePath);
});

// Legacy route for backwards compatibility (old testimonial path)
router.get('/testimonial/:filename', (req: Request, res: Response) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../../../uploads/testimonial-images', filename);

  // Check if file exists first
  const fs = require('fs');
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Image not found');
  }
  
  // Send the file
  return res.sendFile(filePath);
});

// Serve trustpilot images
router.get('/trustpilot-images/:filename', (req: Request, res: Response) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../../../uploads/trustpilot-images', filename);

  // Check if file exists first
  const fs = require('fs');
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Image not found');
  }
  
  // Send the file
  return res.sendFile(filePath);
});

export default router;

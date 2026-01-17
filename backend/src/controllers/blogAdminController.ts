import { Request, Response } from 'express';
import { BlogPostModel } from '../models';
import { getImageUrl } from '../middleware';
import fs from 'fs';
import path from 'path';

  // Create a blog post with image upload support
  export const createBlog = async (req: Request, res: Response): Promise<void> => {
    try {
      const blogData = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      // If there's a main image uploaded, set the image property to the filename
      if (files && files['image'] && files['image'][0]) {
        blogData.image = files['image'][0].filename;
      } else if (req.file) {
        // For backward compatibility
        blogData.image = req.file.filename;
      }

      // If there's an avatar image uploaded, set the author.avatar property to the filename
      if (files && files['avatarImage'] && files['avatarImage'][0]) {
        if (!blogData.author) {
          blogData.author = { name: '', role: '', avatar: '' };
        }
        const avatarFilename = files['avatarImage'][0].filename;
        blogData.author.avatar = avatarFilename;
      }

      // Generate ID if not provided
      if (!blogData.id) {
        blogData.id = `blog-${Date.now()}`;
      }

      // Create new blog post
      const blog = new BlogPostModel(blogData);
      await blog.save();

      // Transform the image URL in the response
      const responseData = blog.toObject() as any;
      if (responseData.image) {
        responseData.imageUrl = getImageUrl(responseData.image, req);
      }

      res.status(201).json({
        success: true,
        message: 'Blog post created successfully.',
        data: responseData
      });
    } catch (error: any) {
      console.error('Create blog error:', error);
      
      // Handle duplicate key errors
      if (error.code === 11000) {
        res.status(409).json({
          success: false,
          message: 'A blog post with this slug already exists.',
          error: error.message
        });
        return;
      }

      res.status(400).json({
        success: false,
        message: 'Invalid data for blog post creation.',
        error: error.message
      });
    }
  };

// Update a blog post with image upload support
export const updateBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const blogData = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    // If there's a main image uploaded, set the image property to the filename
    if (files && files['image'] && files['image'][0]) {
      blogData.image = files['image'][0].filename;
    } else if (req.file) {
      // For backward compatibility
      blogData.image = req.file.filename;
    }

    // If there's an avatar image uploaded, set the author.avatar property to the filename
    if (files && files['avatarImage'] && files['avatarImage'][0]) {
      if (!blogData.author) {
        blogData.author = { name: '', role: '', avatar: '' };
      }
      const avatarFilename = files['avatarImage'][0].filename;
      blogData.author.avatar = avatarFilename;
    }

    const blog = await BlogPostModel.findByIdAndUpdate(id, blogData, { 
      new: true, 
      runValidators: true 
    });
    
    if (!blog) {
      res.status(404).json({
        success: false,
        message: 'Blog post not found.'
      });
      return;
    }

    // Transform the image URL in the response
    const responseData = blog.toObject() as any;
    if (responseData.image) {
      responseData.imageUrl = getImageUrl(responseData.image, req);
    }

    res.json({
      success: true,
      message: 'Blog post updated successfully.',
      data: responseData
    });
  } catch (error: any) {
    console.error('Update blog error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      res.status(409).json({
        success: false,
        message: 'A blog post with this slug already exists.',
        error: error.message
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: 'Invalid data for blog post update.',
      error: error.message
    });
  }
};

// Get all blog posts with image URLs
export const getAllBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const blogs = await BlogPostModel.find({}).sort({ createdAt: -1 });
    
    // Transform image URLs in the response
    const transformedBlogs = blogs.map(blog => {
      const blogObj = blog.toObject() as any;
      if (blogObj.image) {
        blogObj.imageUrl = getImageUrl(blogObj.image, req);
      }
      // Transform avatar URL if it's a filename (not a full URL)
      if (blogObj.author?.avatar && !blogObj.author.avatar.startsWith('http')) {
        blogObj.author.avatarUrl = getImageUrl(blogObj.author.avatar, req);
      }
      return blogObj;
    });

    res.json({
      success: true,
      message: 'Blog posts retrieved successfully.',
      data: transformedBlogs
    });
  } catch (error: any) {
    console.error('Get all blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving blog posts.'
    });
  }
};

// Get a single blog post by ID with image URL
export const getBlogById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const blog = await BlogPostModel.findById(id);
    
    if (!blog) {
      res.status(404).json({
        success: false,
        message: 'Blog post not found.'
      });
      return;
    }

    // Transform image URL in the response
    const responseData = blog.toObject() as any;
    if (responseData.image) {
      responseData.imageUrl = getImageUrl(responseData.image, req);
    }
    // Transform avatar URL if it's a filename (not a full URL)
    if (responseData.author?.avatar && !responseData.author.avatar.startsWith('http')) {
      responseData.author.avatarUrl = getImageUrl(responseData.author.avatar, req);
    }
    // Transform avatar URL if it's a filename (not a full URL)
    if (responseData.author?.avatar && !responseData.author.avatar.startsWith('http')) {
      responseData.author.avatarUrl = getImageUrl(responseData.author.avatar, req);
    }

    res.json({
      success: true,
      message: 'Blog post retrieved successfully.',
      data: responseData
    });
  } catch (error: any) {
    console.error('Get blog by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving blog post.'
    });
  }
};

// Delete a blog post (image deletion handled by mongoose pre-hook)
export const deleteBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const blog = await BlogPostModel.findByIdAndDelete(id);
    
    if (!blog) {
      res.status(404).json({
        success: false,
        message: 'Blog post not found.'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Blog post deleted successfully.'
    });
  } catch (error: any) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting blog post.'
    });
  }
};

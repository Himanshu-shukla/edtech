import { Request, Response } from 'express';
import { BlogPostModel } from '../models';

// Get all blog posts
export const getAllBlogPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, featured, limit, offset } = req.query;
    let query: any = {};
    
    // Filter by category if provided
    if (category) {
      query.category = category;
    }
    
    // Filter by featured if provided
    if (featured === 'true') {
      query.featured = true;
    }
    
    let queryBuilder = BlogPostModel.find(query).sort({ publishedAt: -1 });
    
    // Apply offset (skip)
    if (offset && !isNaN(Number(offset))) {
      queryBuilder = queryBuilder.skip(Number(offset));
    }
    
    // Apply limit
    if (limit && !isNaN(Number(limit))) {
      queryBuilder = queryBuilder.limit(Number(limit));
    }
    
    const posts = await queryBuilder;
    res.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get blog post by slug
export const getBlogPostBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const post = await BlogPostModel.findOne({ slug });
    
    if (!post) {
      res.status(404).json({ error: 'Blog post not found' });
      return;
    }
    
    res.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get blog post by ID
export const getBlogPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const post = await BlogPostModel.findOne({ id });
    
    if (!post) {
      res.status(404).json({ error: 'Blog post not found' });
      return;
    }
    
    res.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get featured blog posts
export const getFeaturedBlogPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await BlogPostModel.find({ featured: true }).sort({ publishedAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching featured blog posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get blog categories
export const getBlogCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await BlogPostModel.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get posts by category
export const getPostsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.params;
    const posts = await BlogPostModel.find({ category }).sort({ publishedAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get related posts
export const getRelatedPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const { limit = '3' } = req.query;
    
    // First get the current post to find related posts
    const currentPost = await BlogPostModel.findOne({ slug });
    
    if (!currentPost) {
      res.status(404).json({ error: 'Blog post not found' });
      return;
    }
    
    // Find related posts by category or tags
    const relatedPosts = await BlogPostModel.find({
      id: { $ne: currentPost.id },
      $or: [
        { category: currentPost.category },
        { tags: { $in: currentPost.tags } }
      ]
    })
    .limit(Number(limit))
    .sort({ publishedAt: -1 });
    
    res.json(relatedPosts);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

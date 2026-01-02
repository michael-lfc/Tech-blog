import express from 'express';
import Post from '../models/Post.js';
import tokenValidation from '../middlewares/tokenValidation.js';
import mongoose from 'mongoose';
import User from '../models/User.js';

const router = express.Router();

// Create Post
router.post("/", tokenValidation, async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const newPost = new Post({
      userId: req.userId,
      title,
      content,
      tags: tags || []
    });
    await newPost.save();
    await newPost.populate('userId', 'username profilePhoto');

    res.status(201).json({ message: 'Post created', post: newPost });
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
});

// Get All Posts (Public)
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'username profilePhoto')
      .populate('comments.userId', 'username profilePhoto')
      .sort({ createdAt: -1 })
      .limit(20);

    const formatted = posts.map(post => ({
      _id: post._id,
      title: post.title,
      content: post.content,
      tags: post.tags,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: post.userId ? {
        _id: post.userId._id,
        username: post.userId.username,
        profilePhoto: post.userId.profilePhoto
      } : null,
      likes: post.likes || [],
      comments: post.comments.map(c => ({
        _id: c._id,
        text: c.text,
        createdAt: c.createdAt,
        author: c.userId ? {
          _id: c.userId._id,
          username: c.userId.username,
          profilePhoto: c.userId.profilePhoto
        } : null
      }))
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

// React to Post
router.post("/:postId/react", tokenValidation, async (req, res) => {
  try {
    const { postId } = req.params;
    const { emoji } = req.body;
    const userId = req.userId;

    if (!emoji) return res.status(400).json({ message: "Emoji is required" });
    if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(400).json({ message: "Invalid post ID" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const existingIndex = post.likes.findIndex(l => l.userId.toString() === userId);

    if (existingIndex !== -1) {
      if (post.likes[existingIndex].emoji === emoji) {
        post.likes.splice(existingIndex, 1); // Unlike
      } else {
        post.likes[existingIndex].emoji = emoji; // Change emoji
      }
    } else {
      post.likes.push({ userId, emoji }); // New reaction
    }

    await post.save();
    res.json({ message: "Reaction updated", likes: post.likes });
  } catch (error) {
    console.error("Reaction error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add Comment
router.post("/:postId/comments", tokenValidation, async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.userId;

    if (!text?.trim()) return res.status(400).json({ message: "Comment text is required" });
    if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(400).json({ message: "Invalid post ID" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ userId, text: text.trim() });
    await post.save();

    await post.populate('comments.userId', 'username profilePhoto');
    const addedComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      message: "Comment added",
      comment: {
        _id: addedComment._id,
        text: addedComment.text,
        createdAt: addedComment.createdAt,
        author: addedComment.userId ? {
          _id: addedComment.userId._id,
          username: addedComment.userId.username,
          profilePhoto: addedComment.userId.profilePhoto
        } : null
      }
    });
  } catch (error) {
    console.error("Comment error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Keep your existing: update, delete, my-posts routes here...

export default router;
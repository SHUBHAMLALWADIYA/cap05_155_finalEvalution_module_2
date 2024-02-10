const PostModel = require("../models/posts.model");


const addPost = async (req, res) => {
    try {
      const userId = req.userId;
      const { title, body, device } = req.body;
      const post = new PostModel({ title, body, device, userId: userId });
      await post.save();
      res.status(201).json({ msg: 'Post added successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  const getPosts = async (req, res) => {
    try {
      const userId = req.userId;
      const posts = await PostModel.find({ user: userId });
      res.status(200).json({msg:"your posts are now available",post:posts});
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };


  const updatePost = async (req, res) => {
    try {
      const postId = req.params.id;
      const userId = req.userId;
      const { title, body, device } = req.body;
      const post = await PostModel.findOne({ _id: postId, userId: userId });
      if (!post) return res.status(404).json({ message: 'Post not found' });
      post.title = title;
      post.body = body;
      post.device = device;
      await post.save();
      res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };


  const deletePost = async (req, res) => {
    try {
      const postId = req.params.id;
      const userId = req.userId;
      const post = await PostModel.findOne({ _id: postId, userId: userId });
      if (!post) return res.status(404).json({ message: 'Post not found' });
      await post.remove();
      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      res.status(404).json({msg:"error in deletePost", error: error.message });
    }
  };
  

  module.exports={addPost,getPosts,updatePost,deletePost}
const express=require("express");
const { addPost, getPosts, updatePost, deletePost } = require("../controller/posts.conroller");

const postRouter=express.Router()


postRouter.post("/add",addPost)
postRouter.patch("/update/:id",updatePost)
postRouter.delete("/delete/:id",deletePost)
postRouter.get("/",getPosts)

module.exports=postRouter
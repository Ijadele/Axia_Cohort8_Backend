const postModel = require("../models/post.model");
const userModel = require("../models/user.model")
const cloudinary = require("../utils/cloudinary");
 const fs = require("fs/promises") 

// const createPost = async (req, res) => {
//     const body = req.body;
//     const file = req.files;
//     const  id  = "685d83bd062cc8509669469c";

//     // console.log("Files received:", file["previewPix"].map(f => f.path));
//     // console.log(file["detailedPix"][0].path);
//     console.log(body);
//     try {
//         // Step 1: Upload files to Cloudinary
//         // const previewPixUploads = await Promise.all(file["previewPix"].map(f => cloudinary.uploader.upload(f.path)));
//         // const detailedPixUploads = await Promise.all(file["detailedPix"].map(f => cloudinary.uploader.upload(f.path)));
//         const previewPixUploads = await cloudinary.uploader.upload(file["previewPix"].map(f => f.path));
//         const detailedPixUploads = await cloudinary.uploader.upload(file["detailedPix"].map(f => f.path));
//         // append the uploaded file URLs to the body
//         body["previewPix"] = previewPixUploads.secure_url;
//         body["detailedPix"] = detailedPixUploads.secure_url;
//         const newPost = new postModel({creator: id, ...body})
//         const savedPost = await newPost.save()
//         // modify the user account
//         const userInfo = await userModel.findById(id)
//         const allPostIds = userInfo.posts
//         allPostIds.push(savedPost.id);
//         await userModel.findByIdAndUpdate(id, {posts: allPostIds}, {new: true})
//         // unlink the files from the server
//         await fs.unlink(file["previewPix"].map(f => f.path));
//         await fs.unlink(file["detailedPix"].map(f => f.path));
//         return res.send("post created successfully!!!")
//     } catch (error) {
//         console.log(error.message)
//         return res.send(error.message)
//     }
// }

// const createPost = async (req, res) => {
//     const body = req.body;
//     const files = req.files;
//     const { id } = req.user;

//     try {
//         const userInfo = await userModel.findById(id);
//         const allPostIds = userInfo.posts;

//         // Step 1: Upload files and organize them by field
//         const media = {};
//         for (const key in files) {
//             const uploadPromises = files[key].map(file => cloudinary.uploader.upload(file.path));
//             const uploadResponses = await Promise.all(uploadPromises);
//             media[key] = uploadResponses.map(response => response.secure_url);
//         }

//         // Step 2: Create post with file URLs included
//         const newPost = new postModel({
//             creator: id,
//             ...body,
//             previewPix: media.previewPix,
//             detailedPix: media.detailedPix,
//             // video: media.video,
//         });

//         const savedPost = await newPost.save();

//         // Step 3: Update user's posts
//         allPostIds.push(savedPost.id);
//         await userModel.findByIdAndUpdate(id, { posts: allPostIds }, { new: true });

//         return res.send("post created successfully!!!");
//     } catch (error) {
//         console.log(error.message);
//         return res.status(500).send(error.message);
//     }
// };

const createPost = async (req, res) => {
  const body = req.body;
  const file = req.files;
  const {id} = req.user;

  try {
    // 1. Upload all previewPix and detailedPix files
    const previewPixUploads = await Promise.all(
      file["previewPix"].map((f) => cloudinary.uploader.upload(f.path))
    );

    const detailedPixUploads = await Promise.all(
      file["detailedPix"].map((f) => cloudinary.uploader.upload(f.path))
    );

    // 2. Set uploaded URLs in body
    body["previewPix"] = previewPixUploads.map((upload) => upload.secure_url);
    body["detailedPix"] = detailedPixUploads.map((upload) => upload.secure_url);

    // 3. Save post
    const newPost = new postModel({ creator: id, ...body });
    const savedPost = await newPost.save();

    // 4. Update user
    const userInfo = await userModel.findById(id);
    if (!userInfo) {
      return res.status(404).json({ error: "User not found." });
    }

    userInfo.posts.push(savedPost.id);
    await userModel.findByIdAndUpdate(id, { posts: userInfo.posts }, { new: true });

    // 5. Delete files from local storage
    await Promise.all([
      ...file["previewPix"].map((f) => fs.unlink(f.path)),
      ...file["detailedPix"].map((f) => fs.unlink(f.path)),
    ]);

    return res.status(201).send("Post created successfully!!!");
  } catch (error) {
    console.log(error.message);
    return res.status(500).send(error.message);
  }
};


const deletePost = async (req, res) => {
    const {postId} = req.query;
    const { id, admin } = req.user;
    // check for post existence
    const post = await postModel.findById(postId);

    if (!post) {
        return res.send("Post does not exist")
    } 
    // check if is the creator
    if (id != post.creator && !admin) { //!post.creator.equals(userId)
        return res.send("This post does not belong to you")
    }

    try {
        await postModel.findByIdAndDelete(postId)
        return res.send("post deleted successfully")
    } catch (error) {
        return res.send(error.message)
    }
}

const updatePost = async (req, res) => {
    const {postId, userId} = req.query
    const body = req.body
    // get the post
    const post = postModel.findById(postId)
    if (!post) {
        return res.send("post does not exist")
    }
    // check if is the owner
    if (userId != post.creator) {
        return res.send("You can only update your post")
    }

    try {
        await postModel.findByIdAndUpdate(postId, {...body}, {new:true})
        res.send("Post updated successfully")
    } catch (error) {
        res.send("Something went wrong")
    }
}

// get all the post
const getUsersPosts = async (req, res) => {
    const {userId} = req.query;

    try {
        const posts = await postModel.find({ creator: userId })
        return res.json(posts)
    } catch (error) {
        return res.send(error.message)
    }
}

// get single post
const getSinglePost = async (req, res) => {
    const {postId} = req.query;
    try {
        const post = await postModel.findById(postId).populate("creator");
        return res.json(post)
    } catch (error) {
        return res.send(error.message)
    }
}

module.exports = {createPost, deletePost, updatePost, getUsersPosts, getSinglePost}
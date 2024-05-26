import express from "express";
import connectDB from "./db.js";
import Blog from "./model.js";

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to the database
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(
      `Server is running on port ${PORT} and url is http://localhost:${PORT}`
    );
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    name: "APIS",
    version: "1.0.0",
    status: "healthy",
    url: `http://localhost:${PORT}`,
    author: "Yunesh Shrestha",
  });
});

// Get all blogs
app.get("/blog", async (req, res) => {
  try {
    const blogs = await Blog.find();
    if (blogs.length === 0) {
      return res.json({
        message: "No blogs found",
      });
    }
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching blogs." });
  }
});

// Create a new blog
app.post("/blog", async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const blog = new Blog({
      title,
      content,
      author,
    });
    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the blog." });
  }
});

//edit the blog
app.put("/blog/:id", async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      blog.title = title;
      blog.content = content;
      blog.author = author;
      const updatedBlog = await blog.save();
      res.json(updatedBlog);
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the blog." });
  }
});

// Delete a blog
app.delete("/blog/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await Blog.findById(id);
    if (blog) {
      const result = await Blog.findByIdAndDelete(id);
      res.json({ data: result, message: "Blog removed" });
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the blog." });
  }
});

export default app;

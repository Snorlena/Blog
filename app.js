const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

// connect to MongoDB
mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// define schema for blog post
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

// create model for blog post
const Post = mongoose.model('Post', postSchema);

// set up body parser
app.use(bodyParser.urlencoded({ extended: true }));

// set up EJS view engine
app.set('view engine', 'ejs');

// set up routes
app.get('/', async (req, res) => {
  let blogPosts = await Post.find();
  if (blogPosts == "") {
    blogPosts = []
  }
  res.render('index', { blogPosts });
});

app.get('/new', (req, res) => {
  res.render('new');
});

app.post('/new', async (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  await post.save();
  res.redirect('/');
});

app.get('/edit/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render('edit', { post });
});

app.post('/edit/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.title = req.body.title;
  post.content = req.body.content;
  await post.save();
  res.redirect('/');
});

app.post('/delete/:id', async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/');
  });
  

// start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
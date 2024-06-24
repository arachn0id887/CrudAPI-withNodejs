const express = require("express");
const router = express.Router();
const Article = require("./model.js");
const User = require("./usermodel.js");
var loggedIn = false;

//HOME
router.get("/", (req, res) => {
  if (loggedIn) {
    res.render("index");
  } else {
    res.redirect("/signup");
  }
});

//SIGNUP
router.get("/signup", (req, res) => {
  res.render("signup", { user: new User() });
});

router.post("/signup", async (req, res) => {
  let user = {
    username: req.body.username,
    password: req.body.password,
  };
  try {
    await User.insertMany([user]);
    loggedIn = true;
    res.redirect("/");
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

//LOGIN
router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/login", async (req, res) => {
  try {
    const auth = await User.findOne({ username: req.body.username });
    if (auth.password === req.body.password) {
      loggedIn = true;
      res.redirect("/");
    } else {
      res.send("Wrong password.");
    }
  } catch {
    res.send("User does not exist.");
  }
});

//LOGOUT
router.post("/logout", (req, res) => {
  loggedIn = false;
});

//ALL
router.get("/article", async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: "desc" });
    if (loggedIn) {
      res.render("all", { articles: articles });
    } else {
      res.redirect("/signup");
    }
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

//CREATE
router.get("/article/create", (req, res) => {
  if (loggedIn) {
    res.render("create", { article: new Article() });
  } else {
    res.redirect("/signup");
  }
});

router.post("/article/create", async (req, res) => {
  let article = new Article({
    name: req.body.name,
    info: req.body.info,
    posted_by: req.body.posted_by,
  });
  try {
    article = await article.save();
    res.redirect(`/article/${article.id}`);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

//BY ID

router.get("/article/:id", async (req, res) => {
  try {
    const articleId = req.params.id;
    const article = await Article.findById(articleId);
    if (!article) {
      res.send("Article does not exist.");
    } else if (loggedIn) {
      res.render("byID", { article: article });
    } else {
      res.redirect("/signup");
    }
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

//UPDATE

router.get("/article/:id/update", async (req, res) => {
  const articleId = req.params.id;
  const article = await Article.findById(articleId);
  if (!article) {
    res.send("Article does not exist.");
  } else if (loggedIn) {
    res.render("update", { article: article });
  } else {
    res.redirect("/signup");
  }
});

router.put("/article/:id/update", async (req, res) => {
  const articleId = req.params.id;
  var article = await Article.findByIdAndUpdate(articleId, req.body);
  article.name = req.body.name;
  article.info = req.body.info;
  article.posted_by = req.body.posted_by;
  article.id = articleId;
  if (!article) {
    return res.status(404).send("Article does not exist.");
  }
  const updatedArticle = await Article.findById(articleId);
  try {
    article = await article.save(updatedArticle);
    res.redirect("/article");
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

//DELETE
router.get("/article/:id/delete", async (req, res) => {
  const articleId = req.params.id;
  const article = await Article.findById(articleId);
  if (!article) {
    res.status(404).send("Article does not exist.");
  } else if (loggedIn) {
    res.render("delete", { article: article });
  } else {
    res.redirect("/signup");
  }
});

router.delete("/article/:id/delete", async (req, res) => {
  try {
    const articleId = req.params.id;
    const article = await Article.findByIdAndDelete(articleId);
    if (!article) {
      return res.send("Article does not exist.");
    } else {
      res.redirect("/article");
    }
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

module.exports = router;

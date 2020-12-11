//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

///////Requests targeting ALL articles/////////////////////////

app.route("/articles")

    .get((req, res) => {
        Article.find((err, foundArticles) => {
            if (!err) {
                res.render("home", { articles: foundArticles })
            } else {
                res.send(err);
            }
        });
    })

    .post((req, res) => {
        const newTitle = req.body.title;
        const newContent = req.body.content;

        const newArticle = new Article({
            title: newTitle,
            content: newContent
        });

        newArticle.save((err) => {
            if (err) {
                res.send(err);
            } else {
                res.send("Successfully added a new article!");
            }
        });
    })

    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (!err) {
                res.send("Deleted all articles!");
            } else {
                res.send(err);
            }
        });
    });

///////Requests targeting SPECIFIC articles/////////////////////////

app.route("/articles/:articleTitle")

    .get((req, res) => {
        const article = req.params.articleTitle;
        Article.findOne({ title: article }, (err, foundArticle) => {
            if (!err) {
                if (!foundArticle) {
                    res.send("No article found");
                } else {
                    res.send(foundArticle);
                }
            } else {
                res.send(err);
            }
        });
    })
    .put((req, res) => {
        const article = req.params.articleTitle;
        Article.update(
            { title: article },
            { title: req.body.title, content: req.body.content },
            { overwrite: true },
            (err) => {
                if (!err) {
                    res.send("Article updated!");
                }
            });
    })
    .patch((req, res) => {
        const article = req.params.articleTitle;
        Article.update(
            { title: article },
            { $set: req.body },
            (err) => {
                if (!err) {
                    res.send("Article updated!");
                } else {
                    res.send(err);
                }
            });
    })
    .delete((req, res) => {
        const article = req.params.articleTitle;
        Article.deleteOne({ title: article }, (err) => {
            if (!err) {
                res.send("Article deleted successfully");
            } else {
                res.send(err);
            }
        });
    });

app.listen(3000, function () {
    console.log("Server started on port 3000");
});
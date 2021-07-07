const express = require('express');

const postDb = require('../posts/postDb');

const router = express.Router();

/* ----- GET /api/posts ----- */
router.get('/', (req, res) => {
  postDb
    .get()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      res.status(500).json({
        error: 'The posts information could not be retrieved'
      });
    });
});

/* ----- GET /api/posts/:id ----- */
router.get('/:id', validatePostId, (req, res) => {
  res.status(200).json(req.post);
});

/* ----- DELETE /api/posts/:id ----- */
router.delete('/:id', validatePostId, (req, res) => {
  postDb
    .remove(req.post.id)
    .then((recordCount) => {
      res.status(200).json(req.post);
    })
    .catch((err) => {
      res.status(500).json({
        error: 'The post could not be removed'
      });
    });
});

/* ----- PUT /api/posts/:id ----- */
router.put('/:id', validatePostId, (req, res) => {
  const { id } = req.post;
  const updatedPost = {
    ...req.post,
    ...req.body
  };

  postDb
    .update(id, updatedPost)
    .then((recordCount) => {
      res.status(200).json(updatedPost);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: 'The post could not be updated'
      });
    });
});

// custom middleware
function validatePostId(req, res, next) {
  const { id } = req.params;
  postDb
    .getById(id)
    .then((post) => {
      if (post) {
        req.post = post;
        next();
      } else {
        res.status(400).json({
          message: 'invalid post id'
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'exception', err });
    });
}

module.exports = router;

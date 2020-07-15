const express = require('express');

const postDb = require('../posts/postDb');

const router = express.Router();

router.get('/', (req, res) => {
  // this endpoint is the same as the one in the userRouter
});

/* ----- GET /api/users/:userId/posts/:postId ----- */
router.get('/:postId', validatePostId, (req, res) => {
  res.status(200).json(req.post);
});

router.delete('/:id', (req, res) => {
  // do your magic!
});

router.put('/:id', (req, res) => {
  // do your magic!
});

// custom middleware

function validatePostId(req, res, next) {
  const id = req.params.postId;
  console.log('id', id);
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

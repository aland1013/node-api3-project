const express = require('express');

const userDb = require('./userDb');
const postDb = require('../posts/postDb');

const router = express.Router();

/* ----- POST /api/users ----- */
router.post('/', validateUser, (req, res) => {
  userDb
    .insert(req.body)
    .then((newUser) => {
      res.status(201).json(newUser);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: 'There was an error while saving the user to the database'
      });
    });
});

/* ----- POST /api/users/:id/posts ----- */
router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  postDb
    .insert(req.body)
    .then((newPost) => {
      res.status(201).json(newPost);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: 'There was an error while saving the post to the database'
      });
    });
});

/* ----- GET /api/users ----- */
router.get('/', (req, res) => {
  userDb
    .get()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: 'The users information could not be retrieved'
      });
    });
});

/* ----- GET /api/users/:id ----- */
router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

/* ----- GET /api/users/:id/posts ----- */
router.get('/:id/posts', validateUserId, (req, res) => {
  userDb
    .getUserPosts(req.user.id)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: 'The post information could not be retrieved'
      });
    });
});

/* ----- DELETE /api/users/:id ----- */
router.delete('/:id', validateUserId, (req, res) => {
  userDb
    .remove(req.user.id)
    .then((recordCount) => {
      res.status(200).json(req.user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: 'The user could not be removed'
      });
    });
});

/* ----- PUT /api/users/:id ----- */
router.put('/:id', validateUserId, validateUser, (req, res) => {
  const { id } = req.user;
  const updatedUser = { ...req.user, ...req.body };

  userDb
    .update(id, updatedUser)
    .then((recordCount) => {
      res.status(200).json(updatedUser);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: 'The user could not be updated'
      });
    });
});

//custom middleware
function validateUserId(req, res, next) {
  const { id } = req.params;
  userDb
    .getById(id)
    .then((user) => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({ message: 'invalid user id' });
        // next(new Error('invalid user id'));
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'exception', err });
    });
}

function validateUser(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: 'missing user data' });
  } else if (!req.body.name) {
    res.status(400).json({ message: 'missing required name field' });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: 'missing post data' });
  } else if (!req.body.text) {
    res.status(400).json({ message: 'missing required text field' });
  } else {
    next();
  }
}

module.exports = router;

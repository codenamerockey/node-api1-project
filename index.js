// implement your API here

const express = require('express');

const server = express();

const users = require('./data/db');

server.use(express.json());
const port = 8080;

server.get('/api/users', (req, res) => {
  users
    .find()
    .then(user => {
      res.status(200).json({ users: user });
    })
    .catch(err => {
      res.status(400).json({ message: 'Error getting users' });
    });
});

server.get('/api/users/:id', (req, res) => {
  const id = req.params.id;

  users
    .findById(id)
    .then(user => {
      if (user) {
        console.log(user);
        res.status(200).json({ users: user });
      } else {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist.' });
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Error finding user id' });
    });
});

// add a user
server.post('/api/users', (req, res) => {
  //get hub data from the request
  const userBody = req.body;
  if (!userBody.name || !userBody.bio) {
    res.status(400).json({ message: 'please provide a name and bio for user' });
  }
  console.log('user data', userBody);
  //add the hub to the database
  users
    .insert(userBody)
    .then(user => {
      //send the list of hubs back to client
      res.status(200).json({ users: user }); //.json() will set the right headers and convert to JSON
    })
    .catch(err => {
      res.json({ message: 'Error saving the users' });
    });
});

server.delete('/api/users/:id', (req, res) => {
  const removeId = req.params.id;

  users.findById(removeId).then(user => {
    if (user) {
      res.status(200).json(user);
      users
        .remove(removeId)
        .then(() => null)
        .catch(err => {
          res.status(500).json({ message: 'Error removing the user' });
        });
    } else {
      res
        .status(404)
        .json({ message: 'The user with the specified Id does not exist' });
    }
  });
});

server.put('/api/users/:id', (req, res) => {
  const changes = req.body;
  const putId = req.params.id;

  if (!changes.name || !changes.bio) {
    res
      .status(400)
      .json({ message: 'Please provide name and bio for the user' });
  }

  users
    .update(putId, changes)
    .then(() => {
      users
        .findById(putId)
        .then(user => {
          if (user) {
            res.status(200).json(user);
          } else if (!user) {
            res
              .status(404)
              .json({
                message: 'The user with the specified ID does not exist.'
              });
          }
        })
        .catch();
    })
    .catch(err => {
      res
        .status(500)
        .json({
          message: 'error: "The user information could not be modified.'
        });
    });
});

server.listen(port, () => console.log(`\n**Server running on port ${port}**`));

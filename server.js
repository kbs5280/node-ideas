const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static('public'));

if (!module.parent) {
  app.listen(3001, () => {
    console.log('Node Ideas is live! (http://localhost:3001)');
  });
}

app.get('/', (request, response) => {
  database('ideas').select()
          .then(function(ideas) {
            response.status(200).json(ideas);
          })
          .catch(function(error) {
            console.error('somethings wrong with db')
          });
})

app.post('/', (request, response) => {
  const title = request.body.idea.title;
  const body = request.body.idea.body;

  const idea = { title, body };
  database('ideas').insert(idea)
  .then(function() {
    database('ideas').select()
            .then(function(ideas) {
              response.status(200).json(ideas);
            })
            .catch(function(error) {
              console.error('somethings wrong with db')
            });
  })
});

app.put('/ideas/:id', (request, response) => {
  const idea = request.body.idea;
  const id = parseInt(request.params.id, 10);
  const index = app.locals.ideas.findIndex((m) => m.id === id);

  if (index === -1) { return response.sendStatus(404); }

  const oldIdea = app.locals.ideas[index];
  app.locals.ideas[index] = Object.assign(oldIdea, idea);

  return response.sendStatus(204);
});

app.delete('/ideas/:id', (request, response) => {
  const id = parseInt(request.params.id, 10);
  if (!app.locals.ideas.find((m) => m.id === id)) {
    return response.status(404).send({
      error: `There is no idea with the "id" of ${id}.`
    });
  }
  app.locals.ideas = app.locals.ideas.filter((m) => m.id !== id);
  response.sendStatus(204);
});

module.exports = app;

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.locals.ideas = [];

app.use(express.static('public'));

if (!module.parent) {
  app.listen(3000, () => {
    console.log('Node Ideas is live! (http://localhost:3000)');
  });
}

app.get('/', (request, response) => {
  response.send({ ideas: app.locals.ideas });
});


app.post('/ideas', (request, response) => {
  const idea = request.body.idea;

  idea.id = idea.id || Date.now();
  app.locals.ideas.push(idea);

  response.status(201).send({ idea: idea });
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

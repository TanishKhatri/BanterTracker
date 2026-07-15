const express = require('express');

const app = express();

app.get('/', (request, response) => {
  response.send('<h1>Hello, World</h1>');
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log('app running on port 3001');
});

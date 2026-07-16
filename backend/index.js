import express from "express";

const app = express();

app.get("/api", (request, response) => {
  response.send("<h1>Hello, World</h1>");
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log("app running on port 3001");
});

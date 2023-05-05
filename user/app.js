const express = require("express");
const bodyParser = require("body-parser");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const USER_PORT = 8000;
const CONTENT_PORT = 8001;
const RELATIONSHIP_PORT = 8002;
const MESSAGING_PORT = 8003;
const NOTIFICATIONS_PORT = 8004;
const ANALYTICS_PORT = 8005;

const MY_PORT = CONTENT_PORT;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// test path
app.get("/", (req, res) => {
  console.log({ base: req.hostname, query: req.query });
  res.send("Hello!");
});

// just data in variables for now
var Users = [
  { id: 1, name: "b", pass: "abc1", uri: "/user/1" },
  { id: 2, name: "s", pass: "abc3", uri: "/user/2" },
  { id: 3, name: "c", pass: "abc9", uri: "/user/3" },
  { id: 4, name: "t", pass: "abc4", uri: "/user/4" },
];

// Basic api
app.get("/users", (req, res) => {
  // get list of users (use query params as needed to filter)
  res.json(Users);
});

app.get("/user/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = Users.find((u) => u.id === id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.post("/users", (req, res) => {
  const user = req.body;
  console.log({ user: user });

  user.id = Users.length + 1;
  user.uri = "/user/" + user.id;
  Users.push(user);

  // ****** show how an API can use another API
  const url = "http://" + req.hostname + ":" + USER_PORT + "/user/" + user.id;
  const options = {
    method: "GET",
  };

  fetch(url, options)
    .then((xres) => xres.json())
    .then((xjson) => {
      // Note this in here for THIS example
      res.json({ user: user, fromapi: xjson });
      console.log("got response from API", xjson);
    })
    .catch((err) => console.error("error:" + err));

  res.status(201);
});

app.put("/user/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = Users.find((u) => u.id === id);
  if (user) {
    // Update user's profile information based on the request body
    user.name = req.body.name;
    user.pass = req.body.pass;
    res.json(user);
  } else {
    res.status(404).json({ error: "user not found" });
  }
});

// end api

app.listen(MY_PORT, () => {
  console.log("Listening on port " + MY_PORT + "...");
});

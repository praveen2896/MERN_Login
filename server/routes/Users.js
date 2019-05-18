var express = require("express");
var cors = require("cors");
var bcrypt = require("bcrypt");
const User = require("../models/User");

const users = express.Router();
users.use(cors());

process.env.SECRET_KEY = "secret";

users.get("/api/customers", (req, res) => {
  const customers = [
    { id: 1, firstname: "john", lastname: "bruto" },
    { id: 2, firstname: "praveen", lastname: "kumar" },
    { id: 3, firstname: "john", lastname: "stark" }
  ];
  res.json(customers);
});

module.exports = users;

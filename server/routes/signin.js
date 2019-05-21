var express = require("express");
var cors = require("cors");
const User = require("../models/User");
const UserSession = require("../models/UserSession");
const signin = express.Router();
signin.use(cors());

signin.get("/account", (req, res) => {
  res.json({
    message: "hello"
  });
});

signin.post("/api/account/signup", (req, res, next) => {
  const { body } = req;
  const { firstName, lastName, email, password } = body;
  if (!firstName) {
    return res.send({
      success: false,
      message: "Error:first name cannot be blank"
    });
  }
  if (!lastName) {
    return res.send({
      success: false,
      message: "Error:lastName cannot be blank"
    });
  }
  if (!email) {
    return res.send({
      success: false,
      message: "Error:email cannot be blank"
    });
  }
  if (!password) {
    return res.send({
      success: false,
      message: "Error:password  cannot be blank"
    });
  }
  //steps
  //1.verify email is already there or not
  //2.save
  User.find(
    {
      email: email.toLowerCase()
    },
    (err, previosUsers) => {
      console.log(previosUsers);
      if (err) {
        return res.send({
          success: false,
          message: "Error : server error"
        });
      } else if (previosUsers.length > 0) {
        console.log("error");
        return res.send({
          success: false,
          message: "Error : Account Already Exists"
        });
      }
      console.log("success");
      //save the new user
      const newUser = new User();
      newUser.email = email;
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.password = newUser.generateHash(password);
      newUser.save((err, user) => {
        console.log(err);
        if (err) {
          return res.send({
            success: false,
            message: "Error : Account Already Exists"
          });
        }
        return res.send({
          success: true,
          message: "Signed Up"
        });
      });
    }
  );
});

signin.post("/api/account/signin", (req, res, next) => {
  const { body } = req;
  const { email, password } = body;
  if (!email) {
    return res.send({
      success: false,
      message: "Error:email cannot be blank"
    });
  }
  if (!password) {
    return res.send({
      success: false,
      message: "Error:password  cannot be blank"
    });
  }

  // email = email.toLowerCase();

  User.find({ email: email.toLowerCase() }, (err, users) => {
    console.log(err + "  " + email);
    console.log(users);
    if (err) {
      return res.send({
        success: false,
        message: "Error :server error1"
      });
    }
    if (users.length != 1) {
      return res.send({
        success: false,
        message: "Error : Error Invalid"
      });
    }

    const user = users[0];
    if (!user.validPassword(password)) {
      return res.send({
        success: false,
        message: "Error : Error Invalid password"
      });
    }

    //Otherwise correct user
    const userSession = new UserSession();
    userSession.userId = user._id;
    userSession.save((err, doc) => {
      console.log(err);
      if (err) {
        return res.send({
          success: false,
          message: "Error :server error2"
        });
      }
      console.log(doc);
      return res.send({
        sucess: true,
        message: "hi " + user.firstName + " valid sign in ",
        token: doc._id
      });
    });
  });
});

signin.get("/api/account/verify", (req, res, next) => {
  const { query } = req;
  //get the token
  const { token } = query;
  // const { token } = query;
  //?token = test
  //verift the token
  console.log(token);
  UserSession.find(
    {
      _id: token,
      isDeleted: false
    },
    (err, sessions) => {
      console.log(err);
      if (err) {
        return res.send({
          sucess: false,
          message: "Error : Server Error"
        });
      }
      console.log(sessions);
      if (sessions.length != 1) {
        return res.send({
          sucess: false,
          message: "Error : Invalid"
        });
      } else {
        return res.send({
          sucess: true,
          message: "Good"
        });
      }
    }
  );
});

signin.get("/api/account/logout", (req, res, next) => {
  const { query } = req;
  //get the token
  const { token } = query;
  // const { token } = query;
  //?token = test
  //verift the token
  console.log(token);
  UserSession.findOneAndUpdate(
    {
      _id: token,
      isDeleted: false
    },
    { $set: { isDeleted: true } },
    null,
    (err, sessions) => {
      console.log(err);
      if (err) {
        return res.send({
          sucess: false,
          message: "Error : Server Error"
        });
      }
      return res.send({
        sucess: true,
        message: "Good"
      });
    }
  );
});
module.exports = signin;

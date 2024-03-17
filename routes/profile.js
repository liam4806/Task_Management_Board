const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Project = require("../models/project");
const Task = require("../models/task");
const Team = require("../models/team");
const User = require("../models/user");
const res = require("express/lib/response");
const async = require("async");
const formidable = require("formidable");
const router = express.Router();

const authcheck = (req, res, next) => {
  // next();
  if (!req.user) {
    res.redirect("/login");
  } else {
    next();
  }
};

router.get("/", function (req, res) {
  res.render("profile", {
    user: req.user,
    // newfriend: req.user.request
  });
});

router.get("/search", function (req, res) {
  let sent = [];
  let friends = [];
  let received = [];
  let friend_ids =[];
  received = req.user.request;
  sent = req.user.sentRequest;
  friends = req.user.friendsList;
  User.find({ _id: { $ne: req.user._id } }).then((result) => {
    res.render("search", {
      result: result,
      sent: sent,
      friends: friends,
      received: received,
      loguser: req.user,
    });
  });
});

router.post("/search", function (req, res) {
  let searchfriend = req.body.searchfriend;
  let sent = [];
  let friends = [];
  let received = [];
  received = req.user.request;
  sent = req.user.sentRequest;
  friends = req.user.friendsList;
  if (searchfriend) {
    let mssg = "";
    User.find({ name: searchfriend }).then((result) => {
      res.render("search", {
        result: result,
        mssg: mssg,
        sent: sent,
        friends: friends,
        received: received,
        loguser: req.user,
      });
    });
  }

  async.parallel(
    [
      async function (callback) {
        if (req.body.receiverName) {
          await User.findByIdAndUpdate(
            {
              _id: req.body.receiverName,
              "request.userId": { $ne: req.user._id },
              "friendList.friendId": { $ne: req.user_id },
            },
            {
              $push: {
                request: {
                  userId: req.user._id,
                  name: req.user.name,
                },
              },
              $inc: { totalRequest: 1 },
            }
          );
        }
      },
      async function (callback) {
        if (req.body.receiverName) {
          await User.findByIdAndUpdate(req.user._id, {
            $push: {
              sentRequest: req.body.receiverName,
            },
          });
        }
      },
    ],
    (err, results) => {
      res.redirect("/search");
    }
  );
  async.parallel([
    // this function is updated for the receiver of the friend request when it is accepted
    async function (callback) {
      if (req.body.senderId) {
        await User.findByIdAndUpdate(
          {
            _id: req.user._id,
            "friendsList.friendId": { $ne: req.body.senderId },
          },
          {
            $push: {
              friendsList: req.body.senderId,
            },
            $pull: {
              request: {
                userId: req.body.senderId,
                name: req.body.senderName,
              },
              sentRequest: req.body.receiver_Id,
            },
            $inc: { totalRequest: -1 },
          }
        );
      }
    },
    // this function is updated for the sender of the friend request when it is accepted by the receiver
    async function (callback) {
      if (req.body.senderId) {
        await User.findByIdAndUpdate(
          {
            _id: req.body.senderId,
            "friendsList.friendId": { $ne: req.user._id },
          },
          {
            $push: {
              friendsList: req.user._id,
            },
            $pull: {
              sentRequest: req.body.receiver_Id,
            },
          }
        );
      }
    },
    async function (callback) {
      if (req.body.user_Id) {
        await User.findByIdAndUpdate(
          {
            _id: req.user._id,
            "request.userId": { $eq: req.body.user_Id },
          },
          {
            $pull: {
              request: {
                userId: req.body.user_Id,
              },
              sentRequest: req.body.receiver_Id,
            },
          }
        );
        await User.findByIdAndUpdate(
          {
            _id: req.body.user_Id,
          },
          {
            $pull: {
              sentRequest: req.body.receiver_Id,
            },
          }
        );
      }
    },
  ]);
});

module.exports = router;

// Import dependencies
var Grid = require("gridfs-stream");
var mongo = require("mongodb");
const MongoClient = mongo.MongoClient;
const express = require("express");
const app = express.Router();

const connectionString =
  "mongodb://admin:YellowPieGuy23!@brekke.asuscomm.com:27017/?authSource=admin";

MongoClient.connect(connectionString, function (err, db) {
  var db = db.db("Cube");
  app.get("/business", (req, res) => {
    const cursor = db
      .collection("Business")
      .find()
      .limit(10)
      .toArray()
      .then((results) => {
        res.status(200).json(results);
      });
  });

  app.get("/uploads/:objectId", function (req, res) {
    var id = req.params.objectId;
    var gfs = Grid(db, mongo);
    gfs.exist(
      { filename: "/home/evan/dataset/curb_photos/" + id + ".jpg" },
      function (err, found) {
        if (found) {
          var readstream = gfs.createReadStream({
            filename: "/home/evan/dataset/curb_photos/" + id + ".jpg",
          });
          res.header({ "Content-type": "image/jpg" });
          readstream.pipe(res);
        }else{
          res.end()
        }
      }
    );
  });
});
module.exports = app;

// Import dependencies
const mongodb = require("mongodb")
const MongoClient = require("mongodb").MongoClient;
const express = require("express");
const app = express.Router();

const connectionString =
  "mongodb://admin:YellowPieGuy23!@brekke.asuscomm.com:27017/?authSource=admin";

MongoClient.connect(connectionString, function(err,db){
    var db = db.db("Cube");
    app.get("/business", (req, res) => {
      const cursor = db
        .collection("Business")
        .find({}, { name: 1, stars: 1, categories: 1 })
        .limit(10)
        .toArray()
        .then((results) => {
          res.status(200).json(results);
        });
    });

    app.get("/uploads/:objectId", function (req, res) {
      var id = req.params.objectId;
      let bucket = new mongodb.GridFSBucket(db,{bucketName:'photos'});
      bucket.findOne(
        {
          "business_id": id,
        },
        (err, file) => {
          if (err) {
            // report the error
          } else {
            // detect the content type and set the appropriate response headers.
            let mimeType = file.contentType;
            if (!mimeType) {
              mimeType = mime.lookup(file.filename);
            }
            res.set({
              "Content-Type": mimeType,
              "Content-Disposition": "attachment; filename=" + file.filename,
            });

            const readStream = gfs.createReadStream({
              _id: id,
            });
            readStream.on("error", (err) => {
              // report stream error
            });
            // the response will be the file itself.
            readStream.pipe(res);
          }
        }
      );
    });
  }
);
module.exports = app;

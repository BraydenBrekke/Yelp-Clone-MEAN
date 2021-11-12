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

    app.get("/business/:business_id", (req, res) => {
        const bid = req.params.business_id;

        const cursor = db
            .collection("Business")
            .find({business_id: bid})
            .limit(1)
            .toArray()
            .then((results) => {
                res.status(200).json(results);
            });
    });

    app.get("/reviews", (req, res) => {
        const cursor = db
            .collection("Review")
            .find()
            .limit(10)
            .toArray()
            .then((results) => {
                res.status(200).json(results);
            });
    });

    app.get("/review/:business_id", (req, res) => {
        const bid = req.params.business_id;

        const cursor = db
            .collection("Review")
            .aggregate([
                {
                    $match: {business_id: bid}
                },
                {
                    $lookup:
                        {
                            from: 'User',
                            localField: 'user_id',
                            foreignField: 'user_id',
                            as: 'user_details'
                        }
                }
            ])
            .limit(50)
            .toArray()
            .then((results) => {
                res.status(200).json(results);
            }).catch((results) => {
                res.status(204).json([]);
            });
    });


    app.get("/uploads/:objectId", function (req, res) {
        var id = req.params.objectId;
        var gfs = Grid(db, mongo);
        gfs.exist(
            {filename: "/home/evan/dataset/curb_photos/" + id + ".jpg"},
            function (err, found) {
                if (found) {
                    var readstream = gfs.createReadStream({
                        filename: "/home/evan/dataset/curb_photos/" + id + ".jpg",
                    });
                    res.header({"Content-type": "image/jpg"});
                    readstream.pipe(res);
                } else {
                    res.end()
                }
            }
        );
    });
});
module.exports = app;

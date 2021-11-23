// Import dependencies
var Grid = require("gridfs-stream");
var mongo = require("mongodb");
const MongoClient = mongo.MongoClient;
const express = require("express");
const app = express.Router();
var moment = require('moment');

const connectionString =
    "mongodb://admin:YellowPieGuy23!@brekke.asuscomm.com:27017/?authSource=admin";

MongoClient.connect(connectionString, function (err, db) {
    var db = db.db("Cube");

    app.get("/business", (req, res) => {
        if (req.query.limit) {
            var limit = parseInt(req.query.limit);
        } else {
            var limit = 100;
        }
        if (req.query.page) {
            var page = parseInt(req.query.page) * limit;
        } else {
            var page = 0;
        }
        const cursor = db
            .collection("Business")
            .find()
            .limit(limit)
            .skip(page)
            .toArray()
            .then((results) => {
                res.status(200).json(results);
            });
    });
    app.get("/business-length", (req, res) => {
        const cursor = db
            .collection("Business")
            .count()
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
        if (req.query.limit) {
            var limit = parseInt(req.query.limit);
        } else {
            var limit = 100;
        }
        if (req.query.page) {
            var page = parseInt(req.query.page) * limit;
        } else {
            var page = 0;
        }

        const cursor = db
            .collection("Review")
            .find()
            .skip(page)
            .limit(limit)
            .toArray()
            .then((results) => {
                res.status(200).json(results);
            });
    });
    app.get("/review-length/:business_id", (req, res) => {
        const bid = req.params.business_id;
        const cursor = db
            .collection("Review")
            .aggregate([
                {
                    $match: {business_id: bid},
                },
                {
                    $lookup: {
                        from: "User",
                        localField: "user_id",
                        foreignField: "user_id",
                        as: "user_details",
                    },
                },
                {
                    $count: "review_id"
                }
            ]).toArray()
            .then((results) => {
                res.status(200).json(results);
            });
    });

    app.get("/review/:business_id", (req, res) => {
        const bid = req.params.business_id;
        if (req.query.limit) {
            var limit = parseInt(req.query.limit);
        } else {
            var limit = 100;
        }
        if (req.query.page) {
            var page = parseInt(req.query.page) * limit;
        } else {
            var page = 0;
        }

        const cursor = db
            .collection("Review")
            .aggregate([
                {
                    $match: {business_id: bid},
                },
                {
                    $lookup: {
                        from: "User",
                        localField: "user_id",
                        foreignField: "user_id",
                        as: "user_details",
                    },
                },
                {
                    $skip: page
                }
            ])
            .limit(limit)
            .toArray()
            .then((results) => {
                res.status(200).json(results);
            })
            .catch((results) => {
                res.status(204).json([]);
            });
    });

    app.post("/review/:business_id", function (req, res) {
        var business_id = req.params.business_id;
        var body = req.body;

        /*

         // business_id: string;
          // cool: number;
          // date: string;
          // funny: number;
          // review_id: string;
          stars: number;
          text: string;
          // useful: number;
          // user_id: string;

         */

        var reviewobj = {
            text: body.text,
            stars: body.stars,
            business_id: business_id,
            user_id: body.user_id,
            date: moment().format('YYYY-MM-DD hh:mm:ss')
        };

        const origRes = res;

        db.collection("Review").insertOne(reviewobj, function (err, res) {
            if (err) throw err;

            db.collection("Business")
                .find({business_id: business_id})
                .limit(1)
                .toArray()
                .then((results) => {
                    const bData = results[0];

                    db.collection('Business').updateOne(
                        {business_id: business_id},
                        {
                            $inc: {review_count: 1},
                            $set: {
                                // https://math.stackexchange.com/questions/106700/incremental-averaging
                                stars: Number(
                                    Number(
                                        ((bData.stars * bData.review_count) + reviewobj.stars) / bData.review_count++
                                    ).toFixed(1)
                                )
                            }
                        },
                        function (err, result) {
                            if (err) throw err;

                        }
                    );

                });

            origRes.end();
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
                    res.end();
                }
            }
        );
    });


});
module.exports = app;

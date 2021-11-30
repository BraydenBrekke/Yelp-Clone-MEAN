// Import dependencies
var Grid = require("gridfs-stream");
var mongo = require("mongodb");
const MongoClient = mongo.MongoClient;
const express = require("express");
const app = express.Router();
var moment = require("moment");

const connectionString =
    "mongodb://admin:YellowPieGuy23!@brekke.asuscomm.com:27017/?authSource=admin";

MongoClient.connect(connectionString, function (err, db) {
    var db = db.db("Cube");

    app.get("/business/:business_id/uploads/", (req, res) => {
        var bid = req.params.business_id;
        const cursor = db
            .collection("Photos")
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
            ])
            .toArray()
            .then((results) => {
                res.status(200).json(results);
            })
            .catch((results) => {
                res.status(204).json([]);
            });
    });

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
        if (req.query.filter) {
            var filter = {name: {'$regex': req.query.filter, '$options': 'i'}}
        }

        const cursor = db
            .collection("Business")
            .find(filter)
            .limit(limit)
            .sort({"review_count": -1})
            .skip(page)
            .toArray()
            .then((results) => {
                res.status(200).json(results);
            });
    });
    app.get("/business-length", (req, res) => {
        if (req.query.filter) {
            var filter = {name: {'$regex': req.query.filter, '$options': 'i'}}
        }
        const cursor = db
            .collection("Business")
            .find(filter)
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
                    $count: "review_id",
                },
            ])
            .toArray()
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
                    $skip: page,
                },
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
            date: moment().format("YYYY-MM-DD hh:mm:ss"),
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

                    db.collection("Business").updateOne(
                        {business_id: business_id},
                        {
                            $inc: {review_count: 1},
                            $set: {
                                // https://math.stackexchange.com/questions/106700/incremental-averaging
                                stars: Number(
                                    Number(
                                        (bData.stars * bData.review_count + reviewobj.stars) /
                                        bData.review_count++
                                    ).toFixed(1)
                                ),
                            },
                        },
                        function (err, result) {
                            if (err) throw err;
                        }
                    );
                });

            origRes.end();
        });
    });

    app.get("/business/uploads/:pictureId", function (req, res) {
        var id = req.params.pictureId;
        var gfs = Grid(db, mongo);
        gfs.exist(
            {filename: "/home/evan/dataset/curb_photos/" + id},
            function (err, found) {
                if (found) {
                    var readstream = gfs.createReadStream({
                        filename: "/home/evan/dataset/curb_photos/" + id,
                    });
                    res.header({"Content-type": "image/jpg"});
                    readstream.pipe(res);
                } else {
                    res.end();
                }
            }
        );
    });

    app.get("/top-businesses", (req, res) => {
        db
            .collection("Business")
            .find({}, {"name": 1, "stars": 1, "review_count": 1, "city": 1, "state": 1, "_id": 0})
            .limit(10)
            .sort({"stars": -1, "review_count": -1})
            .toArray()
            .then((results) => {
                res.status(200).json(results);
            });
    });

    app.get("/best-cities", (req, res) => {
        db
            .collection("Business")
            .aggregate([
                {$group: {_id: "$city", count: {$sum: 1}, state: {$first: "$state"}}},
                {$sort: {count: -1}},
                {
                    $project: {
                        city: "$_id",
                        state: 1,
                        count: 1,
                        _id: 0
                    }
                }
            ])
            .limit(10)
            .toArray()
            .then((results) => {
                res.status(200).json(results);
            });
    });

    app.get("/top-users", (req, res) => {
        db
            .collection("User")
            .find({}, {"name": 1, "review_count": 1, "yelping_since": 1, "_id": 0})
            .limit(10)
            .sort({"review_count": -1})
            .toArray()
            .then((results) => {
                res.status(200).json(results);
            });
    });
});
module.exports = app;
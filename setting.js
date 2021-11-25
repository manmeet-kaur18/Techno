module.exports = {
    load: function () {
        console.log("Server-side code running");
        express = require("express");
        app = express();
        PORT = process.env.PORT || 8080;
        app.use(express.static("public"));
        bodyParser = require("body-parser");
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(express.json());
        app.set("view engine", "ejs");
        axios = require('axios');
        mongodb = require("mongodb");
        MongoClient = require("mongodb").MongoClient;

        path = require('path');
        crypto = require('crypto');
        mongoose = require('mongoose');
        multer = require('multer');
        const { GridFsStorage } = require('multer-gridfs-storage');
        Grid = require('gridfs-stream');
        const { abort } = require("process");
        const { addAbortSignal } = require("stream");
        e = require("express");
        const { resolveSoa } = require("dns");
        nodemailer = require("nodemailer");

        // DB
        mongoURI = "mongodb://ThaparUser:Pass123@cluster0-shard-00-00.jsaod.mongodb.net:27017,cluster0-shard-00-01.jsaod.mongodb.net:27017,cluster0-shard-00-02.jsaod.mongodb.net:27017/TechAcademy?ssl=true&replicaSet=atlas-1u2syf-shard-0&authSource=admin&retryWrites=true&w=majority";
        url = "mongodb://ThaparUser:Pass123@cluster0-shard-00-00.jsaod.mongodb.net:27017,cluster0-shard-00-01.jsaod.mongodb.net:27017,cluster0-shard-00-02.jsaod.mongodb.net:27017/TechAcademy?ssl=true&replicaSet=atlas-1u2syf-shard-0&authSource=admin&retryWrites=true&w=majority";


        conn = mongoose.createConnection(mongoURI);

        // Init gfs
        gfs = null;

        conn.once('open', () => {
            // Init stream
            gfs = Grid(conn.db, mongoose.mongo);
            gfs.collection('uploads');
        });

        // Create storage engine
        storage = new GridFsStorage({
            url: mongoURI,
            file: (req, file) => {
                return new Promise((resolve, reject) => {
                    crypto.randomBytes(16, (err, buf) => {
                        if (err) {
                            return reject(err);
                        }
                        filename = buf.toString('hex') + path.extname(file.originalname);
                        fileInfo = {
                            filename: filename,
                            bucketName: 'uploads'
                        };
                        resolve(fileInfo);
                    });
                });
            }
        });
        upload = multer({ storage });
        db = null;
        MongoClient.connect(url, (err, database) => {
            if (err) {
                return console.log(err);
            }
            db = database;

            app.listen((PORT), () => {
                console.log('listening on deployed server');
                app.emit( "app_started" );
            });

        });

        facultyIDglobal="";
        StudentRollNoglobal="";
        StudentemailIDglobal="";
    }
};

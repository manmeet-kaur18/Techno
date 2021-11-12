console.log("Server-side code running");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.static("public"));
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

const crypto = require("crypto");
const path = require("path");
const mongoose = require("mongoose");
const https = require('https')
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const { RSA_NO_PADDING } = require("constants");
var axios = require('axios');
const MongoClient = require("mongodb").MongoClient;
const mongodb = require("mongodb");

// DB
const mongoURI = "mongodb://ThaparUser:Pass123@cluster0-shard-00-00.jsaod.mongodb.net:27017,cluster0-shard-00-01.jsaod.mongodb.net:27017,cluster0-shard-00-02.jsaod.mongodb.net:27017/TechAcademy?ssl=true&replicaSet=atlas-1u2syf-shard-0&authSource=admin&retryWrites=true&w=majority";
const url = "mongodb://ThaparUser:Pass123@cluster0-shard-00-00.jsaod.mongodb.net:27017,cluster0-shard-00-01.jsaod.mongodb.net:27017,cluster0-shard-00-02.jsaod.mongodb.net:27017/TechAcademy?ssl=true&replicaSet=atlas-1u2syf-shard-0&authSource=admin&retryWrites=true&w=majority";

let db;
MongoClient.connect(url, (err, database) => {
  if (err) {
    return console.log(err);
  }
  db = database;
});

// connection
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// init gfs
let gfs;
conn.once("open", () => {
  // init stream
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads"
  });
});

// Storage
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads"
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({
  storage
});

// get / page
app.get("/writtenexam", (req, res) => {
  if (!gfs) {
    console.log("some error occured, check connection to db");
    res.send("some error occured, check connection to db");
    process.exit(0);
  }
  gfs.find().toArray((err, files) => {
    // check if files
    if (!files || files.length === 0) {
      return res.render("WrittenExams", {
        files: false
      });
    } else {
      const f = files
        .map(file => {
          if (
            file.contentType === "image/png" ||
            file.contentType === "image/jpeg"
          ) {
            file.isImage = true;
          } else {
            file.isImage = false;
          }
          return file;
        })
        .sort((a, b) => {
          return (
            new Date(b["uploadDate"]).getTime() -
            new Date(a["uploadDate"]).getTime()
          );
        });

      return res.render("WrittenExam", {
        files: f
      });
    }

    // return res.json(files);
  });
});

app.post("/upload", upload.single("file"), (req, res) => {
  res.redirect("/writtenexam");
});

app.get("/files", (req, res) => {
  gfs.find().toArray((err, files) => {
    // check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "no files exist"
      });
    }

    return res.json(files);
  });
});

app.get("/files/:filename", (req, res) => {
  gfs.find(
    {
      filename: req.params.filename
    },
    (err, file) => {
      if (!file) {
        return res.status(404).json({
          err: "no files exist"
        });
      }

      return res.json(file);
    }
  );
});

app.get("/image/:filename", (req, res) => {
  // console.log('id', req.params.id)
  const file = gfs
    .find({
      filename: req.params.filename
    })
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "no files exist"
        });
      }
      gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    });
});

// // files/del/:id
// // Delete chunks from the db
// app.post("/files/del/:id", (req, res) => {
//   gfs.delete(new mongoose.Types.ObjectId(req.params.id), (err, data) => {
//     if (err) return res.status(404).json({ err: err.message });
//     res.redirect("/writtenexam");
//   });
// });

app.listen((PORT), () => {
  console.log('listening on deployed server');
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/welcomePage.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login-index.html");
});


app.get("/home", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});


app.get("/exams", (req, res) => {
  res.sendFile(__dirname + "/examsmainPage.html");
});



app.get("/mcq", (req, res) => {
  res.sendFile(__dirname + "/MCQExam.html");
});


app.get("/coding", (req, res) => {
  res.sendFile(__dirname + "/CodingExam.html");
});


app.get("/ClassList", (req, res) => {
  res.sendFile(__dirname + "/faculty_ClassList.html");
});


app.get("/studentList", (req, res) => {
  res.sendFile(__dirname + "/faculty_StudentList.html");
});

app.get("/schedule", (req, res) => {
  res.sendFile(__dirname + "/faculty_classSchedule.html");
})

app.get("/adminHome", (req, res) => {
  res.sendFile(__dirname + "/adminhome.html");
})

app.post("/execute", (req, res) => {
  console.log(req.body);
  var data = JSON.stringify(req.body);

  console.log(data);
  var config = {
    method: 'post',
    url: 'https://codexweb.netlify.app/.netlify/functions/enforceCode',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  };
  axios(config)
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
})

//Login

app.post("/signin", (req, res) => {
  if (req.body.role == "faculty") {
    db.collection("Faculty").find({ FacultyID: req.body.FacultyID, password: req.body.password }).toArray((err, result) => {
      if (err) {
        res.send(err);
      }
      else {
        res.send(result);
      }
    });
  }
  else if (req.body.role == "student") {
    db.collection("Students").find({ RollNo: req.body.RollNo, password: req.body.password }).toArray((err, result) => {
      if (err) {
        res.send(err);
      }
      else {
        res.send(result);
      }
    });
  }
  else if (req.body.role == "admin") {
    db.collection("Admin").find({ adminID: req.body.adminID, password: req.body.password }).toArray((err, result) => {
      if (err) {
        res.send(err);
      }
      else {
        res.send(result);
      }
    });
  }
})


//admin home functionalities
app.get('/getBatchlist', (req, res) => {
  db.collection("BatchDetails").find().toArray((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});
app.get('/getCourseslist', (req, res) => {
  db.collection("CourseDetails").find().toArray((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});


app.get('/getFacultylist', (req, res) => {
  db.collection("Faculty").find().toArray((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.post('/getSemester', (req, res) => {
  db.collection("BatchDetails").find({ BatchID: req.body.BatchID }).toArray((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});


app.post('/getCoursesforBS', (req, res) => {
  db.collection("BatchDetails").find({ BatchID: req.body.BatchID, Semester: req.body.Semester }).toArray((err, result) => {
    if (err) {
      res.send(err);
    } else {
      db.collection("CourseUndertaken").find({ Semester: req.body.Semester, BranchID: result[0].BranchID }).toArray((err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
    }
  });
});

app.post("/registerStudent", (req, res) => {
  db.collection("Students").save(req.body, (err, result) => {
    if (err) {
      return console.log(err);
    }
    console.log("click added to db");
    res.send([
      {
        message: "Request successfully logged",
        status: true,
      },
    ]);
  });
});


app.post("/registerBatch", (req, res) => {
  db.collection("BatchDetails").find({ BatchID: req.body.BatchID, Semester: req.body.Semester }).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    else {
      if (result.length == 0) {
        db.collection("BatchDetails").save(req.body, (err, result) => {
          if (err) {
            return console.log(err);
          }
          console.log("click added to db");
          res.send([
            {
              message: "Request successfully logged",
              status: true,
            },
          ]);
        });
      }
      else {
        res.send([]);
      }
    }
  });
});


app.post("/registerCourse", (req, res) => {
  db.collection("CourseDetails").find({ CourseID: req.body.CourseID }).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    else {
      if (result.length == 0) {
        db.collection("CourseDetails").save(req.body, (err, result) => {
          if (err) {
            return console.log(err);
          }
          console.log("click added to db");
          res.send([
            {
              message: "Request successfully logged",
              status: true,
            },
          ]);
        });
      }
      else {
        res.send([]);
      }
    }
  });
});

app.post("/addCoursetoBranch", (req, res) => {
  db.collection("CourseUndertaken").find({ BranchID: req.body.BranchID, Semester: req.body.Semester, CourseID: req.body.CourseID }).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    else {
      if (result.length == 0) {
        db.collection("CourseUndertaken").save(req.body, (err, result) => {
          if (err) {
            return console.log(err);
          }
          console.log("click added to db");
          res.send([
            {
              message: "Request successfully logged",
              status: true,
            },
          ]);
        });
      }
      else {
        res.send([]);
      }
    }
  });
});

app.post("/registerFaculty", (req, res) => {
  db.collection("Faculty").find().sort([['_id', -1]]).limit(1).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    var lastfid = "0";
    if (result.length > 0) {
      lastfid = (parseInt(result[0]['FacultyID']) + 1).toString();
    }
    var facultynew = {
      'FacultyID': lastfid,
      'FacultyName': req.body.FacultyName,
      'phone': req.body.phone,
      'email': req.body.email,
      'password': req.body.password,
    }
    db.collection("Faculty").save(facultynew, (err, result) => {
      if (err) {
        return console.log(err);
      }
      console.log("click added to db");
      res.send([
        {
          message: "Request successfully logged",
          status: true,
        },
      ]);
    });
  })
});

app.post("/AssignFaculty", (req, res) => {
  db.collection("LectureDetails").find({FacultyID:req.body.FacultyID,BranchID: req.body.BranchID, Semester: req.body.Semester, CourseID: req.body.CourseID }).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    else {
      if (result.length == 0) {
        db.collection("LectureDetails").save(req.body, (err, result) => {
          if (err) {
            return console.log(err);
          }
          console.log("click added to db");
          res.send([
            {
              message: "Request successfully logged",
              status: true,
            },
          ]);
        });
      }
      else {
        res.send([]);
      }
    }
  });
});
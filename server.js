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
var axios = require('axios');
const MongoClient = require("mongodb").MongoClient;

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

app.get("/FacultyTimeTable", (req, res) => {
  res.sendFile(__dirname + "/Faculty_timetable.html");
})
app.get("/createSchedule", (req, res) => {
  res.sendFile(__dirname + "/createScheduleforfaculty.html");
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
      db.collection("CourseUndertaken").find({ Semester: req.body.Semester, BranchID: result[0].BranchID, Year: req.body.Year }).toArray((err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
    }
  });
});

app.post('/getCoursesTaughtByFaculty', (req, res) => {
  db.collection("CoursesTaughtByFaculty").find({ Year: req.body.Year, Semester: req.body.Semester, FacultyID: req.body.FacultyID }).toArray((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});
app.post('/getFacultyBusySlots', (req, res) => {
  db.collection("LectureSchedule").find({ Year: req.body.Year, TeacherSem: req.body.TeacherSem, FacultyID: req.body.FacultyID, Day: req.body.Day }).toArray((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});
app.post('/getFacultyAssignedSlots', (req, res) => {
  db.collection("LectureSchedule").find({ Year: req.body.Year, TeacherSem: req.body.TeacherSem, FacultyID: req.body.FacultyID }).toArray((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});
app.post('/getBatchBusySlots', (req, res) => {
  db.collection("LectureSchedule").find({ Year: req.body.Year, Semester: req.body.Semester, BatchID: req.body.BatchID, Day: req.body.Day }).toArray((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/registerStudent", (req, res) => {
  db.collection("Students").find({ RollNo: req.body.RollNo }).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    else {
      if (result.length == 0) {
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
        })
      }
      res.send([]);
    }
  });
});


app.post("/assignStudenttoBatch", (req, res) => {
  db.collection("Students").find({ RollNo: req.body.RollNo }).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    else {
      if (result.length == 0) {
        db.collection("StudentBatchInfo").find({ RollNo: req.body.RollNo, Year: req.body.Year }).toArray((err, result) => {
          if (err) {
            res.send(err);
          }
          else if (result.length == 1) {
            if (result[0].Semester % 2 != req.body.Semester) {
              db.collection("StudentBatchInfo").save(req.body, (err, result) => {
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
              })
            }
            else {
              res.send([{ message: "A batch already exists for the rollNo for the same sem in year i.e, Even Sem or Odd sem", status: false }]);
            }
          }
          else if (result.length == 0) {
            db.collection("StudentBatchInfo").save(req.body, (err, result) => {
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
            })
          }
          else {
            res.send([{ message: "The Student has been Already Assigned to 2 batches for the entered year does not exist", status: false }]);
          }
        });
      }
      else {
        res.send([{ message: "The Roll Number does not exist", status: false }]);
      }
    }
  });
});

app.post("/registerLectureSchedule", (req, res) => {
  db.collection("LectureSchedule").save(req.body, (err, result) => {
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
  db.collection("CoursesTaughtByFaculty").find({ FacultyID: req.body.FacultyID, Semester: req.body.Semester, CourseID: req.body.CourseID, Year: req.body.Year }).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    else {
      if (result.length == 0) {
        db.collection("CoursesTaughtByFaculty").save(req.body, (err, result) => {
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
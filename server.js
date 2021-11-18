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
const mongodb = require("mongodb");
const MongoClient = require("mongodb").MongoClient;

const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const { abort } = require("process");
const { addAbortSignal } = require("stream");
const e = require("express");
const { resolveSoa } = require("dns");
var nodemailer = require("nodemailer");

// DB
const mongoURI = "mongodb://ThaparUser:Pass123@cluster0-shard-00-00.jsaod.mongodb.net:27017,cluster0-shard-00-01.jsaod.mongodb.net:27017,cluster0-shard-00-02.jsaod.mongodb.net:27017/TechAcademy?ssl=true&replicaSet=atlas-1u2syf-shard-0&authSource=admin&retryWrites=true&w=majority";
const url = "mongodb://ThaparUser:Pass123@cluster0-shard-00-00.jsaod.mongodb.net:27017,cluster0-shard-00-01.jsaod.mongodb.net:27017,cluster0-shard-00-02.jsaod.mongodb.net:27017/TechAcademy?ssl=true&replicaSet=atlas-1u2syf-shard-0&authSource=admin&retryWrites=true&w=majority";


const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });
app.get('/uploadAnswers', (req, res) => {
  res.sendFile(__dirname + "/index1.html");
});


app.post('/upload', upload.single('image'), (req, res, next) => {
  var data = {
    filename: req.file.filename,
    examID: req.body.ExamID,
    rollNo: req.body.rollNo,
    status: "checked",
    FacultyID: facultyIDglobal,
    MarksObtained: req.body.MarksObtained,
    message: ""
  }
  db.collection("StudentAnswerSheetInfo").find({ examID: req.body.examID, rollNo: req.body.rollNo }).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    var finaldata = data;
    if (result.length != 0) {
      result[0].filedname = result[0].filename + ',' + data.filename;
      finaldata = result[0];
    }
    db.collection('StudentAnswerSheetInfo').save(finaldata, (err, result) => {
      if (err) {
        res.send(err);
      }
      else {
        res.redirect('/UploadCheckedAnswerSheets')
      }
    });
  });
});


app.post('/uploadNotes', upload.single('file'), (req, res) => {
  var d = new Date()
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  var sem = "1";
  if (month > 6) {
    sem = "2";
  }
  //check it
  var data = {
    filename: req.file.filename,
    CourseID: req.body.CourseID,
    Semester: sem,
    Year: year.toString(),
    type: "file",
    link: "",
    description:req.body.description
  }
  db.collection('LectureNotes').save(data, (err, result) => {
    if (err) {
      res.send(err);
    }
    res.send([{
      message: "Lecture Notes Uploaded for the Course",
      status: true
    }]);
  });
});

app.post('/LectureLinkUpload', (req, res) => {
  db.collection('LectureNotes').save(req.body, (err, result) => {
    if (err) {
      res.send(err);
    }
    res.send([{
      message: "Lecture Notes Uploaded for the Course",
      status: true
    }]);
  });
});

app.get('/downloadFile/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    // if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    // } else {
    //   res.status(404).json({
    //     err: 'Not an image'
    //   });
    // }
  });
});

// ALL THE GLOBAL VARIABLES WHICH WILL REMAIN CONSTANT THROUGHTOUT THE SESSION OF A USER
var facultyIDglobal;
var examIDglobal;
var StudentRollNoglobal;
var StudentemailIDglobal;

let db;
MongoClient.connect(url, (err, database) => {
  if (err) {
    return console.log(err);
  }
  db = database;

  app.listen((PORT), () => {
    console.log('listening on deployed server');
  });

});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/welcomePage.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login-index.html");
});


app.get("/home", (req, res) => {
  res.sendFile(__dirname + "/Student_Timetable.html");
});


app.get("/exams", (req, res) => {
  res.sendFile(__dirname + "/examsmainPage.html");
});



app.get("/mcq/:examid", (req, res) => {
  examIDglobal = req.params.examid;
  db.collection('StudentOnlineAnwers').find({ examID: examIDglobal, RollNo: StudentRollNoglobal }).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    if (result.length > 0) {
      res.sendFile(__dirname + "/SubmittedMessage.html");
    }
    else {
      res.sendFile(__dirname + "/MCQExam.html");
    }
  })
});


app.get("/coding/:examid", (req, res) => {
  examIDglobal = req.params.examid;
  db.collection('StudentOnlineAnwers').find({ examID: examIDglobal, RollNo: StudentRollNoglobal }).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    if (result.length > 0) {
      res.sendFile(__dirname + "/SubmittedMessage.html");
    }
    else {
      res.sendFile(__dirname + "/CodingExam.html");
    }
  })
});

app.get("/studentList", (req, res) => {
  res.sendFile(__dirname + "/faculty_StudentList.html");
});

app.get("/adminHome", (req, res) => {
  res.sendFile(__dirname + "/adminhome.html");
})

app.get("/FacultyTimeTable", (req, res) => {
  res.sendFile(__dirname + "/Faculty_timetable.html");
})

app.get("/createSchedule", (req, res) => {
  res.sendFile(__dirname + "/createScheduleforfaculty.html");
})
app.get("/markAttendance", (req, res) => {
  res.sendFile(__dirname + "/Faculty_MarkAttendance.html");
})

app.get("/Student_Attendance", (req, res) => {
  res.sendFile(__dirname + "/Student_Attendance.html");
})

app.get("/Student_FacultyContactInfo", (req, res) => {
  res.sendFile(__dirname + "/Student_FacultyInformation.html");
})

app.get("/Student_ExamInfo", (req, res) => {
  res.sendFile(__dirname + "/Student_ExamInfo.html");
})

app.get("/Student_OfflineExamInfo", (req, res) => {
  res.sendFile(__dirname + "/Student_OfflineExamInfo.html");
})

app.get("/Faculty_StudentInfo", (req, res) => {
  res.sendFile(__dirname + "/faculty_StudentList.html");
})

app.get("/Faculty_RecheckRequests", (req, res) => {
  res.sendFile(__dirname + "/Faculty_RecheckRequests.html");
})

app.get("/UploadCheckedAnswerSheets", (req, res) => {
  res.sendFile(__dirname + "/faculty_UploadCheckedAnswers.html");
})

app.get("/ScheduleNewExam", (req, res) => {
  res.sendFile(__dirname + "/faculty_ScheduleNewExam.html");
})

app.get("/ScheduleCodingExam", (req, res) => {
  res.sendFile(__dirname + "/Faculty_AddaNewCodingExam.html");
})

app.get("/UpdateAnwserOnlineExam", (req, res) => {
  res.sendFile(__dirname + "/Faculty_UpdateAnwer.html");
})

app.get("/ScheduleOfflineExam", (req, res) => {
  res.sendFile(__dirname + "/Faculty_AddOfflineExam.html");
})

app.get("/submittedMessage", (req, res) => {
  res.sendFile(__dirname + "/SubmittedMessage.html");
})


app.get("/Faculty_ResolveDoubts", (req, res) => {
  res.sendFile(__dirname + "/Faculty_Doubt.html");
})

app.get("/Faculty_UploadNotes", (req, res) => {
  res.sendFile(__dirname + "/Faculty_UploadNotes.html");
})


app.get("/Student_StudyMaterial", (req, res) => {
  res.sendFile(__dirname + "/Student_ViewNotes.html");
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
    db.collection("Faculty").find({ FacultyID: req.body.ID, password: req.body.password }).toArray((err, result) => {
      if (err) {
        res.send(err);
      }
      if (result.length == 0) {
        res.send([]);
      }
      else {
        facultyIDglobal = result[0].FacultyID;
        res.send(result);
      }
    });
  }
  else if (req.body.role == "student") {
    db.collection("Students").find({ RollNo: req.body.ID, password: req.body.password }).toArray((err, result) => {
      if (err) {
        res.send(err);
      }
      if (result.length == 0) {
        res.send([]);
      }
      else {
        StudentRollNoglobal = result[0].RollNo;
        StudentemailIDglobal = result[0].Email;
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
  db.collection("CourseUndertaken").find({ BranchID: req.body.BranchID, Semester: req.body.Semester, CourseID: req.body.CourseID, Year: req.body.Year }).toArray((err, result) => {
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

app.post('/getFacultyTimeTable', (req, res) => {
  db.collection("LectureSchedule").find({ Year: req.body.Year, TeacherSem: req.body.TeacherSem, FacultyID: facultyIDglobal }).toArray((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});


app.post('/getFacultyUpcomingClasses', (req, res) => {
  db.collection("LectureSchedule").find({ Year: req.body.Year, TeacherSem: req.body.Sem, FacultyID: facultyIDglobal, Day: req.body.day }).toArray((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.post('/getStudentWeeklyPreference', (req, res) => {
  db.collection("StudentWeeklyPreference").find({ Year: req.body.Year, Semester: req.body.Semester, BatchID: req.body.BatchID, CourseID: req.body.CourseID }).toArray((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});


app.post('/getStatusFacultyUpcomingClasses', (req, res) => {
  db.collection("LectureScheduledHistory").find({ Year: req.body.Year, Semester: req.body.Semester, BatchID: req.body.BatchID, CourseID: req.body.CourseID, TeacherSem: req.body.TeacherSem, FacultyID: facultyIDglobal, Date: req.body.Date, TimeSlot: req.body.TimeSlot }).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    else {
      res.send(result);
    }
  });
});

app.post("/UpdateLecSchHis", (req, res) => {
  var data = {
    'Year': req.body.Year,
    'FacultyID': facultyIDglobal,
    'BatchID': req.body.BatchID,
    'CourseID': req.body.CourseID,
    'Semester': req.body.Semester,
    'TeacherSem': req.body.TeacherSem,
    'Date': req.body.Date,
    'TimeSlot': req.body.TimeSlot,
    'Status': req.body.Status
  };
  db.collection("LectureScheduledHistory").save(data, (err, result) => {
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

var pcCourseID = "";
var pcBatchID = "";
var pcYear = "";
var pcSemester = "";
var pcTimeSlot = "";
var pcdate = "";

app.post('/getPresentClass', (req, res) => {
  db.collection("LectureScheduledHistory").find({ Year: req.body.Year, TeacherSem: req.body.Sem, FacultyID: facultyIDglobal, Date: req.body.Date }).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    else {
      if (result.length > 0) {
        pcCourseID = result[0].CourseID;
        pcBatchID = result[0].BatchID;
        pcYear = result[0].Year;
        pcSemester = result[0].Semester;
        pcTimeSlot = result[0].TimeSlot;
        pcdate = result[0].Date;
      }
      res.send(result);
    }
  });
});

app.post('/getStudentsofPresentClass', (req, res) => {
  db.collection("StudentBatchInfo").aggregate([
    {
      "$lookup": {
        "from": "Students",
        "localField": "RollNo",
        "foreignField": "RollNo",
        "as": "StudentInfoTable"
      }
    },
    { $unwind: "$StudentInfoTable" },
    {
      $match: {
        $and: [{ "Year": pcYear }, { "Semester": pcSemester }, { "BatchID": pcBatchID }]
      }
    } //,
    // {
    //   $project: {
    //     RollNo: "$StudentInfoTable.RollNo",
    //     Name: "$StudentInfoTable.Name",

    //   }
    // }
  ]).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    else {
      res.send(result);
    }
  });
});

app.post('/markPresent', (req, res) => {
  var data = {
    'RollNo': req.body.RollNo,
    'Year': pcYear,
    'BatchID': pcBatchID,
    'Semester': pcSemester,
    'CourseID': pcCourseID,
    'Date': pcdate,
    'TimeSlot': pcTimeSlot
  }
  db.collection("StudentAttendance").save(data, (err, result) => {
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
});


app.post('/getStudentBatch', (req, res) => {
  db.collection("StudentBatchInfo").find({ Year: req.body.Year, RollNo: StudentRollNoglobal }).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    else {
      res.send(result);
    }
  });
});

app.post('/getStudentTimeTable', (req, res) => {
  db.collection("LectureSchedule").aggregate([
    {
      "$lookup": {
        "from": "Faculty",
        "localField": "FacultyID",
        "foreignField": "FacultyID",
        "as": "FacultyInfo"
      }
    },
    { $unwind: "$FacultyInfo" },
    {
      $match: {
        $and: [{ "Year": req.body.Year }, { "BatchID": req.body.BatchID }, { "Semester": req.body.Semester }, { "TeacherSem": req.body.TeacherSem }]
      }
    },
  ]).toArray((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

//tocheck
app.post('/getStudentUpcomingClasses', (req, res) => {
  db.collection("LectureSchedule").find({ Year: req.body.Year, TeacherSem: req.body.TeacherSem, BatchID: req.body.BatchID, Semester: req.body.Semester, Day: req.body.day }).toArray((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

//to check
app.post('/getStatusStdUpCls', (req, res) => {
  db.collection("LectureScheduledHistory").find({ Year: req.body.Year, Semester: req.body.Semester, BatchID: req.body.BatchID, CourseID: req.body.CourseID, TeacherSem: req.body.TeacherSem, FacultyID: req.body.FacultyID, Date: req.body.Date, TimeSlot: req.body.TimeSlot }).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    else {
      res.send(result);
    }
  });
});

app.post('/getStudentBatches', (req, res) => {
  db.collection("StudentBatchInfo").find({ RollNo: StudentRollNoglobal }).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    else {
      res.send(result);
    }
  });
});


app.post('/getAssignedFaculty', (req, res) => {
  db.collection("LectureSchedule").aggregate([
    {
      "$lookup": {
        "from": "Faculty",
        "localField": "FacultyID",
        "foreignField": "FacultyID",
        "as": "FacultyInfo"
      }
    },
    { $unwind: "$FacultyInfo" },
    {
      $match: {
        $and: [{ "Year": req.body.Year }, { "Semester": req.body.Semester }, { "BatchID": req.body.BatchID }]
      }
    }
  ]).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    else {
      res.send(result);
    }
  });
});


app.post('/getAssignedBatches', (req, res) => {
  db.collection("LectureSchedule").find({ FacultyID: facultyIDglobal, Year: req.body.Year, TeacherSem: req.body.TeacherSem }).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    else {
      res.send(result);
    }
  });
});

app.post('/getStudentsofBatch', (req, res) => {
  db.collection("StudentBatchInfo").aggregate([
    {
      "$lookup": {
        "from": "Students",
        "localField": "RollNo",
        "foreignField": "RollNo",
        "as": "StudentInfoTable"
      }
    },
    { $unwind: "$StudentInfoTable" },
    {
      $match: {
        $and: [{ "Year": req.body.Year }, { "Semester": req.body.Semester }, { "BatchID": req.body.BatchID }]
      }
    }
  ]).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    else {
      res.send(result);
    }
  });
});

//check it again
app.post("/SaveWeeklyPreference", (req, res) => {
  db.collection("StudentWeeklyPreference").find({ StudentRollNo: StudentRollNoglobal, Semester: req.body.Semester, CourseID: req.body.CourseID, Year: req.body.Year, BatchID: req.body.BatchID, Date: req.body.Date }).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    else {
      if (result.length == 0) {
        var data = {
          'StudentRollNo': StudentRollNoglobal,
          'Year': req.body.Year,
          'BatchID': req.body.BatchID,
          'Semester': req.body.Semester,
          'Online': req.body.Online,
          'CourseID': req.body.CourseID,
          'Date': req.body.Date
        };
        db.collection("StudentWeeklyPreference").save(data, (err, result) => {
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
        res.send([{ status: false }]);
      }
    }
  });
});


app.post('/getCoursesOfferedByYear', (req, res) => {
  db.collection("CourseUndertaken").find({ Year: req.body.Year }).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    else {
      res.send(result);
    }
  });
});

app.post('/getBatches', (req, res) => {
  db.collection("BatchDetails").find({ Year: req.body.Year }).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    else {
      res.send(result);
    }
  });
});

app.post('/AddExam', (req, res) => {
  db.collection("ExamDetails").find({ Date: req.body.data[req.body.data.length - 1].Date, CourseID: { $in: req.body.data[req.body.data.length - 1].CourseList }, 'BatchID': { $in: req.body.data[req.body.data.length - 1].BatchList }, 'Semester': req.body.data[req.body.data.length - 1].Semester }).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    else {
      var t = req.body.data.pop();
      var flag = false;
      for (var x = 0; x < result.length; x++) {
        for (var y = 0; y < req.body.data.length; y++) {
          if ((req.body.data[y].StartTime < result[0].EndTime && req.body.data[y].StartTime > result[0].StartTime) || (req.body.data[y].EndTime < result[0].EndTime && req.body.data[y].EndTime > result[0].StartTime)) {
            flag = true;
            break;
          }
        }
        if (flag == true) {
          break;
        }
      }
      if (flag == false) {
        db.collection("ExamDetails").insert(req.body.data, (err, result) => {
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
        res.send([
          {
            message: "Request Unsuccessful",
            status: false,
          },
        ]);
      }
    }
  });
});

app.post('/getStudentAttendance', (req, res) => {
  db.collection("StudentAttendance").find({ Year: req.body.Year, Semester: req.body.Semester, BatchID: req.body.BatchID, RollNo: StudentRollNoglobal }).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    var res1 = {};
    for (var x = 0; x < result.length; x++) {
      if (result[0].CourseID in res1) {
        res1[result[0].CourseID] += 1;
      }
      else {
        res1[result[0].CourseID] = 1;
      }
    }
    db.collection("LectureScheduledHistory").find({ Year: req.body.Year, Semester: req.body.Semester, BatchID: req.body.BatchID }).toArray((err, result1) => {
      if (err) {
        res.send(err);
      }
      var res2 = {};
      for (var x = 0; x < result1.length; x++) {
        if (result1[0].CourseID in res2) {
          res2[result1[0].CourseID + result[0]] += 1;
        }
        else {
          res2[result1[0].CourseID] = 1;
        }
      }
      var finalres = {};
      for (x in res2) {
        if (x in res1) {
          finalres[x] = { 'Student': res1[x], 'Teacher': res2[x] };
        }
        else {
          finalres[x] = { 'Student': 0, 'Teacher': res2[x] };
        }
      }
      res.send([finalres]);
    });
  });
})


app.post('/getCoursesTaught', (req, res) => {
  db.collection("CoursesTaughtByFaculty").find({ Year: req.body.Year, Semester: req.body.Semester, FacultyID: facultyIDglobal }).toArray((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.post('/getExamsforUpdate', (req, res) => {
  db.collection("ExamDetails").find({ Year: req.body.Year, TeacherSem: req.body.TeacherSem, CourseID: req.body.CourseID }).toArray((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.post('/UpdateAnwserOnlineExam', (req, res) => {
  db.collection("ExamDetails").find({ _id: new mongodb.ObjectId(req.body.examid) }).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    if (result[0].Questions.length > parseInt(req.body.questionid) - 1) {
      result[0].Questions[parseInt(req.body.questionid) - 1].correctAns = req.body.correctanswer;
      db.collection("ExamDetails").save(result[0], (err, result2) => {
        if (err) {
          return console.log(err);
        }
        db.collection('StudentOnlineAnwers').find({ examID: req.body.examid }).toArray((err, result1) => {
          if (err) {
            return err;
          }
          for (var x = 0; x < result1.length; x++) {
            var ans = result1[x].StudentAnswers[parseInt(req.body.questionid) - 1].Ans
            var correctansnew = req.body.correctanswer;

            var array = ans.split(',');
            var array1 = correctansnew.split(',');

            var set = new Set();

            for (var y = 0; y < array1.length; y++) {
              set.add(array1[y].toLowerCase());
            }
            var correctno = 0;
            for (var y = 0; y < array.length; y++) {
              if (set.has(array[y].toLowerCase()) == true) {
                correctno += 1;
              }
            }
            var wrong = array.length - correctno;
            var newmarks = (correctno / array1.length) * (parseInt(result[0].Questions[parseInt(req.body.questionid) - 1].marks))
            newmarks = newmarks - wrong * 0.5;

            var oldmarks = parseInt(result1[x].MarksObtained);
            oldmarks = oldmarks - (parseInt(result1[x].StudentAnswers[parseInt(req.body.questionid) - 1].marks));
            newtotalmarks = oldmarks + newmarks;
            result1[x].StudentAnswers[parseInt(req.body.questionid) - 1].marks = newmarks.toString();
            result1[x].MarksObtained = newtotalmarks.toString();
          }
          let promises = [];
          for (var x = 0; x < result1.length; x++) {
            promises.push(db.collection("StudentOnlineAnwers").save(result1[x]));
          }
          var x = 0;
          Promise.all(promises).then(function (results) {
            results.forEach(function (response) {
              if (x == result1.length - 1) {
                res.send([{
                  status: true,
                  message: "Updated Successfully"
                }]);
              }
              x += 1;
            });
          });
        });
      });
    }
  });
});

//checking
app.post('/getUpcomingExams', (req, res) => {
  db.collection('ExamDetails').find({
    $or: [
      { BatchID: { $in: req.body.BatchID }, CourseID: { $in: req.body.Courselist }, Date: { $gt: req.body.Date }, Semester: req.body.Semester },
      { BatchID: { $in: req.body.BatchID }, CourseID: { $in: req.body.Courselist }, Date: req.body.Date, 'EndTime': { $gt: req.body.time }, Semester: req.body.Semester }
    ]
  }).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    res.send(result);
  })
})

app.post('/getPastExamDetails', (req, res) => {
  db.collection('ExamDetails').find({
    $or: [
      { BatchID: { $in: req.body.BatchID }, CourseID: { $in: req.body.Courselist }, Date: { $lt: req.body.Date }, Semester: req.body.Semester },
      { BatchID: { $in: req.body.BatchID }, CourseID: { $in: req.body.Courselist }, Date: req.body.Date, 'EndTime': { $lt: req.body.time }, Semester: req.body.Semester }
    ]
  }).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    res.send(result);
  })
});

app.post('/getStudentAnswers', (req, res) => {
  db.collection('StudentOnlineAnwers').find({ examID: req.body.examid }).toArray((err, result1) => {
    if (err) {
      return err;
    }
    res.send(result1);
  });
})

app.post('/getStudentsCheckedExams', (req, res) => {
  db.collection("StudentAnswerSheetInfo").aggregate([
    {
      "$lookup": {
        "let": { "userObjId": { "$toObjectId": "$examID" } },
        "from": "ExamDetails",
        "pipeline": [
          { "$match": { "$expr": { "$eq": ["$_id", "$$userObjId"] } } }
        ],
        "as": "ExamInfo"
      }
    },
    { $unwind: "$ExamInfo" },
    {
      $match: {
        $and: [{ "rollNo": StudentRollNoglobal }]
      }
    },
  ]).toArray((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
})

app.post("/UpdateStatusofAnswerSheet", (req, res) => {
  db.collection("StudentAnswerSheetInfo").find({ rollNo: StudentRollNoglobal, examID: req.body.examid }).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    result[0].status = req.body.status;
    result[0].message = req.body.message;

    db.collection("StudentAnswerSheetInfo").save(result[0], (err, result) => {
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
  });
});

app.post('/getSheetstoRecheck', (req, res) => {
  db.collection("StudentAnswerSheetInfo").aggregate([
    {
      "$lookup": {
        "let": { "userObjId": { "$toObjectId": "$examID" } },
        "from": "ExamDetails",
        "pipeline": [
          { "$match": { "$expr": { "$eq": ["$_id", "$$userObjId"] } } }
        ],
        "as": "ExamInfo"
      }
    },
    { $unwind: "$ExamInfo" },
    {
      $match: {
        $and: [{ "FacultyID": facultyIDglobal, "status": "recheck" }]
      }
    },
  ]).toArray((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
})

app.post("/UpdateMarksStatusRecheck", (req, res) => {
  db.collection("StudentAnswerSheetInfo").find({ rollNo: req.body.rollNo, examID: req.body.examid }).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    result[0].status = req.body.status;
    if (req.body.MarksObtained != "") {
      result[0].MarksObtained = req.body.MarksObtained;
    }
    db.collection("StudentAnswerSheetInfo").save(result[0], (err, result) => {
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
  });
});

var sampletestcasesoutputglobal = {};
var sampletestcaseinputglobal = {};
var testcasesinputglobal = {};
var testcasesoutputglobal = {};

app.post('/getCodingExamDetails', (req, res) => {
  db.collection("ExamDetails").find({ _id: mongodb.ObjectId(examIDglobal) }).toArray((err, result) => {
    if (err) {
      res.send(err);
    } else {
      for (var x = 0; x < result[0].Questions.length; x++) {
        testcasesinputglobal[result[0].Questions[x].questionid] = result[0].Questions[x].inputs;
        result[0].Questions[x].inputs = "";
        testcasesoutputglobal[result[0].Questions[x].questionid] = result[0].Questions[x].outputs;
        result[0].Questions[x].outputs = "";
        sampletestcaseinputglobal[result[0].Questions[x].questionid] = result[0].Questions[x].stcinput;
        sampletestcasesoutputglobal[result[0].Questions[x].questionid] = result[0].Questions[x].stcoutput;
      }
      res.send(result);
    }
  });
});

app.post('/getSampleTestcaseResult', (req, res) => {
  var testcasestocheck = sampletestcaseinputglobal[req.body.questionid];
  var Arrayinput = testcasestocheck.split('],[');
  Arrayinput[0] = Arrayinput[0].replace("[[", "");
  Arrayinput[Arrayinput.length - 1] = Arrayinput[Arrayinput.length - 1].replace("]]", "");
  testcasestocheck = sampletestcasesoutputglobal[req.body.questionid];
  var Arrayoutput = testcasestocheck.split('],[');
  Arrayoutput[0] = Arrayoutput[0].replace("[[", "");
  Arrayoutput[Arrayoutput.length - 1] = Arrayoutput[Arrayoutput.length - 1].replace("]]", "");

  var result = {
    Testcases: []
  };

  let promises = []
  for (var x = 0; x < Arrayinput.length; x++) {
    var str1 = Arrayinput[x].replace(/,/g, "\n");
    var str2 = Arrayoutput[x].replace(/,/g, "\n");
    var data = JSON.stringify({
      "code": req.body.code,
      "language": req.body.language,
      "input": str1
    });
    var config = {
      method: 'post',
      url: 'https://codexweb.netlify.app/.netlify/functions/enforceCode',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };
    promises.push(axios(config));
  }
  var count = 0;
  Promise.all(promises).then(function (results) {
    results.forEach(function (response) {
      var str2 = Arrayoutput[count].replace(/,/g, "\n");
      str2 += "\n";
      if (response.data.output == str2) {
        result.Testcases.push({ status: "Accepted" });
      }
      else {
        result.Testcases.push({ status: response.data.output });
      }
      count += 1;
      if (count == Arrayinput.length) {
        res.send([result]);
      }
    });
  });
});

app.post('/getTestcaseResult', (req, res) => {

  var testcasestocheck = testcasesinputglobal[req.body.questionid];
  var Arrayinput = testcasestocheck.split('],[');
  Arrayinput[0] = Arrayinput[0].replace("[[", "");
  Arrayinput[Arrayinput.length - 1] = Arrayinput[Arrayinput.length - 1].replace("]]", "");
  testcasestocheck = testcasesoutputglobal[req.body.questionid];
  var Arrayoutput = testcasestocheck.split('],[');
  Arrayoutput[0] = Arrayoutput[0].replace("[[", "");
  Arrayoutput[Arrayoutput.length - 1] = Arrayoutput[Arrayoutput.length - 1].replace("]]", "");

  var result = {
    Testcases: [],
    marks: "0"
  };

  let promises = []
  for (var x = 0; x < Arrayinput.length; x++) {
    var str1 = Arrayinput[x].replace(/,/g, "\n");
    var str2 = Arrayoutput[x].replace(/,/g, "\n");
    var data = JSON.stringify({
      "code": req.body.code,
      "language": req.body.language,
      "input": str1
    });
    var config = {
      method: 'post',
      url: 'https://codexweb.netlify.app/.netlify/functions/enforceCode',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };
    promises.push(axios(config));
  }
  var count = 0;
  var passed = 0;

  Promise.all(promises).then(function (results) {
    results.forEach(function (response) {
      var str2 = Arrayoutput[count].replace(/,/g, "\n");
      str2 += "\n";
      if (response.data.output == str2) {
        passed += 1;
        result.Testcases.push({ status: "Accepted" });
      }
      else {
        result.Testcases.push({ status: response.data.output });
      }
      count += 1;
      if (count == Arrayinput.length) {
        result.marks = ((parseInt(req.body.marks) * (passed)) / count).toString();
        res.send([result]);
      }
    });
  });
});

app.post("/SubmitTest", (req, res) => {
  var data = {
    examID: examIDglobal,
    RollNo: StudentRollNoglobal,
    StudentAnswers: req.body.StudentAnswers,
    MarksObtained: req.body.totalmarks
  }
  db.collection("StudentOnlineAnwers").save(data, (err, result) => {
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

var correctanswerslist = {};
app.post('/getMCQExamDetails', (req, res) => {
  db.collection("ExamDetails").find({ _id: mongodb.ObjectId(examIDglobal) }).toArray((err, result) => {
    if (err) {
      res.send(err);
    } else {
      for (var x = 0; x < result[0].Questions.length; x++) {
        correctanswerslist[result[0].Questions[x].questionid] = { 'correctanswer': result[0].Questions[x].correctAns, 'marks': result[0].Questions[x].marks };
        result[0].Questions[x].correctAns = "";
      }
      res.send(result);
    }
  });
});

app.post('/SubmitMCQExam', (req, res) => {
  var totalmarks = 0;
  for (var x = 0; x < req.body.StudentAnswers.length; x++) {
    var ans = req.body.StudentAnswers[x].Ans
    var correctansnew = correctanswerslist[req.body.StudentAnswers[x].questionid].correctanswer;

    var array = ans.split(',');
    var array1 = correctansnew.split(',');

    var set = new Set();

    for (var y = 0; y < array1.length; y++) {
      set.add(array1[y].toLowerCase());
    }
    var correctno = 0;
    for (var y = 0; y < array.length; y++) {
      if (set.has(array[y].toLowerCase()) == true) {
        correctno += 1;
      }
    }
    var wrong = array.length - correctno;
    var newmarks = (correctno / array1.length) * correctanswerslist[req.body.StudentAnswers[x].questionid].marks
    newmarks = newmarks - wrong * 0.5;
    totalmarks += newmarks;
    req.body.StudentAnswers[x].marks = newmarks.toString();
  }
  req.body['MarksObtained'] = totalmarks.toString();
  req.body['RollNo'] = StudentRollNoglobal;
  req.body['examID'] = examIDglobal;

  db.collection("StudentOnlineAnwers").save(req.body, (err, result) => {
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

app.post("/SaveDoubt", (req, res) => {
  req.body['RollNo'] = StudentRollNoglobal;
  req.body['StudentEmail'] = StudentemailIDglobal;
  db.collection("Doubts").save(req.body, (err, result) => {
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


app.post('/getUnsolvedDoubts', (req, res) => {
  db.collection("Doubts").find({ FacultyID: facultyIDglobal, status: "0" }).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    res.send(result);
  });
});

let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  secure: true,
  port: 587,
  auth: {
    user: "GBM918211@gmail.com",
    pass: "Pass#1234!1",
  },
});

app.post('/ResolveDoubt', (req, res) => {
  db.collection("Doubts").find({ _id: mongodb.ObjectId(req.body.id) }).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    result[0].status = "1";
    db.collection('Doubts').save(result[0], (err, result1) => {
      if (err) {
        res.send(err);
      }
      let HelperOptions = {
        from: "GBM918211@gmail.com",
        to: req.body.email,
        subject: "Your Doubt has been resolved",
        text:
          "Dear Student answer to your doubt i.e, " + result[0].doubt + " is as follows " + req.body.answer,
      };
      transporter.sendMail(HelperOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          res.send([{
            message: 'Doubt has been Resolved',
            status: true
          }])
        }
      });
    });
  });
});

app.post('/getStudyMaterial', (req, res) => {
  db.collection("LectureNotes").find({ Year:req.body.Year, Semester:req.body.Semester,CourseID:req.body.CourseID }).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    res.send(result);
  });
});
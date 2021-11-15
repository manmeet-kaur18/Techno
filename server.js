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

// DB
const mongoURI = "mongodb://ThaparUser:Pass123@cluster0-shard-00-00.jsaod.mongodb.net:27017,cluster0-shard-00-01.jsaod.mongodb.net:27017,cluster0-shard-00-02.jsaod.mongodb.net:27017/TechAcademy?ssl=true&replicaSet=atlas-1u2syf-shard-0&authSource=admin&retryWrites=true&w=majority";
const url = "mongodb://ThaparUser:Pass123@cluster0-shard-00-00.jsaod.mongodb.net:27017,cluster0-shard-00-01.jsaod.mongodb.net:27017,cluster0-shard-00-02.jsaod.mongodb.net:27017/TechAcademy?ssl=true&replicaSet=atlas-1u2syf-shard-0&authSource=admin&retryWrites=true&w=majority";

// ALL THE GLOBAL VARIABLES WHICH WILL REMAIN CONSTANT THROUGHTOUT THE SESSION OF A USER
var facultyIDglobal;
var StudentRollNoglobal;

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



app.get("/mcq", (req, res) => {
  res.sendFile(__dirname + "/MCQExam.html");
});


app.get("/coding", (req, res) => {
  res.sendFile(__dirname + "/CodingExam.html");
});


// app.get("/ClassList", (req, res) => {
//   res.sendFile(__dirname + "/faculty_ClassList.html");
// });


app.get("/studentList", (req, res) => {
  res.sendFile(__dirname + "/faculty_StudentList.html");
});

// app.get("/schedule", (req, res) => {
//   res.sendFile(__dirname + "/faculty_classSchedule.html");
// })

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
      if(result.length==0){
        res.send([]);
      }
      else{
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
      if(result.length==0){
        res.send([]);
      }
      else{
      StudentRollNoglobal = result[0].RollNo;
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
    // {
    //   $project: {
    //     CourseID: "$LectureSchedule.CourseID",
    //     FacultyID: "$FacultyInfo.FacultyID",
    //     FacultyName:"$FacultyInfo.FacultyName",
    //     phone:"$FacultyInfo.phone",
    //     email:"$FacultyInfo.email",
    //     TimeSlot:"$LectureSchedule.TimeSlot",
    //     Day:"$LectureSchedule.Day"
    //   }
    // }
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
  db.collection("ExamDetails").find({ Date: req.body.Date }).toArray((err, result) => {
    if (err) {
      res.send(err);
    }
    else {
      for (var x = 0; x < result.length; x++) {
        if (req.body.Semester == result[0].Semester && ((req.body.StartTime < result[0].EndTime && req.body.StartTime > result[0].StartTime) || (req.body.EndTime < result[0].EndTime && req.body.EndTime > result[0].StartTime))) {
          flag = true;
          break;
        }
      }
      if (flag == false) {
        db.collection("ExamDetails").save(req.body, (err, result) => {
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
  db.collection("StudentAttendance").find({ Year: '2021', Semester: '6', BatchID: 'COE6', RollNo: '101803095' }).toArray((err, result) => {
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
    db.collection("LectureScheduledHistory").find({ Year: '2021', Semester: '6', BatchID: 'COE6' }).toArray((err, result1) => {
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
            var marks = 0;
            for (var y = 0; y < result1[x].StudentAnswers.length; y++) {
              if (result1[x].StudentAnswers[y].Ans == result[0].Questions[y].correctAns) {
                marks += parseInt(result[0].Questions[y].marks);
              }
            }
            result1[x].MarksObtained = marks.toString();
          }
          for(var x=0;x<result1.length;x++){
            db.collection("StudentOnlineAnwers").save(result1[x], (err, result3) => {
              if (err) {
                return err;
              }
              if(x==result1.length-1){
                return [{
                  status: true,
                  message: "Updated Successfully"
                }];
              }
            });
          }      
        });
      });
    }
  });
});

//checking
app.post('/getUpcomingExams',(req,res)=>{
  db.collection('ExamDetails').find({
    $or:[
      {BatchID:{$in:req.body.BatchID},CourseID:{$in:req.body.Courselist},Date:{$gt :req.body.Date}},
      {BatchID:{$in:req.body.BatchID},CourseID:{$in:req.body.Courselist},Date:req.body.Date,'EndTime':{$gt:req.body.time}}
    ]
  }).toArray((err,result)=>{
    if(err){
      res.send(err);
    }
    res.send(result);
  })
})

app.post('/getPastExamDetails',(req,res)=>{
  db.collection('ExamDetails').find({
    $or:[
      {BatchID:{$in:req.body.BatchID},CourseID:{$in:req.body.Courselist},Date:{$lt :req.body.Date},Semester:req.body.Semester},
      {BatchID:{$in:req.body.BatchID},CourseID:{$in:req.body.Courselist},Date:req.body.Date,'EndTime':{$lt:req.body.time},Semester:req.body.Semester}
    ]
  }).toArray((err,result)=>{
    if(err){
      res.send(err);
    }
    res.send(result);
  })
});

app.post('/getStudentAnswers',(req,res)=>{
  db.collection('StudentOnlineAnwers').find({ examID: req.body.examid }).toArray((err, result1) => {
    if (err) {
      return err;
    }
    res.send(result1);
  });
})

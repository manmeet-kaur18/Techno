module.exports = function () {

  app.get("/studentList", (req, res) => {
    res.sendFile(__dirname + "/faculty_StudentList.html");
  });

  app.get("/FacultyTimeTable", (req, res) => {
    res.sendFile(__dirname + "/Faculty_timetable.html");
  })
  app.get("/markAttendance", (req, res) => {
    res.sendFile(__dirname + "/Faculty_MarkAttendance.html");
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


  app.get("/Cancel_Lecture", (req, res) => {
    res.sendFile(__dirname + "/Faculty_CancelLectureForm.html");
  })

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


  app.post('/getFacultySchedule', (req, res) => {
    db.collection("LectureSchedule").find({ Year: req.body.Year, TeacherSem: req.body.TeacherSem, FacultyID: facultyIDglobal }).toArray((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  });


  app.post("/CancelLecture", (req, res) => {
    req.body['FacultyID'] = facultyIDglobal;
    db.collection("LectureScheduledHistory").save(req.body, (err, result) => {
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


  app.post('/getFacultyUpcomingClasses', (req, res) => {
    db.collection("LectureSchedule").find({ Year: req.body.Year, TeacherSem: req.body.Sem, FacultyID: facultyIDglobal, Day: req.body.day }).toArray((err, result) => {
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


  app.post('/getStudentWeeklyPreference', (req, res) => {
    db.collection("StudentWeeklyPreference").find({ Year: req.body.Year, Semester: req.body.Semester, BatchID: req.body.BatchID, CourseID: req.body.CourseID }).toArray((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
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

  app.post('/getFacultyTimeTable', (req, res) => {
    db.collection("LectureSchedule").find({ Year: req.body.Year, TeacherSem: req.body.TeacherSem, FacultyID: facultyIDglobal }).toArray((err, result) => {
      if (err) {
        res.send(err);
      } else {
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
            if (result1.length > 0) {
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
            }
            else {
              res.send([{
                status: true,
                message: "Updated Successfully"
              }]);
            }
          });
        });
      }
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
    db.collection("StudentAnswerSheetInfo").find({ examID: req.body.ExamID, rollNo: req.body.rollNo }).toArray((err, result) => {
      if (err) {
        res.send(err);
      }
      var finaldata = data;
      if (result.length != 0) {
        result[0].filename = result[0].filename + ',' + data.filename;
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
      description: req.body.description
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




}
module.exports = function () {

    app.get("/adminHome", (req, res) => {
        res.sendFile(__dirname + "/adminhome.html");
    });

    app.get("/createSchedule", (req, res) => {
        res.sendFile(__dirname + "/createScheduleforfaculty.html");
    });

    app.post("/assignStudenttoBatch", (req, res) => {
        db.collection("Students").find({ RollNo: req.body.RollNo }).toArray((err, result) => {
            if (err) {
                res.send(err);
            }
            else {
                if (result.length > 0) {
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
                else {
                    res.send([]);
                }
            }
        });
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

    app.post('/getSemester', (req, res) => {
        db.collection("BatchDetails").find({ BatchID: req.body.BatchID }).toArray((err, result) => {
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

    app.post('/getBatchBusySlots', (req, res) => {
        db.collection("LectureSchedule").find({ Year: req.body.Year, Semester: req.body.Semester, BatchID: req.body.BatchID, Day: req.body.Day }).toArray((err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
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
}
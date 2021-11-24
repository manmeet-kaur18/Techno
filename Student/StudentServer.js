module.exports = function () {
    var examIDglobal;
    app.get("/Student_Attendance", (req, res) => {
        res.sendFile(__dirname + "/Student_Attendance.html");
    })
    app.get("/submittedMessage", (req, res) => {
        res.sendFile(__dirname + "/SubmittedMessage.html");
    })
    app.get("/home", (req, res) => {
        res.sendFile(__dirname + "/Student_Timetable.html");
    });

    app.get("/Student_FacultyContactInfo", (req, res) => {
        res.sendFile(__dirname + "/Student_FacultyInformation.html");
    })

    app.get("/Student_ExamInfo", (req, res) => {
        res.sendFile(__dirname + "/Student_ExamInfo.html");
    })

    app.get("/Student_OfflineExamInfo", (req, res) => {
        res.sendFile(__dirname + "/Student_OfflineExamInfo.html");
    })

    app.get("/Student_StudyMaterial", (req, res) => {
        res.sendFile(__dirname + "/Student_ViewNotes.html");
    })

    app.get("/Student_PrevYrPapers", (req, res) => {
        res.sendFile(__dirname + "/Student_PrevYrPapers.html");
    })

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
            db.collection("LectureScheduledHistory").find({ Year: req.body.Year, Semester: req.body.Semester, BatchID: req.body.BatchID, Status: { $in: ["Offline", "Online"] } }).toArray((err, result1) => {
                if (err) {
                    res.send(err);
                }
                var res2 = {};
                for (var x = 0; x < result1.length; x++) {
                    if (result1[0].CourseID in res2) {
                        res2[result1[0].CourseID] += 1;
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


    //checking
    app.post('/getUpcomingExams', (req, res) => {
        db.collection('ExamDetails').find({
            $or: [
                { BatchID: { $in: req.body.BatchID }, CourseID: { $in: req.body.Courselist }, Date: { $gt: req.body.Date }, Semester: req.body.Semester },
                { BatchID: { $in: req.body.BatchID }, CourseID: { $in: req.body.Courselist }, Date: req.body.Date, 'EndTime': { $gt: req.body.time }, Semester: req.body.Semester }
            ]
        }).sort({ 'Date': 1, 'StartTime': 1 }).toArray((err, result) => {
            if (err) {
                res.send(err);
            }
            for(var x=0;x<result.length;x++){
                result[x].Questions = [];
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


    app.post('/getPreviousYearPapers', (req, res) => {
        db.collection("PrevYearPapers").find({ CourseID: req.body.CourseID }).toArray((err, result) => {
            if (err) {
                res.send(err);
            } else {
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


    app.post('/getStudyMaterial', (req, res) => {
        db.collection("LectureNotes").find({ Year: req.body.Year, Semester: req.body.Semester, CourseID: req.body.CourseID }).toArray((err, result) => {
            if (err) {
                res.send(err);
            }
            res.send(result);
        });
    });

    app.post('/uploadPrevYrPaper', upload.single('file'), (req, res) => {
        var data = {
            filename: req.file.filename,
            CourseID: req.body.CourseID,
            description: req.body.description
        }
        db.collection('PrevYearPapers').save(data, (err, result) => {
            if (err) {
                res.send(err);
            }
            res.send([{
                message: "Previous Year Paper Uploaded for the Course",
                status: true
            }]);
        });
    });

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
}
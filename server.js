var settings = require('./setting');
settings.load();

require('./Admin/adminServer')();
require('./Student/StudentServer')();
require('./Faculty/FacultyServer')();


app.get('/uploadAnswers', (req, res) => {
  res.sendFile(__dirname + "/index1.html");
});


app.get('/downloadFile/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    const readstream = gfs.createReadStream(file.filename);
    readstream.pipe(res);
  });
});


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/welcomePage.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login-index.html");
});


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


app.post('/getCoursesTaught', (req, res) => {
  db.collection("CoursesTaughtByFaculty").find({ Year: req.body.Year, Semester: req.body.Semester, FacultyID: facultyIDglobal }).toArray((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});
//Actual Implementation
var dict1={"1":"Monday","2":"Tuesday","3":"Wednesday","4":"Thursday","5":"Friday","6":"Saturday","7":"Sunday"};
const d = new Date();
var hour = d.getHours();
var day = dict1[d.getDay()];
var month = d.getMonth()+1;
var sem = "1";
if(month > 6){
    sem = "2";
}
var todaydate = d.getDate();
var year = d.getFullYear();
var date = todaydate+'-'+month+'-'+year;

//For Testing
// var hour = 8;
// var day = "Monday";
// var year = "2021";
// var sem = "2";
// var date = "15-11-2021";
var stdBatch = "";
var stdSemester = "";

var mintimediff = 6;
var courseID = "No Class within 6 Hours";
var BatchID = "No Class within 6 Hours";
var Semester = "No Class within 6 Hours";
var TimeSlot = "No Class within 6 Hours";
var facultyID = "No Class within 6 Hours";
var location1 = "No Class within 6 Hours";
var zoomlink = "No Class within 6 hours";

$(document).ready(function () {
    maketimetable();
    // getUpcomingClass();
})
var dict1 = {
    "08:00-09:00": 1,
    "09:00-10:00": 2,
    "10:00-11:00": 3,
    "11:00-12:00": 4,
    "12:00-13:00": 5,
    "13:00-14:00": 6,
    "14:00-15:00": 7,
    "15:00-16:00": 8,
    "16:00-17:00": 9,
    "17:00-18:00": 10,
};
var dict2 = {
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
};

function maketimetable() {


    var data = {
        'Year': year
    };
    $.ajax({
        type: "POST",
        url: "/getStudentBatch",
        dataType: "json",
        success: function (msg) {
            if (msg.length > 0) {
                for (var x = 0; x < msg.length; x++) {
                    if ((parseInt(msg[x].Semester) % 2) == parseInt(sem) % 2) {
                        stdBatch = msg[x].BatchID;
                        stdSemester = msg[x].Semester;
                    }
                }
                if (stdBatch != "") {
                    data = {
                        "Year": year,
                        "TeacherSem": sem,
                        "Semester": stdSemester,
                        "BatchID": stdBatch
                    }
                    $.ajax({
                        type: "POST",
                        url: "/getStudentTimeTable",
                        dataType: "json",
                        success: function (msg) {
                            if (msg.length > 0) {
                                for (var x = 0; x < msg.length; x++) {
                                    var span = document.createElement('span');
                                    span.setAttribute('class', 'bg-yellow padding-5px-tb padding-15px-lr border-radius-5 margin-10px-bottom text-white font-size16  xs-font-size13');
                                    span.textContent = msg[x].CourseID;
                                    var div1 = document.createElement('div');
                                    div1.setAttribute('class', 'margin-10px-top font-size14');
                                    div1.textContent = 'Faculty ID : ' + msg[x].FacultyID;
                                    var div2 = document.createElement('div');
                                    div2.textContent = msg[x].FacultyInfo.FacultyName;
                                    var div3 = document.createElement('div');
                                    div3.textContent = msg[x].FacultyInfo.phone;

                                    var parentid = dict1[msg[x].TimeSlot].toString() + dict2[msg[x].Day].toString();
                                    var parentdiv = document.getElementById(parentid);
                                    parentdiv.innerHTML = "";
                                    parentdiv.appendChild(span);
                                    parentdiv.appendChild(div1);
                                    parentdiv.appendChild(div2);
                                    parentdiv.appendChild(div3);
                                }
                                getUpcomingClass();
                            }
                        },
                        data: data
                    });
                }
            }
        },
        data: data,
    })
}

function getUpcomingClass() {
    var data = {
        'day': day,
        'Year': year,
        'TeacherSem': sem,
        'BatchID': stdBatch,
        'Semester': stdSemester
    };
    $.ajax({
        type: "POST",
        url: "/getStudentUpcomingClasses",
        dataType: "json",
        success: function (msg) {
            if (msg.length > 0) {
                for (var x = 0; x < msg.length; x++) {
                    var currhour = parseInt(msg[x].TimeSlot.substring(0, 2));
                    if (currhour > hour && (currhour - hour) < mintimediff) {
                        mintimediff = (currhour - hour);
                        courseID = msg[x].CourseID;
                        BatchID = msg[x].BatchID;
                        Semester = msg[x].Semester;
                        TimeSlot = msg[x].TimeSlot;
                        facultyID = msg[x].FacultyID;
                        location1 = msg[x].Location;
                        zoomlink = msg[x].zoomlink;
                    }
                }
            }
            var h1 = document.createElement('h5');
            h1.textContent = 'Course ID - ' + courseID;
            var h2 = document.createElement('h5');
            h2.textContent = 'Batch ID - ' + BatchID;
            var h3 = document.createElement('h5');
            h3.textContent = 'Semester - ' + Semester;
            var h4 = document.createElement('h5');
            h4.textContent = 'Time Slot - ' + TimeSlot;
            var parent = document.getElementById('upComing');
            var h5 = document.createElement('h5');
            h5.textContent = 'Zoom Link for Online - ' + zoomlink;
            var h6 = document.createElement('h5');
            h6.textContent = 'Location for Offline class - ' + location1;

            parent.appendChild(h1);
            parent.appendChild(h2);
            parent.appendChild(h3);
            parent.appendChild(h4);
            parent.appendChild(h5);
            parent.appendChild(h6);

            if (courseID != "No Class within 6 Hours") {
                var data2 = {
                    'FacultyID': facultyID,
                    'CourseID': courseID,
                    'BatchID': BatchID,
                    'Semester': Semester,
                    'Year': year,
                    'TeacherSem': sem,
                    'Date': date,
                    'TimeSlot': TimeSlot
                };
                $.ajax({
                    type: "POST",
                    url: "/getStatusStdUpCls",
                    dataType: "json",
                    success: function (msg) {
                        if (msg.length == 0) {
                            var h8 = document.createElement('h5');
                            h8.textContent = 'Status - ' + "Not Yet Decided by Faculty";
                            parent.appendChild(h8);
                        }
                        else if (msg.length == 1) {
                            var h8 = document.createElement('h5');
                            h8.textContent = 'Status - ' + msg[0].Status;
                            parent.appendChild(h8);
                        }
                    },
                    data: data2
                });
            }
        },
        data: data
    });
}
document.getElementById('Sem').onchange = function () {
    data = {
        "Year": document.getElementById('year').value,
        "TeacherSem": document.getElementById('Sem').value,
        "Semester": stdSemester,
        "BatchID": stdBatch
    }
    for(var x in dict1){
        for(z in dict2){
            var div1 = document.getElementById(dict1[x].toString()+dict2[z].toString());
            div1.innerHTML = "";
        }
    }
    $.ajax({
        type: "POST",
        url: "/getStudentTimeTable",
        dataType: "json",
        success: function (msg) {
            for (var x = 0; x < msg.length; x++) {
                var span = document.createElement('span');
                span.setAttribute('class', 'bg-yellow padding-5px-tb padding-15px-lr border-radius-5 margin-10px-bottom text-white font-size16  xs-font-size13');
                span.textContent = msg[x].CourseID;
                var div1 = document.createElement('div');
                div1.setAttribute('class', 'margin-10px-top font-size14');
                div1.textContent = 'Faculty ID : ' + msg[x].FacultyID;
                var div2 = document.createElement('div');
                div2.textContent = msg[x].FacultyInfo.FacultyName;
                var div3 = document.createElement('div');
                div3.textContent = msg[x].FacultyInfo.phone;

                var parentid = dict1[msg[x].TimeSlot].toString() + dict2[msg[x].Day].toString();
                var parentdiv = document.getElementById(parentid);
                parentdiv.innerHTML = "";
                parentdiv.appendChild(span);
                parentdiv.appendChild(div1);
                parentdiv.appendChild(div2);
                parentdiv.appendChild(div3);
            }
        },
        data: data
    });
}
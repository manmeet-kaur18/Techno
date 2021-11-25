var d = new Date();
var month = d.getMonth();
month = month + 1;
var sem = "1";
if (month > 6) {
    sem = "2";
}

var date = d.getDate();
var year = d.getFullYear();
var todaydate = date + '-' + month + '-' + year;
var stdBatch = "";
var stdSemester = "";
var h = d.getHours();
var s = d.getMinutes();
var time = "";
if (h < 10) {
    time = "0" + h + ":" + s;
}
else {
    time = h + ":" + s;
}
$(document).ready(function () {

    // var sem = "2";
    // var year = "2021";

    var data1 = {
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

                data2 = {
                    "BatchID": stdBatch,
                    "Semester": stdSemester,
                    "Year": year
                }
                const mySet1 = new Set()
                var courseslist = [];
                $.ajax({
                    type: "POST",
                    url: "/getCoursesforBS",
                    dataType: "json",
                    success: function (msg) {
                        for (var x = 0; x < msg.length; x++) {
                            if (mySet1.has(msg[x].CourseID) == false) {
                                mySet1.add(msg[x].CourseID);
                                courseslist.push(msg[x].CourseID);
                            }
                        }
                        var data3 = {
                            'Date': todaydate,
                            'Courselist': courseslist,
                            'BatchID': [stdBatch],
                            'time': time,
                            'Semester': stdSemester
                        }
                        $.ajax({
                            type: "POST",
                            url: "/getUpcomingExams",
                            dataType: "json",
                            success: function (msg) {
                                var parent1 = document.getElementById('UpcomingExams');
                                parent1.innerHTML = "";
                                for (var x = 0; x < msg.length; x++) {

                                    var li = document.createElement('li');
                                    li.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-start');
                                    var div1 = document.createElement('div');
                                    div1.setAttribute('class', 'ms-2 me-auto');

                                    var div2 = document.createElement('div');
                                    div2.setAttribute('class', 'fw-bold');
                                    div2.textContent = 'Exam Name : ' + msg[x].examName;

                                    var h1 = document.createElement('h8');
                                    var br1 = document.createElement('br');
                                    h1.textContent = 'CourseID - ' + msg[x].CourseID;

                                    var h2 = document.createElement('h8');
                                    var br2 = document.createElement('br');
                                    h2.textContent = "Start Time - " + msg[x].StartTime;

                                    var h3 = document.createElement('h8');
                                    var br3 = document.createElement('br');
                                    h3.textContent = "End Time - " + msg[x].EndTime;

                                    var h4 = document.createElement('h8');
                                    var br4 = document.createElement('br');
                                    h4.textContent = "Date - " + msg[x].Date;

                                    var h5 = document.createElement('h8');
                                    var br5 = document.createElement('br');
                                    h5.textContent = "Total Marks - " + msg[x].TotalMarks;

                                    if (msg[x].Type == "Coding" || msg[x].Type == "MCQ") {
                                        var buttonnew = document.createElement('button');
                                        buttonnew.setAttribute('class', 'btn btn-outline-success');

                                        buttonnew.textContent = "Attempt Now";
                                        if (msg[x].Date == todaydate && msg[x].StartTime < time && msg[x].EndTime > time) {
                                            buttonnew.disabled = false;
                                        }
                                        else {
                                            buttonnew.disabled = true;
                                        }
                                        var str = "AttemptExam('" + msg[x].Type + "','" + msg[x]._id + "')";
                                        buttonnew.setAttribute('onclick', str);
                                    }
                                    else {
                                        var h6 = document.createElement('h8');
                                        var br6 = document.createElement('br');
                                        h6.textContent = "Exam Location - " + msg[x].Location;
                                    }
                                    div1.appendChild(div2);
                                    div1.appendChild(h1);
                                    div1.appendChild(br1);
                                    div1.appendChild(h2);
                                    div1.appendChild(br2);
                                    div1.appendChild(h3);
                                    div1.appendChild(br3);
                                    div1.appendChild(h4);
                                    div1.appendChild(br4);
                                    div1.appendChild(h5);
                                    div1.appendChild(br5);
                                    if (msg[x].Type == "Written") {
                                        div1.appendChild(h6);
                                        div1.appendChild(br6);
                                    }
                                    li.appendChild(div1);
                                    if (msg[x].Type == "MCQ" || msg[x].Type == "Coding") {
                                        li.appendChild(buttonnew);
                                    }
                                    parent1.appendChild(li);
                                }
                            },
                            data: data3
                        });
                    },
                    data: data2
                });
            }
        },
        data: data1
    });
});
function AttemptExam(type, examid) {
    location.href = '/' + type + '/' + examid;
}
document.getElementById('year').onchange = function () {
    var year = document.getElementById('year').value;

    var optiondiv = document.createElement('option');
    optiondiv.textContent = "Open this select menu";
    optiondiv.value = "Open this select menu";
    var parent = document.getElementById('BatchDetail');
    parent.innerHTML = "";
    parent.appendChild(optiondiv);

    var parent1 = document.getElementById('CourseID');

    parent1.innerHTML = "";
    var option1 = document.createElement('option');
    option1.textContent = "Open this select menu";
    option1.value = "Open this select menu";
    parent1.appendChild(option1);

    var parent2 = document.getElementById('Examid');
    parent2.innerHTML = "";
    var option2 = document.createElement('option');
    option2.textContent = "Open this select menu";
    option2.value = "Open this select menu";
    parent2.appendChild(option2);

    var parent3 = document.getElementById('ExamDetail');
    parent3.innerHTML = "";

    if (year != "Open this select menu") {
        var data = {
            'Year': year
        }
        $.ajax({
            type: "POST",
            url: "/getStudentBatch",
            dataType: "json",
            success: function (msg) {
                if (msg.length > 0) {
                    for (var x = 0; x < msg.length; x++) {
                        var optiondiv = document.createElement('option');
                        optiondiv.textContent = msg[x].BatchID + ',' + msg[x].Semester;
                        optiondiv.value = msg[x].BatchID + ',' + msg[x].Semester;
                        parent.appendChild(optiondiv);
                    }
                }
            },
            data: data
        });
    }
}

document.getElementById('BatchDetail').onchange = function () {
    var parent = document.getElementById('CourseID');

    parent.innerHTML = "";
    var optiondiv = document.createElement('option');
    optiondiv.textContent = "Open this select menu";
    optiondiv.value = "Open this select menu";
    parent.appendChild(optiondiv);

    var parent1 = document.getElementById('Examid');
    parent1.innerHTML = "";
    var option = document.createElement('option');
    option.textContent = "Open this select menu";
    option.value = "Open this select menu";
    parent1.appendChild(option);

    var parent2 = document.getElementById('ExamDetail');
    parent2.innerHTML = "";


    if (document.getElementById('BatchDetail').value != "Open this select menu") {
        const mySet1 = new Set()

        data = {
            "BatchID": document.getElementById('BatchDetail').value.split(',')[0],
            "Semester": document.getElementById('BatchDetail').value.split(',')[1],
            'Year': document.getElementById('year').value
        }

        $.ajax({
            type: "POST",
            url: "/getCoursesforBS",
            dataType: "json",
            success: function (msg) {
                for (var x = 0; x < msg.length; x++) {
                    if (mySet1.has(msg[x].CourseID) == false) {
                        var optiondiv = document.createElement('option');
                        optiondiv.value = msg[x].CourseID;
                        optiondiv.textContent = msg[x].CourseID;
                        parent.appendChild(optiondiv);
                        mySet1.add(msg[x].CourseID);
                    }
                }
            },
            data: data
        });
    }
}
var questionlist = {};
document.getElementById('CourseID').onchange = function () {
    
    var parent = document.getElementById('Examid');
    parent.innerHTML = "";

    var optiondiv = document.createElement('option');
    optiondiv.textContent = "Open this select menu";
    optiondiv.value = "Open this select menu";
    parent.appendChild(optiondiv);

    var parent2 = document.getElementById('ExamDetail');
    parent2.innerHTML = "";

    if (document.getElementById('CourseID').value != "Open this select menu") {
        var data = {
            'Date': todaydate,
            'Courselist': [document.getElementById('CourseID').value],
            'BatchID': ["", document.getElementById('BatchDetail').value.split(',')[0]],
            'Semester': document.getElementById('BatchDetail').value.split(',')[1],
            'time': time,
        }
        $.ajax({
            type: "POST",
            url: "/getPastExamDetails",
            dataType: "json",
            success: function (msg) {
                for (var x = 0; x < msg.length; x++) {
                    if (msg[x].Type == "MCQ" || msg[x].Type == "Coding") {
                        var optiondiv = document.createElement('option');
                        optiondiv.value = msg[x]._id;
                        optiondiv.textContent = msg[x].examName;
                        questionlist[msg[x]._id] = { 'Questions': (msg[x].Questions), 'type': msg[x].Type, 'ExamName': msg[x].examName, 'TotalMarks': msg[x].TotalMarks };
                        parent.appendChild(optiondiv);
                    }
                }
            },
            data: data,
        });
    }
}

document.getElementById('Examid').onchange = function () {
    var data = {
        'examid': document.getElementById('Examid').value
    };
    var parent = document.getElementById('ExamDetail');
    parent.innerHTML = "";
    if (document.getElementById('Examid').value != "Open this select menu") {
        $.ajax({
            type: "POST",
            url: "/getStudentAnswers",
            dataType: "json",
            success: function (msg) {
                if (msg.length > 0) {
                    var heading1 = document.createElement('h5');
                    heading1.textContent = "Marks Obtained in the Test - " + msg[0].MarksObtained + "/" + questionlist[data['examid']].TotalMarks;
                    parent.appendChild(heading1);

                    for (var x = 0; x < msg[0].StudentAnswers.length; x++) {
                        var heading = document.createElement('h5');
                        heading.setAttribute('class', 'card-title');
                        heading.textContent = 'Question - ' + (x + 1).toString();
                        var div1 = document.createElement('div');
                        div1.setAttribute('class', 'row g-3');

                        var div2 = document.createElement('div');
                        div2.setAttribute('class', 'col-12');

                        var label1 = document.createElement('label');
                        label1.setAttribute('class', 'form-label');
                        label1.setAttribute('for', "inputNanme4");
                        label1.textContent = questionlist[data['examid']].Questions[x].question;

                        var div5 = document.createElement('div');
                        div5.setAttribute('class', 'col-12');
                        var label4 = document.createElement('label');
                        label4.setAttribute('class', 'form-label');
                        label4.setAttribute('for', "inputNanme4");
                        label4.textContent = 'Marks of this question - ' + questionlist[data['examid']].Questions[x].marks;
                        div5.appendChild(label4);

                        var div6 = document.createElement('div');
                        div6.setAttribute('class', 'col-12');
                        var label5 = document.createElement('label');
                        label5.setAttribute('class', 'form-label');
                        label5.setAttribute('for', "inputNanme4");
                        label5.textContent = 'Your Marks Obtained in this question - ' + msg[0].StudentAnswers[x].marks;
                        div6.appendChild(label5);

                        if (questionlist[data['examid']].type == "MCQ") {
                            var div3 = document.createElement('div');
                            div3.setAttribute('class', 'col-12');


                            var label2 = document.createElement('label');
                            label2.setAttribute('class', 'form-label');
                            label2.setAttribute('for', "inputNanme4");
                            label2.textContent = 'Correct Answer - ' + questionlist[data['examid']].Questions[x].correctAns;
                            div3.appendChild(label2);
                        }

                        var div4 = document.createElement('div');
                        div4.setAttribute('class', 'col-12');

                        var label3 = document.createElement('label');
                        label3.setAttribute('class', 'form-label');
                        label3.setAttribute('for', "inputNanme4");
                        label3.textContent = 'Your answer - ' + msg[0].StudentAnswers[x].Ans;
                        div4.appendChild(label3);

                        div2.appendChild(label1);
                        div2.appendChild(div5);
                        div2.appendChild(div6);
                        if (questionlist[data['examid']].type == "MCQ") {
                            div2.appendChild(div3);
                        }
                        div2.appendChild(div4);
                        div1.appendChild(div2);
                        parent.appendChild(heading);
                        parent.appendChild(div1);

                    }
                }
            },
            data: data
        });
    }
}
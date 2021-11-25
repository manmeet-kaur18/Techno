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
var dict1 = {};

$(document).ready(function () {
    var parent1 = document.getElementById('CheckedSheets');
    var parent2 = document.getElementById('RecheckSheets');

    parent1.innerHTML = "";
    parent2.innerHTML = "";

    $.ajax({
        type: "POST",
        url: "/getStudentsCheckedExams",
        dataType: "json",
        success: function (msg) {
            for (var x = 0; x < msg.length; x++) {
                if (msg[x].status == "checked" || msg[x].status == "recheck") {
                    var li = document.createElement('li');
                    li.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-start');
                    var div1 = document.createElement('div');
                    div1.setAttribute('class', 'ms-2 me-auto');

                    var div2 = document.createElement('div');
                    div2.setAttribute('class', 'fw-bold');
                    div2.textContent = 'Exam Name : ' + msg[x].ExamInfo.examName;

                    var h1 = document.createElement('h8');
                    var br1 = document.createElement('br');
                    h1.textContent = 'CourseID - ' + msg[x].ExamInfo.CourseID;

                    var h2 = document.createElement('h8');
                    var br2 = document.createElement('br');
                    h2.textContent = "Date - " + msg[x].ExamInfo.Date;

                    var h3 = document.createElement('h8');
                    var br3 = document.createElement('br');
                    h3.textContent = "Total Marks - " + msg[x].ExamInfo.TotalMarks;

                    var h4 = document.createElement('h8');
                    var br4 = document.createElement('br');
                    h4.textContent = "Marks You have Obtained - "+msg[x].MarksObtained;

                    if (msg[x].status == "checked") {
                        var buttonnew = document.createElement('button');
                        buttonnew.setAttribute('class', 'btn btn-outline-success');
                        buttonnew.textContent = "View";
                        var str = "ViewExam('" + msg[x].examID + "','" + msg[x].filename + "','" + msg[x].status + "','"+msg[x].MarksObtained+ "','"+msg[x].ExamInfo.TotalMarks+"')";
                        buttonnew.setAttribute('onclick', str);
                        div1.appendChild(div2);
                        div1.appendChild(h1);
                        div1.appendChild(br1);
                        div1.appendChild(h2);
                        div1.appendChild(br2);
                        div1.appendChild(h3);
                        div1.appendChild(br3);
                        div1.appendChild(h4);
                        div1.appendChild(br4);
                        li.appendChild(div1);
                        li.appendChild(buttonnew);
                        parent1.appendChild(li);
                    }
                    else {
                        div1.appendChild(div2);
                        div1.appendChild(h1);
                        div1.appendChild(br1);
                        div1.appendChild(h2);
                        div1.appendChild(br2);
                        div1.appendChild(h3);
                        div1.appendChild(br3);
                        div1.appendChild(h4);
                        div1.appendChild(br4);
                        li.appendChild(div1);
                        parent2.appendChild(li);
                    }
                }
                else if (msg[x].status == "done") {
                    dict1[msg[x].examID] = {'filename':msg[x].filename,'MarksObtained':msg[x].MarksObtained,'TotalMarks':msg[x].ExamInfo.TotalMarks};
                }
            }
        },
    });
});
var x;
function ViewExam(examID, fileName, status, marksOtained,TotalMarks) {
    if (status == "checked") {
        
        var parent = document.getElementById('Review');
        parent.innerHTML = "";
        
        var heading = document.createElement('h5');
        heading.setAttribute('class', 'card-title');
        heading.textContent = "Review Your Checked Answer Sheet";
        parent.appendChild(heading);
        
        var heading1 = document.createElement('h5');
        heading1.setAttribute('class','card-title');
        heading1.textContent = "Your Marks Obtained in this exam "+ marksOtained+"/"+TotalMarks;
        parent.appendChild(heading1);

        var files = fileName.split(',')
        for (var x = 0; x < files.length; x++) {
            var a = document.createElement('a');
            a.href = "/downloadfile/" + files[x];
            a.setAttribute('class', 'link-primary');
            a.textContent = "Click to view Answer Sheet " + x;
            var br = document.createElement('br');
            parent.appendChild(a);
            parent.appendChild(br);
        }

        var br1 = document.createElement('br');
        parent.appendChild(br1);

        var div1 = document.createElement('div');
        div1.setAttribute('class', 'row mb-3');
        var label1 = document.createElement('label');
        label1.for = "inputEmail";
        label1.setAttribute('class', 'col-sm-2 col-form-label')
        label1.textContent = "Message";
        var div2 = document.createElement('div');
        div2.setAttribute('class', 'col-sm-10');
        var input = document.createElement('input');
        input.setAttribute('class', 'form-control');
        input.id = "message";

        div2.appendChild(input);
        div1.appendChild(label1);
        div1.appendChild(div2);
        parent.appendChild(div1);

        var div3 = document.createElement('div');
        div3.setAttribute('class', 'row mb-3');
        var button = document.createElement('button');
        button.setAttribute('class', 'btn btn-outline-success');
        button.textContent = "Recheck";
        var status = "recheck"
        var str = "ChangeStatus('" + examID + "','" + status + "')";
        button.setAttribute('onclick', str);

        var button1 = document.createElement('button');
        button1.setAttribute('class', 'btn btn-outline-success');
        button1.textContent = "Checked";
        var status = "done";
        var str = "ChangeStatus('" + examID + "','" + status + "')";
        button1.setAttribute('onclick', str);
        parent.appendChild(button);
        parent.appendChild(button1);
    }
    else if (status == "done") {
        if (fileName == "") {
            var parent = document.getElementById('ReviewPast');
            parent.innerHTML = "";
            var heading = document.createElement('h5');
            heading.setAttribute('class', 'card-title');
            heading.textContent = "Your Answer Sheet is Under Checking or Rechecking";
            parent.appendChild(heading);
        }
        else {
            var parent = document.getElementById('ReviewPast');
            parent.innerHTML = "";
            var heading = document.createElement('h5');
            heading.setAttribute('class', 'card-title');
            heading.textContent = "Review Your Past Answer Sheets";
            parent.appendChild(heading);
            var heading1 = document.createElement('h5');
            heading1.setAttribute('class','card-title');
            heading1.textContent = "Your Marks Obtained in this exam "+ marksOtained+"/"+TotalMarks;
            parent.appendChild(heading1);

            var files = fileName.split(',')
            for (var x = 0; x < files.length; x++) {
                var a = document.createElement('a');
                a.href = "/downloadfile/" + files[x];
                a.setAttribute('class', 'link-primary');
                a.textContent = "Click to view Answer Sheet " + x;
                var br = document.createElement('br');
                parent.appendChild(a);
                parent.appendChild(br);
            }
        }
    }
}

function ChangeStatus(examID, status) {
    var data = {
        'message': document.getElementById('message').value,
        'examid': examID,
        'status': status
    };
    $.ajax({
        type: "POST",
        url: "/UpdateStatusofAnswerSheet",
        dataType: "json",
        success: function (msg) {
            if (msg.length > 0) {
                location.href = "/Student_OfflineExamInfo"
            }
        },
        data: data
    });
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

    var parent3 = document.getElementById('ReviewPast');
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

    var parent2 = document.getElementById('ReviewPast');
    parent2.innerHTML = "";

    const mySet1 = new Set()
    if (document.getElementById('BatchDetail').value != "Open this select menu") {
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

document.getElementById('CourseID').onchange = function () {
    var parent = document.getElementById('Examid');
    parent.innerHTML = "";
    var optiondiv = document.createElement('option');
    optiondiv.textContent = "Open this select menu";
    optiondiv.value = "Open this select menu";
    parent.appendChild(optiondiv);
    
    var parent2 = document.getElementById('ReviewPast');
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
                    if (msg[x].Type == "Written") {
                        var optiondiv = document.createElement('option');
                        optiondiv.value = msg[x]._id;
                        optiondiv.textContent = msg[x].examName;
                        parent.appendChild(optiondiv);
                    }
                }
            },
            data: data,
        });
    }
}
document.getElementById('Examid').onchange = function () {
    var filename = "";
    if (document.getElementById('Examid').value in dict1) {
        filename = dict1[document.getElementById('Examid').value].filename;
        marksOtained = dict1[document.getElementById('Examid').value].MarksObtained;
        totalMarks = dict1[document.getElementById('Examid').value].TotalMarks; 
        ViewExam(document.getElementById('Examid').value, filename, "done",marksOtained,totalMarks);
    }
    else{
        var parent = document.getElementById('ReviewPast');
        parent.innerHTML = "";
        var heading = document.createElement('h5');
        heading.setAttribute('class', 'card-title');
        heading.textContent = "You were Absent for this Exam";
        parent.appendChild(heading);
    }
}
$(document).ready(function () {
    var parentdiv = document.getElementById('BatchDetail');
    var optiondiv4 = document.createElement('option');
    optiondiv4.value = "Open this Select Menu";
    optiondiv4.textContent = "Open this Select Menu";
    parentdiv.appendChild(optiondiv4);

    $.ajax({
        type: "POST",
        url: "/getStudentBatches",
        dataType: "json",
        success: function (msg) {
            if (msg.length > 0) {
                for (var x = 0; x < msg.length; x++) {
                    var optiondiv = document.createElement('option');
                    optiondiv.value = msg[x].BatchID + ',' + msg[x].Year + ',' + msg[x].Semester;
                    optiondiv.textContent = msg[x].BatchID + ',' + msg[x].Year + ',' + msg[x].Semester;
                    parentdiv.appendChild(optiondiv);
                }
            }
        }
    });
});

document.getElementById('BatchDetail').onchange = function () {
    var parent = document.getElementById('FacultyDetails');
    parent.innerHTML = "";
    var data = {
        'Year': document.getElementById('BatchDetail').value.split(',')[1],
        'BatchID': document.getElementById('BatchDetail').value.split(',')[0],
        'Semester': document.getElementById('BatchDetail').value.split(',')[2]
    }
    mySet1 = new Set();
    $.ajax({
        type: "POST",
        url: "/getAssignedFaculty",
        dataType: "json",
        success: function (msg) {
            for (var x = 0; x < msg.length; x++) {
                if (mySet1.has(msg[x].FacultyID) == false) {
                    var tr = document.createElement('tr');
                    var th = document.createElement('th');
                    var td1 = document.createElement('td');
                    var td2 = document.createElement('td');
                    var td3 = document.createElement('td');
                    var td4 = document.createElement('td');

                    var dict1 = { "1": "Monday", "2": "Tuesday", "3": "Wednesday", "4": "Thursday", "5": "Friday", "6": "Saturday", "7": "Sunday" };

                    th.setAttribute('scope', 'row');
                    th.textContent = msg[x].FacultyID;
                    td1.textContent = msg[x].FacultyInfo.FacultyName;
                    td2.textContent = msg[x].CourseID;
                    td3.textContent = msg[x].FacultyInfo.phone;
                    td4.textContent = msg[x].FacultyInfo.email;

                    tr.appendChild(th);
                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tr.appendChild(td3);
                    tr.appendChild(td4);

                    //Actual
                    var d = new Date();
                    var presentday = dict1[d.getDay()];

                    //Testing
                    // var presentday = "Sunday";
                    var td5 = document.createElement('td');
                    // var td6 = document.createElement('td');
                    var button1 = document.createElement('button');
                    var button2 = document.createElement('button');

                    button1.setAttribute('class', 'btn btn-outline-success');
                    button1.textContent = "Online";
                    str = "sendPreference('" + msg[x].CourseID + "'," + "'1')";
                    button1.setAttribute('onclick', str);
                    if (presentday != "Sunday") {
                        button1.disabled = true;
                    }
                    button2.setAttribute('class', 'btn btn-outline-info');
                    button2.textContent = "Offline";
                    str = "sendPreference('" + msg[x].CourseID + "'," + "'0')";
                    button2.setAttribute('onclick', str);
                    if (presentday != "Sunday") {
                        button2.disabled = true;
                    }
                    td5.appendChild(button1);
                    td5.appendChild(button2);
                    tr.appendChild(td5);

                    var td6 = document.createElement('td');
                    var input = document.createElement('input');
                    input.id = 'Input' + msg[x].FacultyID;
                    input.setAttribute('class', 'form-control');

                    var button3 = document.createElement('button');
                    button3.id = 'Button' + msg[x].FacultyID;
                    button3.setAttribute('class', 'btn btn-outline-primary');
                    button3.textContent = "Ask Doubt";
                    var str = "AskDoubt('" + msg[x].FacultyID + "','" + msg[x].CourseID + "')";
                    button3.setAttribute('onclick', str);

                    td6.appendChild(input);
                    td6.appendChild(button3);

                    tr.appendChild(td6);
                    parent.appendChild(tr);
                    mySet1.add(msg[x].FacultyID);
                }
            }
        },
        data: data
    });
}

//to do - Testing
function sendPreference(CourseID, Online) {
    //to calculate weekno from date Testing - task 
    //var weekno = "46";
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var year = d.getFullYear();
    var todayDate = date + '-' + month + '-' + year;
    // todayDate = "14-11-2021";

    var data = {
        'Year': document.getElementById('BatchDetail').value.split(',')[1],
        'BatchID': document.getElementById('BatchDetail').value.split(',')[0],
        'Semester': document.getElementById('BatchDetail').value.split(',')[2],
        'Online': Online,
        'CourseID': CourseID,
        'Date': todayDate
    };

    $.ajax({
        type: "POST",
        url: "/SaveWeeklyPreference",
        dataType: "json",
        success: function (msg) {
            if (msg[0].status == true) {
                alert("Your Preference Added for " + CourseID);
            }
            if (msg[0].status == false) {
                alert("You have Already given your Preference for this CourseID for this Week and Try Again")
            }
        },
        data: data
    });
}

function AskDoubt(FacultyID, CourseID) {
    var d = new Date();
    var date = d.getDate();
    var month = d.getMonth();
    month = month + 1;
    var year = d.getFullYear();
    var todaydate = date + "-" + month + "-" + year;
    var data = {
        'FacultyID': FacultyID,
        'CourseID': CourseID,
        'doubt': document.getElementById('Input' + FacultyID).value,
        'date': todaydate,
        'status': "0",
    };
    $.ajax({
        type: "POST",
        url: "/SaveDoubt",
        dataType: "json",
        success: function (msg) {
            if (msg[0].status == true) {
                alert("Your doubt has been posted to Faculty ");
            }
        },
        data: data
    });

}
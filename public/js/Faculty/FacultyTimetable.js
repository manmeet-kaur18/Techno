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
    if(month < 10)
    {
        month = '0'+month;
    }
    var todaydate = d.getDate();
    if(todaydate < 10){
        todaydate = '0'+todaydate;
    }
    var year = d.getFullYear();
    var date = todaydate+'-'+month+'-'+year;

    // For Testing
    // var hour = 9;
    // var day = "Monday";
    // var year = "2021";
    // var sem = "2";
    // var date = "15-11-2021";

    var mintimediff = 6;
    var courseID = "No Class within 6 Hours";
    var BatchID = "No Class within 6 Hours";
    var Semester = "No Class within 6 Hours";
    var TimeSlot = "No Class within 6 Hours";
    var location1 = "No Class within 6 hours";
    var zoomlink = "No Class within 6 hours";

    $(document).ready(function () {
        var data = {
            'day': day,
            'Year': year,
            'Sem': sem
        };
        $.ajax({
            type: "POST",
            url: "/getFacultyUpcomingClasses",
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
                var h5 = document.createElement('h5');
                h5.textContent = 'Zoom Link for Online - '+ zoomlink;
                var h6 = document.createElement('h5');
                h6.textContent = 'Location for Offline class - '+ location1;

                var parent = document.getElementById('upComing');

                parent.appendChild(h1);
                parent.appendChild(h2);
                parent.appendChild(h3);
                parent.appendChild(h4);
                parent.appendChild(h5);
                parent.appendChild(h6);

                if (courseID != "No Class within 6 Hours") {
                    var data2 = {
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
                        url: "/getStatusFacultyUpcomingClasses",
                        dataType: "json",
                        success: function (msg) {
                            if (msg.length == 0) {

                                var button1 = document.createElement('button');
                                button1.setAttribute('class', 'btn btn-outline-danger');
                                button1.textContent = "Cancel";
                                button1.setAttribute('onclick', "updateStatus('Cancel')");

                                var button2 = document.createElement('button');
                                button2.setAttribute('class', 'btn btn-outline-success');
                                button2.textContent = "Offline";
                                button2.setAttribute('onclick', "updateStatus('Offline')");

                                var button3 = document.createElement('button');
                                button3.setAttribute('class', 'btn btn-outline-info');
                                button3.setAttribute('onclick', "updateStatus('Online')");
                                button3.textContent = "Online";

                                parent.appendChild(button1);
                                parent.appendChild(button2);
                                parent.appendChild(button3);

                                var data1 = {
                                    'CourseID': courseID,
                                    'BatchID': BatchID,
                                    'Year': year,
                                    'Semester': Semester,
                                }

                                var online = 0;
                                var total = 0;

                                $.ajax({
                                    type: "POST",
                                    url: "/getStudentWeeklyPreference",
                                    dataType: "json",
                                    success: function (msg) {
                                        if (msg.length > 0) {
                                            for (var x = 0; x < msg.length; x++) {
                                                online = online + parseInt(msg[x].Online);
                                                total = total + 1;
                                            }
                                            var h6 = document.createElement('h5');
                                            h6.textContent = 'No of Students preferring Online - ' + (online).toString() + ' Students';
                                            var h7 = document.createElement('h5');
                                            h7.textContent = 'No of Students preferring Offline - ' + (total - online).toString() + ' Students';
                                            parent.appendChild(h6);
                                            parent.appendChild(h7);
                                        }
                                        else{
                                            var h6 = document.createElement('h5');
                                            h6.textContent = 'No of Students in mode Online - 0 Students';
                                            var h7 = document.createElement('h5');
                                            h7.textContent = 'No of Students in mode Offline - 0 Students';
                                            parent.appendChild(h6);
                                            parent.appendChild(h7);
                                        }
                                        getPresentClass();
                                    },
                                    data: data1
                                });
                            }
                            else if (msg.length == 1) {
                                var h8 = document.createElement('h5');
                                h8.textContent = 'Status - ' + msg[0].Status;
                                parent.appendChild(h8);
                                getPresentClass();
                            }
                        },
                        data: data2
                    });
                }
                else{
                    getPresentClass();
                }
            },
            data: data
        });
    });

    var courseid1 = "No class in Current hour";
    var batchid1 = "No class in Current hour";
    var timeslot1 = "No class in Current hour";
    var semester1 = "No class in Current hour";
    var status1 = "No class in Current hour";

    function getPresentClass() {
        var data = {
            'Year': year,
            'Sem': sem,
            'Date': date
        };
        $.ajax({
            type: "POST",
            url: "/getPresentClass",
            dataType: "json",
            success: function (msg) {
                if (msg.length > 0) {
                    for (var x = 0; x < msg.length; x++) {
                        if (hour == parseInt(msg[x].TimeSlot.substring(0, 2)) && msg[x].Status != "Cancel") {
                            courseid1 = msg[x].CourseID;
                            batchid1 = msg[x].BatchID;
                            timeslot1 = msg[x].TimeSlot;
                            semester1 = msg[x].Semester;
                            status1 = msg[x].Status;
                        }
                    }
                    var h1 = document.createElement('h5');
                    h1.textContent = 'Course ID - ' + courseid1;
                    var h2 = document.createElement('h5');
                    h2.textContent = 'Batch ID - ' + batchid1;
                    var h3 = document.createElement('h5');
                    h3.textContent = 'Semester - ' + semester1;
                    var h4 = document.createElement('h5');
                    h4.textContent = 'Time Slot - ' + timeslot1;
                    var parent = document.getElementById('Present');
                    var h5 = document.createElement('h5');
                    h5.textContent = 'Status - ' + status1;

                    parent.appendChild(h1);
                    parent.appendChild(h2);
                    parent.appendChild(h3);
                    parent.appendChild(h4);
                    parent.appendChild(h5);

                    var parent = document.getElementById('Present');
                    if (courseid1 != "No class in Current hour") {
                        var button1 = document.createElement('button');
                        button1.setAttribute('class', 'btn btn-outline-success');
                        button1.setAttribute('onclick', "markAttendance()");
                        button1.textContent = "Mark Attendance"
                        parent.appendChild(button1);
                    }
                }
                else{
                    var h1 = document.createElement('h5');
                    h1.textContent = 'Course ID - ' + courseid1;
                    var h2 = document.createElement('h5');
                    h2.textContent = 'Batch ID - ' + batchid1;
                    var h3 = document.createElement('h5');
                    h3.textContent = 'Semester - ' + semester1;
                    var h4 = document.createElement('h5');
                    h4.textContent = 'Time Slot - ' + timeslot1;
                    var parent = document.getElementById('Present');
                    parent.appendChild(h1);
                    parent.appendChild(h2);
                    parent.appendChild(h3);
                    parent.appendChild(h4);
                }
                
            },
            data: data
        });
    }
    function updateStatus(status) {
        // location.href="/markAttendance";
        var datastatus = {
            'Year': year,
            'CourseID': courseID,
            'BatchID': BatchID,
            'Semester': Semester,
            'TeacherSem': sem,
            'Date': date,
            'TimeSlot': TimeSlot,
            'Status': status
        }
        $.ajax({
            type: "POST",
            url: "/UpdateLecSchHis",
            dataType: "json",
            success: function (msg) {
                if (msg.length > 0) {
                    location.href = "/FacultyTimeTable";
                }
            },
            data: datastatus
        });
    }
    document.getElementById('Sem').onchange = function () {
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

        data = {
            "Year": document.getElementById('year').value,
            "TeacherSem": document.getElementById('Sem').value
        }
        $.ajax({
            type: "POST",
            url: "/getFacultyTimeTable",
            dataType: "json",
            success: function (msg) {
                for (var x = 0; x < msg.length; x++) {
                    var span = document.createElement('span');
                    span.setAttribute('class', 'bg-yellow padding-5px-tb padding-15px-lr border-radius-5 margin-10px-bottom text-white font-size16  xs-font-size13');
                    span.textContent = msg[x].CourseID;
                    var div1 = document.createElement('div');
                    div1.setAttribute('class', 'margin-10px-top font-size14');
                    div1.textContent = 'Batch ID : ' + msg[x].BatchID;
                    var div2 = document.createElement('div');
                    div2.setAttribute('class', 'margin-10px-top font-size14');
                    div2.textContent = 'Semester : ' + msg[x].Semester;
                    var parentid = dict1[msg[x].TimeSlot].toString() + dict2[msg[x].Day].toString();
                    var parentdiv = document.getElementById(parentid);
                    parentdiv.innerHTML = "";
                    parentdiv.appendChild(span);
                    parentdiv.appendChild(div1);
                    parentdiv.appendChild(div2);
                }
            },
            data: data
        });
    }
    function markAttendance() {
        location.href = "/markAttendance";
    }
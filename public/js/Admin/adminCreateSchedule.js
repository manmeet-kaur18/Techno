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


$(document).ready(function () {
    var parentdiv = document.getElementById('facultyList');
    var parentdiv1 = document.getElementById('BatchID');
    $.ajax({
        type: "GET",
        url: "/getFacultylist",
        dataType: "json",
        success: function (msg) {
            var optiondiv2 = document.createElement('option');
            optiondiv2.value = "Open this select menu";
            optiondiv2.textContent = "Open this select menu";
            parentdiv.appendChild(optiondiv2);
            for (var x = 0; x < msg.length; x++) {
                var optiondiv = document.createElement('option');
                optiondiv.value = msg[x].FacultyID;
                optiondiv.textContent = msg[x].FacultyID + "-" + msg[x].FacultyName;
                parentdiv.appendChild(optiondiv);
            }
            var optiondiv1 = document.createElement('option');
            optiondiv1.value = "Open this select menu";
            optiondiv1.textContent = "Open this select menu";
            parentdiv1.appendChild(optiondiv1);
            $.ajax({
                type: "GET",
                url: "/getBatchlist",
                dataType: "json",
                success: function (msg) {
                    for (var x = 0; x < msg.length; x++) {
                        var optiondiv = document.createElement('option');
                        optiondiv.value = msg[x].BatchID + '-' + msg[x].Semester;
                        optiondiv.textContent = msg[x].BatchID + '-' + msg[x].Semester;
                        parentdiv1.appendChild(optiondiv);
                    }
                }
            });
        }
    });
});

document.getElementById('year').onchange = function () {
    for (var x in dict1) {
        for (var y in dict2) {
            var div = document.getElementById(dict1[x].toString() + dict2[y].toString());
            div.innerHTML = "";
        }
    }
    var parent1 = document.getElementById('CourseID');
    parent1.innerHTML = "";
    var parent2 = document.getElementById('TimeSlot');
    parent2.innerHTML = "";
    var parent3 = document.getElementById('BatchID');
    parent3.value = "Open this select menu";
    //parent3.textContent = "Open this select menu";

    var parent4 = document.getElementById('Day');
    parent4.value = "Open this select menu";

    var parent5 = document.getElementById('facultyList');
    parent5.value = "Open this select menu";

    var parent6 = document.getElementById('Sem');
    parent6.value = "Open this select menu";
    //parent4.textContent = "Open this select menu";
}

document.getElementById('Sem').onchange = function(){
    for (var x in dict1) {
        for (var y in dict2) {
            var div = document.getElementById(dict1[x].toString() + dict2[y].toString());
            div.innerHTML = "";
        }
    }
    var parent1 = document.getElementById('CourseID');
    parent1.innerHTML = "";
    var parent2 = document.getElementById('TimeSlot');
    parent2.innerHTML = "";
    var parent3 = document.getElementById('BatchID');
    parent3.value = "Open this select menu";
    //parent3.textContent = "Open this select menu";

    var parent4 = document.getElementById('Day');
    parent4.value = "Open this select menu";

    var parent5 = document.getElementById('facultyList');
    parent5.value = "Open this select menu";
}

document.getElementById('facultyList').onchange = function () {

    data = {
        "FacultyID": document.getElementById('facultyList').value,
        "Year": document.getElementById('year').value,
        "TeacherSem": document.getElementById('Sem').value
    }

    var parent1 = document.getElementById('CourseID');
    parent1.innerHTML = "";
    var parent2 = document.getElementById('TimeSlot');
    parent2.innerHTML = "";
    var parent3 = document.getElementById('BatchID');
    parent3.value = "Open this select menu";
    
    var parent4 = document.getElementById('Day');
    parent4.value = "Open this select menu";

    for (var x in dict1) {
        for (var y in dict2) {
            var div = document.getElementById(dict1[x].toString() + dict2[y].toString());
            div.innerHTML = "";
        }
    }

    var parent1 = document.getElementById('CourseID');
    parent1.innerHTML = "";
    var parent2 = document.getElementById('TimeSlot');
    parent2.innerHTML = "";
    $.ajax({
        type: "POST",
        url: "/getFacultyAssignedSlots",
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
                parentdiv.innerHTML = ""; //new code added
                parentdiv.appendChild(span);
                parentdiv.appendChild(div1);
                parentdiv.appendChild(div2);
            }
        },
        data: data
    });
}

document.getElementById('CourseID').onchange = function () {
    var parent = document.getElementById('Day');
    parent.value = "Open this select menu";
    var parent2 = document.getElementById('TimeSlot');
    parent2.innerHTML = "";
}

//showing only those courses which are intersection of Offered under (sem,branch and Year) and teachers offered courses 
document.getElementById('BatchID').onchange = function () {
    var parent2 = document.getElementById('TimeSlot');
    parent2.innerHTML = "";
    var parent4 = document.getElementById('Day');
    parent4.value = "Open this select menu";

    if (document.getElementById('BatchID').value != "Open this select menu") {
        data = {
            "FacultyID": document.getElementById('facultyList').value,
            "Year": document.getElementById('year').value,
            "Semester": document.getElementById('Sem').value,
        }
        data1 = {
            "BatchID": document.getElementById('BatchID').value.split('-')[0],
            "Semester": document.getElementById('BatchID').value.split('-')[1],
            "Year": document.getElementById('year').value
        }
        var parent = document.getElementById('CourseID');

        const mySet1 = new Set()
        $.ajax({
            type: "POST",
            url: "/getCoursesforBS",
            dataType: "json",
            success: function (msg) {
                for (var x = 0; x < msg.length; x++) {
                    if (mySet1.has(msg[x].CourseID) == false) {
                        mySet1.add(msg[x].CourseID);
                    }
                }
                $.ajax({
                    type: "POST",
                    url: "/getCoursesTaughtByFaculty",
                    dataType: "json",
                    success: function (msg) {
                        parent.innerHTML = "";
                        var optiondiv2 = document.createElement('option');
                        optiondiv2.value = "Open this select menu";
                        optiondiv2.textContent = "Open this select menu";
                        parent.appendChild(optiondiv2);
                        for (var x = 0; x < msg.length; x++) {
                            if (mySet1.has(msg[x].CourseID) == true) {
                                var optiondiv = document.createElement('option');
                                optiondiv.value = msg[x].CourseID;
                                optiondiv.textContent = msg[x].CourseID;
                                parent.appendChild(optiondiv);
                            }
                        }
                    },
                    data: data
                });
            },
            data: data1
        });
    }
}
document.getElementById('Day').onchange = function () {

    var parent = document.getElementById('TimeSlot');
    parent.innerHTML = "";
    if (document.getElementById('Day').value != "Open this select menu") {
        data = {
            "FacultyID": document.getElementById('facultyList').value,
            "Year": document.getElementById('year').value,
            "TeacherSem": document.getElementById('Sem').value,
            "Day": document.getElementById('Day').value,
        }
        data1 = {
            "BatchID": document.getElementById('BatchID').value.split('-')[0],
            "Semester": document.getElementById('BatchID').value.split('-')[1],
            "Year": document.getElementById('year').value,
            "Day": document.getElementById('Day').value,
        }
        var set1 = new Set(["08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00"]);
        $.ajax({
            type: "POST",
            url: "/getFacultyBusySlots",
            dataType: "json",
            success: function (msg) {
                for (var x = 0; x < msg.length; x++) {
                    if (set1.has(msg[x].TimeSlot)) {
                        set1.delete(msg[x].TimeSlot);
                    }
                }
                $.ajax({
                    type: "POST",
                    url: "/getBatchBusySlots",
                    dataType: "json",
                    success: function (msg) {
                        for (var x = 0; x < msg.length; x++) {
                            if (set1.has(msg[x].TimeSlot)) {
                                set1.delete(msg[x].TimeSlot);
                            }
                        }
                        parent.innerHTML = "";
                        set1.forEach((key) => {
                            var optiondiv = document.createElement('option');
                            optiondiv.value = key;
                            optiondiv.textContent = key;
                            parent.appendChild(optiondiv);
                        })
                    },
                    data: data1
                });
            },
            data: data
        });
    }
}

const button1 = document.getElementById('RegisterLectureSchedule');
button1.addEventListener('click', function (e) {
    console.log('button was clicked');
    var data = {
        'BatchID': document.getElementById('BatchID').value.split('-')[0],
        'Semester': document.getElementById('BatchID').value.split('-')[1],
        'Year': document.getElementById('year').value,
        'FacultyID': document.getElementById('facultyList').value,
        'TeacherSem': document.getElementById('Sem').value,
        'CourseID': document.getElementById('CourseID').value,
        'TimeSlot': document.getElementById('TimeSlot').value,
        'Day': document.getElementById('Day').value,
        'zoomlink': document.getElementById('zoomlink').value,
        'Location': document.getElementById('location1').value
    }
    $.ajax({
        type: "POST",
        url: "/registerLectureSchedule",
        dataType: "json",
        success: function (msg) {
            if (msg.length > 0) {
                location.href = "/createSchedule";
            }
            else {
                alert("Please Enter a Unique Course ID or Please check your internet Connection and Try Again!");
            }
        },
        data: data
    });
});

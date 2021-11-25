$(document).ready(function () {
    const mySet1 = new Set()
    var parentdiv = document.getElementById('BatchID');
    var optiondiv4 = document.createElement('option');
    optiondiv4.value = "Open this select menu";
    optiondiv4.textContent = "Open this select menu";
    parentdiv.appendChild(optiondiv4);

    $.ajax({
        type: "GET",
        url: "/getBatchlist",
        dataType: "json",
        success: function (msg) {

            for (var x = 0; x < msg.length; x++) {
                if (mySet1.has(msg[x].BatchID) == false) {

                    var optiondiv = document.createElement('option');
                    optiondiv.value = msg[x].BatchID;
                    optiondiv.textContent = msg[x].BatchID;
                    parentdiv.appendChild(optiondiv);
                    
                    mySet1.add(msg[x].BatchID);

                    // var optiondiv1 = document.createElement('option');
                    // optiondiv1.value = msg[x].BatchID;
                    // optiondiv1.textContent = msg[x].BatchID;
                    // parentdiv1.appendChild(optiondiv1);
                }
            }
            $.ajax({
                type: "GET",
                url: "/getCourseslist",
                dataType: "json",
                success: function (msg) {
                    for (var x = 0; x < msg.length; x++) {
                        var optiondiv = document.createElement('option');
                        optiondiv.value = msg[x].CourseID;
                        optiondiv.textContent = msg[x].CourseID;
                        var parentdiv = document.getElementById('CourseID1');
                        parentdiv.appendChild(optiondiv);
                        
                        var optiondiv1 = document.createElement('option');
                        optiondiv1.value = msg[x].CourseID;
                        optiondiv1.textContent = msg[x].CourseID;
                        var parentdiv1 = document.getElementById('CourseID2');
                        parentdiv1.appendChild(optiondiv1);
                        
                    }
                    $.ajax({
                        type: "GET",
                        url: "/getFacultylist",
                        dataType: "json",
                        success: function (msg) {
                            for (var x = 0; x < msg.length; x++) {
                                var optiondiv = document.createElement('option');
                                optiondiv.value = msg[x].FacultyID;
                                optiondiv.textContent = msg[x].FacultyID+" "+msg[x].FacultyName;
                                var parentdiv = document.getElementById('FacultyID');
                                parentdiv.appendChild(optiondiv);
                            }
                        }
                    });
                }

            });
        }
    });
});

document.getElementById('BatchID').onchange = function () {
    var parent = document.getElementById('Semester');
    const mySet1 = new Set()
    parent.innerHTML = "";
    var e = document.getElementById("BatchID");
    var strUser = e.value;
    data = {
        "BatchID": strUser
    }
    $.ajax({
        type: "POST",
        url: "/getsemester",
        dataType: "json",
        success: function (msg) {
            for (var x = 0; x < msg.length; x++) {
                if (mySet1.has(msg[x].Semester) == false) {
                    var optiondiv = document.createElement('option');
                    optiondiv.value = msg[x].Semester;
                    optiondiv.textContent = msg[x].Semester;
                    parent.appendChild(optiondiv);
                    mySet1.add(msg[x].Semester);
                }
            }
        },
        data: data
    });
}
const button1 = document.getElementById('assignStudentBatch');
button1.addEventListener('click', function (e) {
    console.log('button was clicked');
    var data = {
        'RollNo': document.getElementById('rollNo').value,
        'Year':document.getElementById('year1').value,
        'BatchID': document.getElementById('BatchID').value,
        'Semester': document.getElementById('Semester').value
    } 
    // id there is even entry then odd can only be added if odd entry then even can only be added
    $.ajax({
        type: "POST",
        url: "/assignStudenttoBatch",
        dataType: "json",
        success: function (msg) {
            if (msg[0].status == true) {
                location.href = "/adminHome";
            }
            else{
                alert(msg[0].message);
            }
        },
        data: data
    });
});

const button2 = document.getElementById('batchRegister');
button2.addEventListener('click', function (e) {
    console.log('button was clicked');
    var data = {
        'BatchID': document.getElementById('BatchID1').value,
        'BranchID': document.getElementById('BranchID').value,
        'Semester': document.getElementById('Semester1').value
    }
    $.ajax({
        type: "POST",
        url: "/registerBatch",
        dataType: "json",
        success: function (msg) {
            if (msg.length > 0) {
                location.href = "/adminHome";
            }
            else {
                alert("Please Enter a Unique Batch ID and Semester or Please check your internet Connection and Try Again!");
            }
        },
        data: data
    });
});

const button3 = document.getElementById('CourseRegister');
button3.addEventListener('click', function (e) {
    console.log('button was clicked');
    var data = {
        'CourseID': document.getElementById('CourseID').value,
        'CourseName': document.getElementById('CourseName').value,
        'TotalCredits': document.getElementById('TotalCredits').value
    }
    $.ajax({
        type: "POST",
        url: "/registerCourse",
        dataType: "json",
        success: function (msg) {
            if (msg.length > 0) {
                location.href = "/adminHome";
            }
            else {
                alert("Please Enter a Unique Course ID or Please check your internet Connection and Try Again!");
            }
        },
        data: data
    });
});

const button4 = document.getElementById('addCourse');
button4.addEventListener('click', function (e) {
    console.log('button was clicked');
    
    var data = {
        'BranchID': document.getElementById('BranchID1').value,
        'Semester': document.getElementById('Semester2').value,
        'CourseID': document.getElementById('CourseID1').value,
        'Year':document.getElementById('yearCBS').value
    }
    $.ajax({
        type: "POST",
        url: "/addCoursetoBranch",
        dataType: "json",
        success: function (msg) {
            if (msg.length > 0) {
                location.href = "/adminHome";
            }
            else {
                alert("Please Enter a course that does not already been added to the branch and semester or Please check your internet Connection and Try Again!");
            }
        },
        data: data
    });
});

const button5 = document.getElementById('facultyRegister');
button5.addEventListener('click', function (e) {
    console.log('button was clicked');
    var data = {
        'FacultyName': document.getElementById('facname').value,
        'email': document.getElementById('facemail').value,
        'phone': document.getElementById('facphone').value,
        'password': document.getElementById('facpassword').value
    }
    $.ajax({
        type: "POST",
        url: "/registerFaculty",
        dataType: "json",
        success: function (msg) {
            if (msg.length > 0) {
                location.href = "/adminHome";
            }
            else {
                alert("Please check your internet Connection and Try Again!");
            }
        },
        data: data
    });
});


const button6 = document.getElementById('AssignFacultytoCourse');
button6.addEventListener('click', function (e) {
    console.log('button was clicked');
    var data = {
        'FacultyID': document.getElementById('FacultyID').value,
        'CourseID': document.getElementById('CourseID2').value,
        'Semester': document.getElementById('Semester3').value,
        'Year': document.getElementById('year').value
    }
    $.ajax({
        type: "POST",
        url: "/AssignFaculty",
        dataType: "json",
        success: function (msg) {
            if (msg.length > 0) {
                location.href = "/adminHome";
            }
            else {
                alert("You are trying to assign faculty a semester and course it has already been assigned to or Please check your internet Connection and Try Again!");
            }
        },
        data: data
    });
});

const button7 = document.getElementById('studentRegister');
button7.addEventListener('click', function (e) {
    console.log('button was clicked');
    var data = {
        'RollNo': document.getElementById('rollNo1').value,
        'Email':document.getElementById('email').value,
        'password': document.getElementById('password').value,
        'Phone':document.getElementById('phone').value,
        'Name': document.getElementById('Name').value
    } 
    $.ajax({
        type: "POST",
        url: "/registerStudent",
        dataType: "json",
        success: function (msg) {
            if (msg.length > 0) {
                location.href = "/adminHome";
            }
            else {
                alert("The Roll Number already been assigned to other student or please check your Internet Connection and try again!");
            }
        },
        data: data
    });
});

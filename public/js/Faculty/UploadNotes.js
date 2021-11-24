// const { response } = require("express");

var d = new Date()
var year = d.getFullYear();
var month = d.getMonth() + 1;
var sem = "1";
if (month > 6) {
    sem = "2";
}
$(document).ready(function () {
    data = {
        'Year': year,
        'Semester': sem
    }
    var parent = document.getElementById('CourseID');
    var parent1 =  document.getElementById('CourseID1');

    parent.innerHTML = "";
    parent1.innerHTML="";
    $.ajax({
        type: "POST",
        url: "/getCoursesTaught",
        dataType: "json",
        success: function (msg) {
            parent.innerHTML = "";
            var optiondiv2 = document.createElement('option');
            optiondiv2.value = "Open this Select Menu";
            optiondiv2.textContent = "Open this Select Menu";
            parent.appendChild(optiondiv2);

            var optiondiv1 = document.createElement('option');
            optiondiv1.value = "Open this Select Menu";
            optiondiv1.textContent = "Open this Select Menu";
            parent1.appendChild(optiondiv1);

            for (var x = 0; x < msg.length; x++) {

                var optiondiv = document.createElement('option');
                optiondiv.value = msg[x].CourseID;
                optiondiv.textContent = msg[x].CourseID;
                parent.appendChild(optiondiv);

                var optiondiv3 = document.createElement('option');
                optiondiv3.value = msg[x].CourseID;
                optiondiv3.textContent = msg[x].CourseID;
                parent1.appendChild(optiondiv3);
            }
        },
        data: data
    });
})
var button = document.getElementById('LinkUpload');
button.addEventListener('click',function(){
    var data = {
        'CourseID':document.getElementById('CourseID1').value,
        'link':document.getElementById('link').value,
        'Year':year,
        'Semester':sem,
        'type':"link",
        'filename':"",
        "description":document.getElementById('description1').value
    }
    $.ajax({
        type: "POST",
        url: "/LectureLinkUpload",
        dataType: "json",
        success: function (msg) {
            if(msg.length>0){
                location.href="/Faculty_UploadNotes";
            }
        },
        data:data
    });
})

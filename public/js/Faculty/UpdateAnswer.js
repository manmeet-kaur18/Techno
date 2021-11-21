
document.getElementById('TeacherSem').onchange = function () {
    data={
        'Year':document.getElementById('year').value,
        'Semester':document.getElementById('TeacherSem').value
    }
    var parent = document.getElementById('CourseID');
    parent.innerHTML="";
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
            for (var x = 0; x < msg.length; x++) {
                var optiondiv = document.createElement('option');
                optiondiv.value = msg[x].CourseID;
                optiondiv.textContent = msg[x].CourseID;
                parent.appendChild(optiondiv);
            }
        },
        data: data
    });
}
//DO FROM HERE
document.getElementById('CourseID').onchange = function () {
    data={
        'Year':document.getElementById('year').value,
        'TeacherSem':document.getElementById('TeacherSem').value,
        'CourseID':document.getElementById('CourseID').value
    }
    var parent = document.getElementById('ExamID');
    parent.innerHTML="";
    $.ajax({
        type: "POST",
        url: "/getExamsforUpdate",
        dataType: "json",
        success: function (msg) {
            parent.innerHTML = "";
            var optiondiv2 = document.createElement('option');
            optiondiv2.value = "Open this Select Menu";
            optiondiv2.textContent = "Open this Select Menu";
            parent.appendChild(optiondiv2);
            for (var x = 0; x < msg.length; x++) {
                var optiondiv = document.createElement('option');
                optiondiv.value = msg[x]._id;
                optiondiv.textContent = msg[x].examName;
                parent.appendChild(optiondiv);
            }
        },
        data: data
    });
}

var button = document.getElementById('submit');
button.addEventListener('click',function(e){
    var data = {
        'examid':document.getElementById('ExamID').value,
        'questionid':document.getElementById('questionid').value,
        'correctanswer': document.getElementById('answer').value
    };
    $.ajax({
        type: "POST",
        url: "/UpdateAnwserOnlineExam",
        dataType: "json",
        success:function(msg){
            if(msg.length>0){
                location.href="/UpdateAnwserOnlineExam";
            }
        },
        data:data
    });
})
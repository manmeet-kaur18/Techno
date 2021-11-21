var d= new Date();
var year = d.getFullYear();
var month = d.getMonth();
month = month+1;
var sem = "1";
if(month>6){
    sem="2";
}
$(document).ready(function () {
data = {
    "Year": year,
    "TeacherSem": sem
}
var parent = document.getElementById('ClassDetails');
parent.innerHTML="";
var optiondiv = document.createElement('option');
optiondiv.value = "Open this select menu";
optiondiv.textContent = "Open this select menu";
parent.appendChild(optiondiv);
$.ajax({
    type: "POST",
    url: "/getFacultySchedule",
    dataType: "json",
    success: function (msg) {
        for (var x = 0; x < msg.length; x++) {
            var optiondiv1 = document.createElement('option');
            optiondiv1.value = msg[x].BatchID+','+msg[x].Semester+','+msg[x].CourseID+','+msg[x].TimeSlot+','+msg[x].Day;
            optiondiv1.textContent =msg[x].BatchID+','+msg[x].Semester+','+msg[x].CourseID+','+msg[x].TimeSlot+','+msg[x].Day;
            parent.appendChild(optiondiv1);
        }
    },
    data: data
});
})
var button=document.getElementById('cancel');
button.addEventListener('click',function(){
var data = {
    'Year':year,
    'BatchID':document.getElementById('ClassDetails').value.split(',')[0],
    'Semester':document.getElementById('ClassDetails').value.split(',')[1],
    'CourseID':document.getElementById('ClassDetails').value.split(',')[2],
    'TimeSlot':document.getElementById('ClassDetails').value.split(',')[3],
    'Date':document.getElementById('date').value,
    'TeacherSem':sem,
    'Status':"Cancel"
}
$.ajax({
    type: "POST",
    url: "/CancelLecture",
    dataType: "json",
    success: function (msg) {
        if(msg.length>0){
            alert('The class has been cancelled');
        }
    },
    data:data
})
})

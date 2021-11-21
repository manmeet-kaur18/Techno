$(document).ready(function () {
    var parent = document.getElementById('CourseID');
    var parent1 = document.getElementById('CourseID1');
    
    var optiondiv1 = document.createElement('option');
    optiondiv1.textContent = "Open this select menu";
    optiondiv1.value = "Open this select menu";
    parent.appendChild(optiondiv1);

    var optiondiv2 = document.createElement('option');
    optiondiv2.textContent = "Open this select menu";
    optiondiv2.value = "Open this select menu";
    parent1.appendChild(optiondiv2);

    $.ajax({
        type: "GET",
        url: "/getCourseslist",
        dataType: "json",
        success: function (msg) {
            for (var x = 0; x < msg.length; x++) {
                var optiondiv3 = document.createElement('option');
                optiondiv3.value = msg[x].CourseID;
                optiondiv3.textContent = msg[x].CourseID;
                parent.appendChild(optiondiv3);

                var optiondiv4 = document.createElement('option');
                optiondiv4.value = msg[x].CourseID;
                optiondiv4.textContent = msg[x].CourseID;
                parent1.appendChild(optiondiv4);
            }
        }
    });
})

document.getElementById('CourseID1').onchange=function(){
    data = {
        'CourseID':document.getElementById('CourseID1').value
    }
    var parent = document.getElementById('Details');
    parent.innerHTML = "";
    $.ajax({
        type: "POST",
        url: "/getPreviousYearPapers",
        dataType: "json",
        success: function (msg) {
            for (var x = 0; x < msg.length; x++) {
                var div = document.createElement('div');
                div.setAttribute('class','row mb-3');
                var a = document.createElement('a');
                a.setAttribute('class','link-primary');
                a.textContent = msg[x].description;
                a.href = "/downloadfile/"+msg[x].filename;
                div.appendChild(a);
                parent.appendChild(div);
            }
        },
        data
    });
}
document.getElementById('year').onchange = function () {
    var year = document.getElementById('year').value;
    var optiondiv = document.createElement('option');
    optiondiv.textContent = "Open this select menu";
    optiondiv.value = "Open this select menu";
    var parent = document.getElementById('BatchDetail');
    parent.innerHTML = "";
    parent.appendChild(optiondiv);

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

document.getElementById('BatchDetail').onchange = function () {
    var parent = document.getElementById('CourseID');

    parent.innerHTML = "";
    var optiondiv = document.createElement('option');
    optiondiv.textContent = "Open this select menu";
    optiondiv.value = "Open this select menu";
    parent.appendChild(optiondiv);

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
document.getElementById('CourseID').onchange = function(){
    var semester = "1";
    if(parseInt(document.getElementById('BatchDetail').value.split(',')[1])%2==0)
    {
        semester = "2";
    }
    var data = {
        'CourseID':document.getElementById('CourseID').value,
        'Year':document.getElementById('year').value,
        'Semester':semester
    }
    var parent = document.getElementById('Notes');
    parent.innerHTML = "";
    $.ajax({
        type: "POST",
        url: "/getStudyMaterial",
        dataType: "json",
        success: function (msg) {
            if(msg.length > 0){
                var heading = document.createElement('h5');
                heading.setAttribute('class','card-title');
                heading.textContent="Study Material for "+document.getElementById('CourseID').value;
                parent.appendChild(heading);
                for(var x=0;x<msg.length;x++){
                    var div = document.createElement('div');
                    div.setAttribute('class','row mb-3');
                    var a = document.createElement('a');
                    a.setAttribute('class','link-primary');
                    if(msg[x].type=="link"){
                        a.href = msg[x].link;
                    }
                    else{
                        a.href = "/downloadfile/"+msg[x].filename;
                    }
                    a.textContent = msg[x].description;
                    div.appendChild(a);
                    parent.appendChild(div);
                }
            }
            else{
                var heading = document.createElement('h5');
                heading.setAttribute('class','card-title');
                heading.textContent="No Study Material YeT Available for "+document.getElementById('CourseID').value;
                parent.appendChild(heading);
            }
        },
        data:data
    });     
}
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
            if(msg.length>0){
                for(var x=0;x<msg.length;x++){
                    var optiondiv = document.createElement('option');
                    optiondiv.value = msg[x].BatchID+','+msg[x].Year+','+msg[x].Semester;
                    optiondiv.textContent = msg[x].BatchID+','+msg[x].Year+','+msg[x].Semester;
                    parentdiv.appendChild(optiondiv);
                }
            }
        }
    });
});

document.getElementById('BatchDetail').onchange=function(){
    
    if(document.getElementById('BatchDetail').value != "Open this Select Menu"){
        var parent = document.getElementById('attendance');
        parent.innerHTML="";
        data = {
            'BatchID':document.getElementById('BatchDetail').value.split(',')[0],
            'Year':document.getElementById('BatchDetail').value.split(',')[1],
            'Semester':document.getElementById('BatchDetail').value.split(',')[2]
        };
        $.ajax({
            type: "POST",
            url: "/getStudentAttendance",
            dataType: "json",
            success: function (msg) {
                if(msg.length>0){
                    var count = 0;
                    for(var x in msg[0]){
                        var tr = document.createElement('tr');
                        var th = document.createElement('th');
                        var td1 = document.createElement('td');
                        var td2 = document.createElement('td');
                        var td3 = document.createElement('td');

                        th.setAttribute('scope','row');
                        th.textContent = count;
                        td1.textContent = x;
                        td2.textContent = msg[0][x].Student;
                        td3.textContent = msg[0][x].Teacher;
                        tr.appendChild(th);
                        tr.appendChild(td1);
                        tr.appendChild(td2);
                        tr.appendChild(td3);
                        parent.appendChild(tr);
                        count+=1;
                    }
                }
                console.log(msg);
            },
            data:data
        });
    }
}
document.getElementById('TeacherSem').onchange= function(){
    var data={
        'Year':document.getElementById('year').value,
        'TeacherSem':document.getElementById('TeacherSem').value,
    }
    var parentdiv = document.getElementById('BatchDetail');
    parentdiv.innerHTML="";

    var optiondiv4 = document.createElement('option');
    optiondiv4.value = "Open this Select Menu";
    optiondiv4.textContent = "Open this Select Menu";
    parentdiv.appendChild(optiondiv4);
    mySet1=new Set();
    
    $.ajax({
        type: "POST",
        url: "/getAssignedBatches",
        dataType: "json",
        success: function (msg) {
            for(var x=0;x<msg.length;x++){
                str = msg[x].BatchID+','+msg[x].Semester;
                if(mySet1.has(str)==false){
                    var optiondiv = document.createElement('option');
                    optiondiv.value = msg[x].BatchID+','+msg[x].Semester;
                    optiondiv.textContent = msg[x].BatchID+','+msg[x].Semester;
                    parentdiv.appendChild(optiondiv);
                    mySet1.add(str);
                }
            }
        },
        data:data
    });
}

document.getElementById('BatchDetail').onchange = function(){
    var parent = document.getElementById('StudentDetail');
    parent.innerHTML="";
    var data={
        'Year':document.getElementById('year').value,
        'BatchID':document.getElementById('BatchDetail').value.split(',')[0],
        'Semester':document.getElementById('BatchDetail').value.split(',')[1]
    }

    $.ajax({
        type: "POST",
        url: "/getStudentsofBatch",
        dataType: "json",
        success: function (msg) {
            for(var x=0;x<msg.length;x++){
                var tr = document.createElement('tr');
                var th = document.createElement('th');
                var td1 = document.createElement('td');
                var td2 = document.createElement('td');
                var td3 = document.createElement('td');

                th.setAttribute('scope','row');
                th.textContent = msg[x].RollNo;
                td1.textContent = msg[x].StudentInfoTable.Name;
                td2.textContent = msg[x].StudentInfoTable.Phone;
                td3.textContent = msg[x].StudentInfoTable.Email;

                tr.appendChild(th);
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);

                parent.appendChild(tr);
            }
        },
        data:data
    });
}
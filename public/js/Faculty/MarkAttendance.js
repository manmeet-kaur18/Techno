$(document).ready(function () {
    $.ajax({
        type: "POST",
        url: "/getStudentsofPresentClass",
        dataType: "json",
        success: function (msg) {
            if (msg.length > 0) {
                for(var x=0;x<msg.length;x++){
                    var tr = document.createElement('tr');
                    var th = document.createElement('th');
                    th.setAttribute('scope','row');
                    th.setAttribute('class','align-middle');
                    th.textContent = msg[x].RollNo;

                    var td1 = document.createElement('td');
                    td1.setAttribute('class','align-middle');
                    td1.textContent = msg[x].StudentInfoTable.Name;
                    
                    var td2 = document.createElement('td');
                    td2.setAttribute('class','align-middle');
                    var button = document.createElement('button');
                    button.setAttribute('class','btn btn-outline-success');
                    var str = 'markPresent('+msg[x].RollNo+')';

                    button.setAttribute('onclick',str);
                    button.textContent = "Present";

                    td2.appendChild(button);

                    var parent = document.getElementById('StudentTable');
                    tr.appendChild(th);
                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    parent.appendChild(tr);
                }
            }
        }
    });
});
//tocheck
function markPresent(RollNo){
    var data1={
        'RollNo':RollNo
    }
    $.ajax({
        type: "POST",
        url: "/markPresent",
        dataType: "json",
        success: function (msg) {
            if(msg.length == 0){
                alert("Check Your Internet Connection and Try Again !");
            }
        },
        data:data1
    });
}

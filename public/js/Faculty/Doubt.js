$(document).ready(function () {
    var parent = document.getElementById('Doubts');
    $.ajax({
        type: "POST",
        url: "/getUnsolvedDoubts",
        dataType: "json",
        success: function (msg) {
            if (msg.length > 0) {
                for (var x = 0; x < msg.length; x++) {
                    var li = document.createElement('li');
                    li.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-start');
                    var div1 = document.createElement('div');
                    div1.setAttribute('class', 'ms-2 me-auto');

                    var div2 = document.createElement('div');
                    div2.setAttribute('class', 'fw-bold');
                    div2.textContent = 'Course ID : ' + msg[x].CourseID;

                    var h1 = document.createElement('h8');
                    var br1 = document.createElement('br');
                    h1.textContent = 'Roll No - ' + msg[x].RollNo;

                    var h2 = document.createElement('h8');
                    var br2 = document.createElement('br');
                    h2.textContent = "Doubt - " + msg[x].doubt;

                    var input = document.createElement('input');
                    input.setAttribute('class','form-control');
                    input.id ='Input'+'-'+msg[x]._id;

                    var button = document.createElement('button');
                    button.setAttribute('class','btn btn-outline-success');
                    button.textContent='Send Answer';
                    var str = "ResolveDoubt('"+msg[x]._id+"','"+msg[x].StudentEmail+"')";
                    button.setAttribute('onclick',str);

                    div1.appendChild(div2);
                    div1.appendChild(h1);
                    div1.appendChild(br1);
                    div1.appendChild(h2);
                    div1.appendChild(br2);
                    div1.appendChild(input);
                    div1.appendChild(button);
                    li.appendChild(div1);
                    parent.appendChild(li);
                }
            }
        }
    })
})
function ResolveDoubt(id,Emailid){
    var data = {
        'id':id,
        'email':Emailid,
        'answer':document.getElementById('Input-'+id).value
    }
    $.ajax({
        type: "POST",
        url: "/ResolveDoubt",
        dataType: "json",
        success: function (msg) {
            if(msg.length>0){
                location.href="/Faculty_ResolveDoubts";
            }
        },
        data:data
    })
}
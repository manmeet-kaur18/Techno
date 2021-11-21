
    $(document).ready(function () {
        var parent = document.getElementById('RecheckExams');
        parent.innerHTML = "";
        $.ajax({
            type: "POST",
            url: "/getSheetstoRecheck",
            dataType: "json",
            success: function (msg) {
                for (var x = 0; x < msg.length; x++) {
                    var tr = document.createElement('tr');
                    var th = document.createElement('th');
                    th.setAttribute('class', 'align-middle');
                    var td1 = document.createElement('td');
                    td1.setAttribute('class', 'align-middle');
                    var td2 = document.createElement('td');
                    td2.setAttribute('class', 'align-middle');
                    var td3 = document.createElement('td');
                    td3.setAttribute('class', 'align-middle');
                    var td4 = document.createElement('td');
                    td4.setAttribute('class', 'align-middle');
                    var td5 = document.createElement('td');
                    td5.setAttribute('class', 'align-middle');

                    th.setAttribute('scope', 'row');
                    th.textContent = msg[x].rollNo;
                    td1.textContent = msg[x].message;
                    td2.textContent = msg[x].ExamInfo.examName;
                    td3.textContent = msg[x].ExamInfo.CourseID;
                    td4.textContent = msg[x].MarksObtained;
                    td5.textContent = msg[x].ExamInfo.TotalMarks;

                    tr.appendChild(th);
                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tr.appendChild(td3);
                    tr.appendChild(td4);
                    tr.appendChild(td5);

                    var td6 = document.createElement('td');
                    var button1 = document.createElement('button');

                    button1.setAttribute('class', 'btn btn-outline-success');
                    button1.textContent = "View";
                    str = "ViewExam('" + msg[x].examID + "','" + msg[x].rollNo + "','" + msg[x].filename + "')";
                    button1.setAttribute('onclick', str);

                    td6.appendChild(button1);
                    tr.appendChild(td6);
                    parent.appendChild(tr);
                }
            }
        });
    })

    function ViewExam(examID, studentRollNo, fileName) {
        var parent = document.getElementById('Review');
        parent.innerHTML = "";
        var heading = document.createElement('h5');
        heading.setAttribute('class', 'card-title');
        heading.textContent = "Recheck Students Checked Answer Sheet";
        parent.appendChild(heading);
        var files = fileName.split(',')
        for (var x = 0; x < files.length; x++) {
            var a = document.createElement('a');
            a.href = "/downloadfile/" + files[x];
            a.setAttribute('class', 'link-primary');
            a.textContent = "Click to view Answer Sheet " + x;
            var br = document.createElement('br');
            parent.appendChild(a);
            parent.appendChild(br);
        }

        var br1 = document.createElement('br');
        parent.appendChild(br1);

        var div1 = document.createElement('div');
        div1.setAttribute('class', 'row mb-3');
        var label1 = document.createElement('label');
        label1.for = "inputEmail";
        label1.setAttribute('class', 'col-sm-2 col-form-label')
        label1.textContent = "Marks Obtained if change needed";
        var div2 = document.createElement('div');
        div2.setAttribute('class', 'col-sm-10');
        var input = document.createElement('input');
        input.setAttribute('class', 'form-control');
        input.id = "MarksObtained";

        div2.appendChild(input);
        div1.appendChild(label1);
        div1.appendChild(div2);
        parent.appendChild(div1);

        var div3 = document.createElement('div');
        div3.setAttribute('class', 'row mb-3');
        var button = document.createElement('button');
        button.setAttribute('class', 'btn btn-outline-success');
        button.textContent = "Done";
        var status = "done"
        var str = "ChangeStatus('" + examID + "','" + status + "','" + studentRollNo + "')";
        button.setAttribute('onclick', str);

        div3.appendChild(button);
        parent.appendChild(div3);
    }
    function ChangeStatus(examID, status, studentRollNo) {
        var data = {
            'MarksObtained': document.getElementById('MarksObtained').value,
            'examid': examID,
            'status': status,
            'rollNo': studentRollNo
        };
        $.ajax({
            type: "POST",
            url: "/UpdateMarksStatusRecheck",
            dataType: "json",
            success: function (msg) {
                if (msg.length > 0) {
                    location.href = "/Faculty_RecheckRequests";
                }
            },
            data: data
        });
    }
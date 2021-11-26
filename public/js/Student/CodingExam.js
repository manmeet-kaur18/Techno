var countDownDate = new Date("Jan 5, 2022 15:37:25").getTime();
var totalQuestion;
$(document).ready(function () {
    var parent = document.getElementById('Questions');
    parent.innerHTML = "";
    $.ajax({
        type: "POST",
        url: "/getCodingExamDetails",
        dataType: "json",
        success: function (msg) {
            if (msg.length > 0) {
                var month = msg[0].Date.split('-')[1]
                var date = msg[0].Date.split('-')[2]
                var year = msg[0].Date.split('-')[0]
                totalQuestion = msg[0].Questions.length;
                countDownDate = new Date(month + "-" + date + "-" + year + " " + msg[0].EndTime).getTime();
                var x = setInterval(function () {
                    var now = new Date().getTime();
                    var distance = countDownDate - now;
                    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    document.getElementById("demo").innerHTML = "Time - " + days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
                    if (distance < 0) {
                        clearInterval(x);
                        document.getElementById("demo").innerHTML = "EXPIRED";

                        var buttn = document.getElementById("submit");
                        buttn.disabled = true;
                    }
                }, 1000);
                var div1 = document.createElement('div');
                div1.setAttribute('class', 'col-12');

                for (var x = 0; x < msg[0].Questions.length; x++) {

                    var label1 = document.createElement('div');
                    label1.setAttribute('class', 'form-label');
                    var heading1 = document.createElement('h1');
                    heading1.textContent = "Question " + (x + 1).toString();
                    label1.appendChild(heading1);
                    div1.appendChild(label1);

                    // var br1 = document.createElement('br');
                    // div1.appendChild(br1);

                    var label4 = document.createElement('label');
                    label4.setAttribute('class', 'form-label');
                    label4.textContent = msg[0].Questions[x].question;
                    div1.appendChild(label4);


                    var br2 = document.createElement('br');
                    div1.appendChild(br2);

                    let text = msg[0].Questions[x].stcinput;
                    const myArray = text.split("],[");
                    myArray[0] = myArray[0].replace("[[", "")
                    myArray[myArray.length - 1] = myArray[myArray.length - 1].replace("]]", "");

                    text = msg[0].Questions[x].stcoutput;
                    const myArray1 = text.split("],[");
                    myArray1[0] = myArray1[0].replace("[[", "")
                    myArray1[myArray1.length - 1] = myArray1[myArray1.length - 1].replace("]]", "");

                    for (var y = 0; y < myArray.length; y++) {
                        var divcard = document.createElement('div');
                        divcard.setAttribute('class', 'card');
                        var divcardbody = document.createElement('div');
                        divcardbody.setAttribute('class', 'card-body');

                        var button = document.createElement('button');
                        button.setAttribute('class', 'btn btn-outline-primary');
                        button.textContent = "Test Case " + (y + 1);
                        button.setAttribute('data-bs-toggle', "modal");
                        button.setAttribute('data-bs-target', '#basicModal');

                        var heading2 = document.createElement('h5');
                        heading2.setAttribute('class', 'card-title');
                        heading2.textContent = "Input ";

                        var str = myArray[y].replace(/,/g, '<br>');
                        var p1 = document.createElement('p');
                        p1.innerHTML = str;

                        var heading3 = document.createElement('h5');
                        heading3.setAttribute('class', 'card-title');
                        heading3.textContent = "Output ";

                        var str1 = myArray1[y].replace(/,/g, '<br>');
                        var p2 = document.createElement('p');
                        p2.innerHTML = str1;

                        divcardbody.appendChild(button);
                        divcardbody.appendChild(heading2);
                        divcardbody.appendChild(p1);
                        divcardbody.appendChild(heading3);
                        divcardbody.appendChild(p2);
                        divcard.appendChild(divcardbody);
                        div1.appendChild(divcard);
                    }

                    var divselect = document.createElement('div');
                    divselect.setAttribute('class', 'col-md-4');
                    var label2 = document.createElement('label');
                    label2.setAttribute('class', 'form-label');
                    label2.textContent = "Choose a programming language";
                    divselect.appendChild(label2);

                    var select = document.createElement('select');
                    select.id = "Programming " + (x + 1).toString();
                    select.setAttribute('class', 'form-select');

                    var option1 = document.createElement('option');
                    option1.value = "cpp";
                    option1.textContent = "C++";

                    var option2 = document.createElement('option');
                    option2.value = "c";
                    option2.textContent = "C";

                    var option3 = document.createElement('option');
                    option3.value = "cs";
                    option3.textContent = "C#";

                    var option4 = document.createElement('option');
                    option4.value = "java";
                    option4.textContent = "Java";

                    var option5 = document.createElement('option');
                    option5.value = "py";
                    option5.textContent = "Python";

                    var option6 = document.createElement('option');
                    option6.value = "rb";
                    option6.textContent = "Ruby";

                    var option7 = document.createElement('option');
                    option7.value = "kt";
                    option7.textContent = "Kotlin";

                    var option8 = document.createElement('option');
                    option8.value = "swift";
                    option8.textContent = "Swift";

                    select.appendChild(option1);
                    select.appendChild(option2);
                    select.appendChild(option3);
                    select.appendChild(option4);
                    select.appendChild(option5);
                    select.appendChild(option6);
                    select.appendChild(option7);
                    select.appendChild(option8);
                    divselect.appendChild(select);
                    div1.appendChild(divselect);

                    var textArea = document.createElement('textarea');
                    textArea.setAttribute('class', 'form-control');
                    textArea.id = "answer" + (x + 1);
                    div1.appendChild(textArea);

                    var button1 = document.createElement('button');
                    button1.setAttribute('class', 'btn btn-outline-primary');
                    button1.textContent = "Run Sample TestCases";
                    var t = x + 1;
                    var str = "RunSampleTestCases('" + t + "')";
                    button1.setAttribute('onclick', str);
                    div1.appendChild(button1);

                    var button2 = document.createElement('button');
                    button2.setAttribute('class', 'btn btn-outline-primary');
                    button2.textContent = "Run Test Cases";
                    var t = x + 1;
                    var str = "RunTestCases('" + t + "','" + msg[0].Questions[x].marks + "')";
                    button2.setAttribute('onclick', str);
                    div1.appendChild(button2);

                    var para1 = document.createElement('div');
                    para1.id = "SampleRunResult" + (x + 1);
                    div1.appendChild(para1);

                    var para2 = document.createElement('div');
                    para2.id = "RunResult" + (x + 1);
                    div1.appendChild(para2);
                }
                parent.appendChild(div1);
            }
        },
    })
})

function RunSampleTestCases(questionid) {
    var parent = document.getElementById('SampleRunResult' + questionid);
    parent.innerHTML = "";
    var parent1 = document.getElementById('RunResult' + questionid);
    parent1.innerHTML = "";

    var data = {
        'questionid': questionid,
        'code': document.getElementById('answer' + questionid).value,
        'language': document.getElementById('Programming ' + questionid).value
    }

    var heading = document.createElement('h5');
    heading.setAttribute('class', 'card-title');
    heading.textContent = "Sample Test Case Result";
    parent.appendChild(heading);

    var br1 = document.createElement('br');
    parent.appendChild(br1);

    $.ajax({
        type: "POST",
        url: "/getSampleTestcaseResult",
        dataType: "json",
        success: function (msg) {
            if (msg.length > 0) {
                for (var x = 0; x < msg[0].Testcases.length; x++) {
                    var label = document.createElement('label');
                    label.setAttribute('class', 'form-label');
                    label.textContent = "Test Case " + (x + 1).toString() + " : " + msg[0].Testcases[x].status;
                    var br = document.createElement('br');
                    parent.appendChild(label);
                    parent.appendChild(br);
                }
            }
        },
        data: data
    });
}

function RunTestCases(questionid, marks) {
    var parent = document.getElementById('RunResult' + questionid);
    parent.innerHTML = "";
    var parent1 = document.getElementById('SampleRunResult' + questionid);
    parent1.innerHTML = "";

    var data = {
        'questionid': questionid,
        'code': document.getElementById('answer' + questionid).value,
        'language': document.getElementById('Programming ' + questionid).value,
        'marks': marks
    }

    var heading = document.createElement('h5');
    heading.setAttribute('class', 'card-title');
    heading.textContent = "Test Case Result";
    parent.appendChild(heading);

    var br1 = document.createElement('br');
    parent.appendChild(br1);

    $.ajax({
        type: "POST",
        url: "/getTestcaseResult",
        dataType: "json",
        success: function (msg) {
            parent.innerHTML = "";
            if (msg.length > 0) {
                for (var x = 0; x < msg[0].Testcases.length; x++) {
                    var label = document.createElement('label');
                    label.setAttribute('class', 'form-label');
                    label.textContent = "Test Case " + (x + 1).toString() + " : " + msg[0].Testcases[x].status;
                    var br = document.createElement('br');
                    parent.appendChild(label);
                    parent.appendChild(br);
                }
                var label2 = document.createElement('label');
                label2.id = "MarksObtained" + questionid;
                label2.setAttribute('class', 'form-label');
                label2.textContent = "Your Marks Obtained in this Question  : " + msg[0].marks;
                parent.appendChild(label2);
            }
        },
        data: data
    });
}

var button = document.getElementById('submit');
button.addEventListener('click', function (e) {
    var data = {
        StudentAnswers: []
    };
    var totalmarks = 0;
    for (var x = 0; x < totalQuestion; x++) {
        var quesResp={};
        if(document.getElementById('MarksObtained'+(x+1).toString()) != null || document.getElementById('MarksObtained'+(x+1).toString()) != undefined){
            quesResp = {
                'questionid': (x + 1).toString(),
                'Ans': document.getElementById('answer' + (x + 1).toString()).value,
                'marks': parseInt(document.getElementById('MarksObtained' + (x + 1).toString()).textContent.split(':')[1]).toString()
            };
            totalmarks = totalmarks + parseInt(document.getElementById('MarksObtained'+(x+1).toString()).textContent.split(':')[1]);
        }
        else{
            quesResp = {
                'questionid':(x+1).toString(),
                'Ans': document.getElementById('answer' + (x + 1).toString()).value,
                'marks':"0"
            }
        }
        data.StudentAnswers.push(quesResp);
    }
    data['totalmarks'] = totalmarks.toString();
    $.ajax({
        type: "POST",
        url: "/SubmitTest",
        dataType: "json",
        success: function (msg) {
            if (msg.length > 0) {
                location.href = "/Student_ExamInfo";
            }
        },
        data: data
    });
})
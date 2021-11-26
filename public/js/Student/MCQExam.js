var countDownDate = new Date("Jan 5, 2022 15:37:25").getTime();
var dictQuestions={};
$(document).ready(function () {
    var parent = document.getElementById('Questions');
    parent.innerHTML = "";
    $.ajax({
        type: "POST",
        url: "/getMCQExamDetails",
        dataType: "json",
        success: function (msg) {
            if (msg.length > 0) {
                var month = msg[0].Date.split('-')[1]
                var date = msg[0].Date.split('-')[2]
                var year = msg[0].Date.split('-')[0]
                totalQuestion = msg[0].Questions.length;
                countDownDate = new Date(month+"-"+date+"-"+ year + " " + msg[0].EndTime).getTime();
                var x = setInterval(function () {
                    var now = new Date().getTime();
                    var distance = countDownDate - now;
                    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    document.getElementById("demo").innerHTML = "Time - " + days + "d " + hours + "h "+ minutes + "m " + seconds + "s ";
                    if (distance < 0) {
                        clearInterval(x);
                        document.getElementById("demo").innerHTML = "EXPIRED";
                        var buttn = document.getElementById("submit");
                        buttn.disabled = true;
                    }
                }, 1000);

                for(var x=0;x<msg[0].Questions.length;x++){
                    var questionlabel = document.createElement('label');
                    questionlabel.setAttribute('class','form-label');
                    questionlabel.textContent = "Question "+(x+1).toString()+" : "+msg[0].Questions[x].question;
                    parent.appendChild(questionlabel);
                    
                    var divoptions = document.createElement('div');
                    divoptions.setAttribute('class','col-md-4');
                    
                    var label=document.createElement('label');
                    label.setAttribute('class','form-label');
                    label.textContent="Choose your Answer (There could be Multiple Answers) ";

                    var br = document.createElement('br');
                    divoptions.appendChild(label);
                    divoptions.appendChild(br);

                    
                    var label1=document.createElement('label');
                    label1.setAttribute('class','form-label');
                    label1.textContent="Marks of this Question (0.5 negative for incorrect select) : "+ msg[0].Questions[x].marks;

                    var br1 = document.createElement('br');
                    divoptions.appendChild(label1);
                    divoptions.appendChild(br1);

                    var array = msg[0].Questions[x].anslist.split(',');
                    dictQuestions[x+1]=array;

                    for(var y=0;y<array.length;y++){
                        var divform = document.createElement('div');
                        divform.setAttribute('class','form-check');
                        
                        var input = document.createElement('input');
                        input.setAttribute('class','form-check-input');
                        input.type = "checkbox";
                        input.id = array[y]+'-'+(x+1).toString();

                        var label2 = document.createElement('label');
                        label2.setAttribute('class','form-check-label');
                        label2.textContent = array[y];

                        divform.appendChild(input);
                        divform.appendChild(label2);

                        divoptions.appendChild(divform);
                    }
                    parent.appendChild(divoptions);
                    var br2 = document.createElement('br');
                    parent.appendChild(br2);
                }
            }
        }  
    })
})

var button = document.getElementById('submit');
button.addEventListener('click',function(){
    var data={
        'StudentAnswers':[]
    };

    for(var x in dictQuestions){
        var str="";
        for(var y=0;y<dictQuestions[x].length;y++){
            var t = dictQuestions[x][y]+'-'+x;
            var t1 = document.getElementById(t);
            if(t1.checked){
                str=str+dictQuestions[x][y];
                str=str+',';
            }
        }
        
        str = str.substring(0, str.length - 1);
        var data1={
            questionid:x,
            marks:"0",
            Ans:str
        }
        data.StudentAnswers.push(data1);
    }
    $.ajax({
        type: "POST",
        url: "/SubmitMCQExam",
        dataType: "json",
        success: function (msg) {
            if(msg.length>0){
                location.href="/Student_ExamInfo";
            }
        },
        data:data
    });
})
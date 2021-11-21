var courselistbybranchsem={};

$(document).ready(function () {
     var mySet1 = new Set();
     var parentdiv1 = document.getElementById('BatchID');
     parentdiv1.innerHTML="";
     var optiondiv1 = document.createElement('option');
     optiondiv1.value = "Open this select menu";
     optiondiv1.textContent = "Open this select menu";
     parentdiv1.appendChild(optiondiv1);

     $.ajax({
         type: "POST",
         url: "/getBatches",
         dataType: "json",
         success:function(msg){
             for(var x=0;x<msg.length;x++){               
                 if(mySet1.has(msg[x].BatchID)==false){
                     var optiondiv = document.createElement('option');
                     optiondiv.value = msg[x].BatchID;
                     optiondiv.textContent = msg[x].BatchID;
                     parentdiv1.appendChild(optiondiv);
                     mySet1.add(msg[x].CourseID);
                 }
             }
         },
     });
 });
 document.getElementById('year').onchange = function(){
     var mySet1 = new Set();
     var mySet2 = new Set();

     var parentdiv1 = document.getElementById('CourseID');
     var parentdiv3 = document.getElementById('Semester');
     
     parentdiv1.innerHTML="";
     var optiondiv1 = document.createElement('option');
     optiondiv1.value = "Open this select menu";
     optiondiv1.textContent = "Open this select menu";
     parentdiv1.appendChild(optiondiv1);

     parentdiv3.innerHTML="";
     var optiondiv3 = document.createElement('option');
     optiondiv3.value = "Open this select menu";
     optiondiv3.textContent = "Open this select menu";
     parentdiv3.appendChild(optiondiv3);

     var data = {
         'Year':document.getElementById('year').value
     };
     $.ajax({
             type: "POST",
             url: "/getCoursesOfferedByYear",
             dataType: "json",
             success:function(msg){
                 if(msg.length>0){
                     for(var x=0;x<msg.length;x++){
                         
                         if(mySet1.has(msg[x].CourseID)==false){
                             var optiondiv = document.createElement('option');
                             optiondiv.value = msg[x].CourseID;
                             optiondiv.textContent = msg[x].CourseID;
                             parentdiv1.appendChild(optiondiv);
                             mySet1.add(msg[x].CourseID);
                         }

                         var str = msg[x].BranchID+'-'+msg[x].Semester;
                     if(str in courselistbybranchsem){
                         courselistbybranchsem[msg[x].BranchID+'-'+msg[x].Semester].add(msg[x].CourseID);
                     }
                     else{
                         courselistbybranchsem[str] = new Set();
                         courselistbybranchsem[str].add(msg[x].CourseID);   
                     }

                         if(mySet2.has(msg[x].Semester)==false){
                             var optiondiv2 = document.createElement('option');
                             optiondiv2.value = msg[x].Semester;
                             optiondiv2.textContent = msg[x].Semester;
                             parentdiv3.appendChild(optiondiv2);
                             mySet2.add(msg[x].Semester);
                         }
                     }
                 }
             },
             data:data,
     });
 }
 document.getElementById('Number').oninput=function(){
     var t = document.getElementById('Number').value;
     var parent = document.getElementById('QuestionForm');
     parent.innerHTML = "";

     for(var x=0;x<t;x++){
         
         // question
         var div1 = document.createElement('div');
         div1.setAttribute('class','row mb-3');
         var div2 = document.createElement('label');
         div2.setAttribute('class','col-sm-2 col-form-label');
         div2.textContent = "Question : "+x;
         var div3 = document.createElement('div');
         div3.setAttribute('class','col-sm-10');

         var input = document.createElement('input');
         input.setAttribute("type","text");
         input.setAttribute("class","form-control");
         input.id = "question"+x;
         
         div3.appendChild(input);
         div1.appendChild(div2);
         div1.appendChild(div3);
         parent.appendChild(div1);
         
         //marks
         var div4 = document.createElement('div');
         div4.setAttribute('class','row mb-3');
         var div5 = document.createElement('label');
         div5.setAttribute('class','col-sm-2 col-form-label');
         var div6 = document.createElement('div');
         div6.setAttribute('class','col-sm-10');

         div5.textContent = "Marks of this Question : "+x;
         var input1 = document.createElement('input');
         input1.setAttribute("type","text");
         input1.setAttribute("class","form-control");
         input1.id = "marks"+x;

         div6.appendChild(input1);
         div4.appendChild(div5);
         div4.appendChild(div6);
         parent.appendChild(div4);

         // //ans list
         // var div7 = document.createElement('div');
         // div7.setAttribute('class','row mb-3');
         // var div8 = document.createElement('label');
         // div8.setAttribute('class','col-sm-2 col-form-label');
         // var div9 = document.createElement('div');
         // div9.setAttribute('class','col-sm-10');

         // div8.textContent = "Options of this Question (Comma seperated list) : "+x;
         // var input2 = document.createElement('input');
         // input2.setAttribute("type","text");
         // input2.setAttribute("class","form-control");
         // input2.id = "anslist"+x;

         // div9.appendChild(input2);
         // div7.appendChild(div8);
         // div7.appendChild(div9);
         // parent.appendChild(div7);

         // //CorrectAnswer
         // var div10 = document.createElement('div');
         // div10.setAttribute('class','row mb-3');
         // var div11 = document.createElement('label');
         // div11.setAttribute('class','col-sm-2 col-form-label');
         // div11.textContent = "Correct Answers of Question : "+x;
         // var div12 = document.createElement('div');
         // div12.setAttribute('class','col-sm-10');
         // var input3 = document.createElement('input');
         // input3.setAttribute("type","text");
         // input3.setAttribute("class","form-control");
         // input3.id = "correctAns"+x;

         // div12.appendChild(input3);
         // div10.appendChild(div11);
         // div10.appendChild(div12);
         // parent.appendChild(div10);

     }
 }
 var button = document.getElementById('submit');
 button.addEventListener('click',function (e){
     var questionsinfo = [];
     var t = document.getElementById('Number').value;
     for(var x=0;x<t;x++){
         var d = {};
         d["questionid"]=x+1;
         d["question"]=document.getElementById('question'+x).value;
         d["marks"]=document.getElementById('marks'+x).value;
         questionsinfo.push(d);
     }
     
     var TeacherSem = "1";
     if(parseInt(document.getElementById('Semester').value)%2==0){
         TeacherSem = "2";
     }
     var branchlist = [];
     var batchlist = [];
     branchlist = document.getElementById('BranchDetail').value.split(',');
     batchlist = document.getElementById('BatchID').value.split(',');
     var courseslist = [];
     var set1 = new Set();
     var Semester = document.getElementById('Semester').value;

     for(var x=0;x<branchlist.length;x++){
         courselistbybranchsem[branchlist[x]+'-'+Semester].forEach(a => { 
             if(set1.has(a)==false){
                 set1.add(a);
                 courseslist.push(a);
             }
          })
     }

     var dataarray = [];
     for(var x=0;x<batchlist.length;x++){
     var data = {
         'examName':document.getElementById('examName').value,
         'Year':document.getElementById('year').value,
         'Semester':document.getElementById('Semester').value,
         'Questions':questionsinfo,
         'Type':'Written',
         'TotalMarks':document.getElementById('totalMarks').value,
         'CourseID':document.getElementById('CourseID').value,
         'Date':document.getElementById('date').value,
         'StartTime':document.getElementById('startTime').value,
         'EndTime':document.getElementById('endTime').value,
         'TeacherSem':TeacherSem,
         'Location':document.getElementById('Location').value
     }
         dataarray.push(data);
     }

     var lists ={
         'BatchList':batchlist,
         'CourseList':courseslist,
         'Semester':Semester,
         'Date':document.getElementById('date').value
     } 

     dataarray.push(lists);

     var data1 = {'data':dataarray};

     $.ajax({
             type: "POST",
             url: "/AddExam",
             dataType: "json",
             success: function (msg) {
                 if(msg[0].status==true){
                     location.href="/ScheduleOfflineExam";
                 }      
                 else{
                     alert("You are trying to Allocate a Time in which Exam is Already Scheduled or Please Check Internet Connection and Try Again");
                 }                
             },
             data:data1
         });
         
 })
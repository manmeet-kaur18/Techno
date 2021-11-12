const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

// const button1 = document.getElementById('login');
// button1.addEventListener('click', function (e) {
//   location.href = '/home';

// });


const button = document.getElementById('login');
button.addEventListener('click', function (e) {
  console.log('button was clicked');
  if (document.getElementById('option-1').checked) {
    var data = {
      'role': 'student',
      'RollNo': document.getElementById('id').value,
      'password': document.getElementById('password').value,
    }
  }
  else if (document.getElementById('option-2').checked) {
    var data = {
      'role': 'faculty',
      'FacultyID': document.getElementById('id').value,
      'password': document.getElementById('password').value,
    }
  }
  $.ajax({
    type: "POST",
    url: "/signin",
    dataType: "json",
    success: function (msg) {
      if (msg.length > 0) {
        if(document.getElementById('option-1').checked){
          location.href="/home";
        }
        else{
          location.href="/FacultyTimeTable";
        }
      }
      else {
        alert("Invalid User !");
      }
    },
    data: data
  });
});

const button1 = document.getElementById('adminsignin');
button1.addEventListener('click', function (e) {
  console.log('button was clicked');
  var data = {
    'role': 'admin',
    'adminID': document.getElementById('adminID').value,
    'password': document.getElementById('password1').value,
  }
  $.ajax({
    type: "POST",
    url: "/signin",
    dataType: "json",
    success: function (msg) {
      if (msg.length > 0) {
        location.href="/adminHome";
      }
      else {
        alert("Invalid User !");
      }
    },
    data: data
  });
});
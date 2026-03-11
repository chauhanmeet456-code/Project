function saveStudent(){

let name=document.getElementById("name").value;
let age=document.getElementById("age").value;
let course=document.getElementById("course").value;
let email=document.getElementById("email").value;

let gender=document.querySelector('input[name="gender"]:checked');

let valid=true;

/* Name Validation */

if(name===""){
document.getElementById("nameError").innerText="Name cannot be empty";
valid=false;
}
else{
document.getElementById("nameError").innerText="";
}

/* Email Validation */

let pattern=/^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

if(!email.match(pattern)){
document.getElementById("emailError").innerText="Enter valid email";
valid=false;
}
else{
document.getElementById("emailError").innerText="";
}

if(!gender){
alert("Please select gender");
valid=false;
}

if(!valid){
return;
}

/* Add Row */

let table=document.getElementById("studentTable");

let row=table.insertRow();

row.insertCell(0).innerHTML=name;
row.insertCell(1).innerHTML=age;
row.insertCell(2).innerHTML=course;
row.insertCell(3).innerHTML=gender.value;
row.insertCell(4).innerHTML=email;

let actionCell=row.insertCell(5);

actionCell.innerHTML='<button class="delete-btn" onclick="deleteRow(this)">Delete</button>';

}

/* Delete */

function deleteRow(btn){

let row=btn.parentNode.parentNode;
row.remove();

}
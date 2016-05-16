/**
 * Created by user on 10/04/2016.
 */

var debug = true;

var spacer = "<div class='spacer'>&nbsp;</div>";

var aboutTitle = "What is the IEEE Young Professionals Internship Program?";
var aboutText = "<p>" + "The IEEE Young Professionals Portugal Internships Program is a project by the IEEE Young Professionals " +
"Portugal Affinity Group (YP PT) that enables students, members of IEEE, to take part in short or long " +
"term Internships in engineering roles. These internships can have a duration between 1 to 9 months and " +
"can have a salary for that position." + "</p>" +
"<p>" + "This page gathers the information about an internship offer and the appropriate information and services " +
"for an internship application." + "</p>";

var signinTitle = "Sign in";

var registerTitle = "Register";
var registerText =  "<p>" + "This site is directed to students members of IEEE." + "</p>";
registerText += "<p>" + "What to do if you are a company?" + "</p>";

//MESSAGES
var signinError1 = "Introduce your email and password.";
var signinError2 = "Please, introduce a valid IEEE email.";
var signinError3 = "Email or Password is not correct.";
var registerError1 = "Email already exists.";
var registerError2 = "Mismatched Passwords.";
var signout = "User successfully signed out.";
var deleteUserMessage = "Are you sure you want to delete this user?";
var confirmCancelEditProfile = "If you cancel this operation, all the alterations made will be lost.";

//REGISTER OPTIONS

var registerFields = [
    {id:'inputFirstName', placeholder:'First Name', inputType:'input', type:'text', name:'firstName', required:true},
    {id:'inputLastName', placeholder:'Last Name', inputType:'input', type:'text', name:'lastName', required:true},
    {id:'inputIEEENumber', placeholder:'IEEE Member Number', inputType:'input', type:'number', name:'ieeeNumber', required:true},
    {id:'inputStudentBranch', placeholder:'Student Branch', inputType:'select', type:null, name:'studentBranchId', required:false},
    {id:'inputBirthday', placeholder:'Birthday', inputType:'input', type:'date', name:'birthdate', required:true},
    {id:'inputCity', placeholder:'City', inputType:'select', type:null, name:'cityId', required:false},
    {id:'inputEngineeringDegree', placeholder:'Engineering Degree', inputType:'input', type:'text', name:'area', required:false},
    {id:'inputGraduationYear', placeholder:'Expected Year of Graduation', inputType:'input', type:'number', name:'graduationYear', required:true},
    {id:'inputLinkedIn', placeholder:'LinkedIn Profile', inputType:'input', type:'url', name:'linkedIn', required:false},
    {id:'inputCollabratec', placeholder:'Collabratec Profile', inputType:'input', type:'url', name:'collabratec', required:false},
    {id:'inputBio', placeholder:'Short Bio', inputType:'textarea', form:'formRegister', name:'bio', required:false}
];
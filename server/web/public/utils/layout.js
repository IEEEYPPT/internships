/**
 * Created by user on 10/04/2016.
 */

function initLayout ()
{
    addNavbar();
    addUserInformation();
}

function addNavbar()
{
    $('#navbar-main').append(
        "<div class='navbar navbar-inverse navbar-fixed-top'>" +
            "<div class='container'>" +
                "<div class='navbar-collapse collapse'>" +
                    "<ul class='nav navbar-nav'>" +
                        "<li><a href='http://yp.ieee-pt.org/'>IEEE Young Professionals Portugal</a></li>" +
                    "</ul>" +
                    "<ul class='nav navbar-nav navbar-right'>" +
                        "<li id='linkAbout'><a href='/'> About</a></li>" +
                        "<li id='linkListStudents'><a href='#listStudents'> Students</a></li>" +
                        "<li id='linkListCompanies'><a href='#listCompanies'> Companies</a></li>" +
                        "<li id='linkListInternships'><a href='#listInternships'> Internships</a></li>" +
                    "</ul>" +
                "</div><!--/.nav-collapse -->" +
            "</div>" +
        "</div>"
    );

    var user = checkUserAuthentication();
    if (user == 0)
    {
        $('#linkListStudents').addClass('hidden');
        $('#linkListCompanies').addClass('hidden');
        $('#linkListInternships').addClass('hidden');
    }
    else
    {
        $('#linkListStudents').removeClass('hidden');
        $('#linkListCompanies').removeClass('hidden');
        $('#linkListInternships').removeClass('hidden');
    }
}

function addUserInformation () {

    var user = checkUserAuthentication();

    //clean DIV
    $('#userInformation').empty();

    //add proper information on DIV according with the type of user in the system
    switch (user) {
        case "0": //non-authenticated
            $('#userInformation').append(
                "<div class='spacer'>&nbsp;</div>" +
                    "<a href='/' onclick='addSigninForm();return false;'>Sign in</a> ·  " +
                    "<a href='/student/register' >Register</a>." +
                "<div class='spacer'>&nbsp;</div>"
            );
            break;
        case "1": //student
            $('#userInformation').append(
                "<div class='spacer'>&nbsp;</div>" +
                    "Signed as Student <a href='/student/profile'>" + JSON.parse(sessionStorage.getItem('userData')).firstName + " " + JSON.parse(sessionStorage.getItem('userData')).lastName + "</a>  ·  " +
                    "<a href='/' onclick='signOut()'>Sign out</a>" +
                "<div class='spacer'>&nbsp;</div>"
            );
            break;
        case "2": //company
            $('#userInformation').append(
                "<div class='spacer'>&nbsp;</div>" +
                    "Signed as Company <a href='/company/profile'>user</a>  ·  " +
                "   <a href='/' onclick='signOut()'>Sign out</a>-->" +
                "<div class='spacer'>&nbsp;</div>"
            );
            break;
    }
}

function loadAboutInformation () {
    $('#linkAbout').addClass('active');

    $('#title').append(
        spacer + "<h2>" + aboutTitle + "<\h2>"+ spacer
    );

    $('#container').append(
        spacer + aboutText + spacer
    );
}

function addSigninForm() {
    //remove active class on navbar
    $('#linkAbout').removeClass('active');

    //clean DIVs
    $('#title').empty();
    $('#container').empty();
    $('#alertMessage').empty();

    //add Title
    $('#title').append(
        spacer + "<h2>" + signinTitle + "<\h2>"+ spacer
    );

    //add info
    $('#container').append(
        "<form>" +
            "<div class='form-group'>" +
                "<label for='inputEmail1'>IEEE Email address</label>" +
                "<input type='email' class='form-control' id='inputEmail1' placeholder='Email' required>" +
            "</div>" +
            "<div class='form-group'>" +
                "<label for='inputPassword1'>Password</label>" +
                "<input type='password' class='form-control' id='inputPassword1' placeholder='Password' required>" +
            "</div>" +
            "<button type='submit' class='btn btn-default' onclick='signIn();return false;'>OK</button>" +
        "</form>"
    );
}

function addRegisterForm() {
    //remove active class on navbar
    $('#linkAbout').removeClass('active');

    //clean DIVs
    $('#title').empty();
    $('#container').empty();
    $('#alertMessage').empty();

    //add Title
    $('#title').append(
        spacer + "<h2>" + registerTitle + "<\h2>"+ spacer
    );

    //add info
    $('#container').append(
        "<h4>" + registerText + "<\h4>"+ spacer
    );

    $('#container').append(
        "<form class='form-horizontal' id='preFormRegister'>" +
            "<div class='form-group'>" +
                "<label for='inputEmail1' class='col-sm-2 control-label'>IEEE Email address</label>" +
                "<div class='col-sm-10'>" +
                    "<input type='email' class='form-control' id='inputEmail1' placeholder='Email' required>" +
                "</div>" +                    
            "</div>" +
            "<div class='form-group'>" +
                "<label for='inputPassword1' class='col-sm-2 control-label'>Password</label>" +
                "<div class='col-sm-10'>" +
                    "<input type='password' class='form-control' id='inputPassword1' placeholder='Password' required>" +
                "</div>" +
            "</div>" +
            "<div class='form-group'>" +
                "<label for='inputPassword2' class='col-sm-2 control-label'>Retype Password</label>" +
                "<div class='col-sm-10'>" +                
                    "<input type='password' class='form-control' id='inputPassword2' placeholder='Password' required>" +
                "</div>" +                
            "</div>" +
            "<div class='form-group>" +
                "<div class='col-sm-offset-2 col-sm-10'>" + 
                    "<button class='btn btn-default' type='submit' onclick='validateRegisterEmailPassword();return false;'>OK</button>" +
                "</div>" +
            "</div>" +
        "</form>" +
        "<form class='form-horizontal' id='formRegister' hidden>" +
            "<div class='form-group'>" +
                "<label for='inputEmail2' class='col-sm-2 control-label'>IEEE Email address</label>" +
                "<div class='col-sm-10'>" +
                    "<input type='email' class='form-control' id='inputEmail2' placeholder='Email' name='email' required readonly>" +
                "</div>" +
            "</div>" +
            "<div class='form-group'>" +
                "<label for='inputPassword3' class='col-sm-2 control-label'>Password</label>" +
                "<div class='col-sm-10'>" +
                    "<input type='password' class='form-control' id='inputPassword3' placeholder='Password' name='password' required readonly>" +
                "</div>" + 
            "</div>" +
            "<div class='form-group'>" +
                "<label for='inputFirstName' class='col-sm-2 control-label'>First Name</label>" +
                "<div class='col-sm-10'>" +
                    "<input type='text' class='form-control' id='inputFirstName' placeholder='First Name' name='firstName' required>" +
                "</div>" +
            "</div>" +
            "<div class='form-group'>" +
                "<label for='inputLastName' class='col-sm-2 control-label'>Last Name</label>" +
                "<div class='col-sm-10'>" +
                    "<input type='text' class='form-control' id='inputLastName' placeholder='Last Name' name='lastName' required>" +
                "</div>" +
            "</div>" +
            "<div class='form-group'>" +
                "<label for='inputIEEENumber' class='col-sm-2 control-label'>IEEE Member Number</label>" +
                "<div class='col-sm-10'>" +
                    "<input type='number' class='form-control' id='inputIEEENumber' placeholder='IEEE Member Number' name='ieeeNumber' required>" +
                "</div>" + 
            "</div>" +
            "<div class='form-group'>" +
                "<label for='inputStudentBranch' class='col-sm-2 control-label'>Student Branch</label>" +
                "<div class='col-sm-10'>" +
                    "<select class='form-control' id='inputStudentBranch' placeholder='Student Branch' name='studentBranchId'>" +
                    "</select>" +
                "</div>" +
            "</div>" +
            "<div class='form-group'>" +
                "<label for='inputBirthday' class='col-sm-2 control-label'>Birthday</label>" +
                "<div class='col-sm-10'>" +
                    "<input type='date' class='form-control' id='inputBirthday' placeholder='Birthday' name='birthdate' required>" +
                "</div>" +
            "</div>" +
                    
            "<div class='form-group'>" +
                "<label for='inputCity' class='col-sm-2 control-label'>City</label>" +
                "<div class='col-sm-10'>" +
                    "<select class='form-control' id='inputCity' placeholder='City' name='cityId'>" +
                    "</select>" +
                "</div>" +
            "</div>" +

            "<div class='form-group'>" +
                "<label for='inputEngineeringDegree' class='col-sm-2 control-label'>Engineering Degree</label>" +
                "<div class='col-sm-10'>" +
                    "<input type='text' class='form-control' id='inputEngineeringDegree' placeholder='Engineering Degree' name='area'>" +
                "</div>" +
            "</div>" +

            "<div class='form-group'>" +
                "<label for='inputGraduationYear' class='col-sm-2 control-label'>Expected year of graduation</label>" +
                "<div class='col-sm-10'>" +
                    "<input type='number' class='form-control' id='inputGraduationYear' placeholder='Expected year of graduation' name='graduationYear' required>" +
                "</div>" +
            "</div>" +

            "<div class='form-group'>" +
                "<label for='inputLinkedIn' class='col-sm-2 control-label'>LinkedIn profile</label>" +
                "<div class='col-sm-10'>" +
                    "<input type='url' class='form-control' id='inputLinkedIn' placeholder='LinkedIn profile' name='lindkedIn'>" +
                "</div>" +
            "</div>" +
                    
            "<div class='form-group'>" +
                "<label for='inputCollabratec' class='col-sm-2 control-label'>Collabratec profile</label>" +
                "<div class='col-sm-10'>" +
                    "<input type='url' class='form-control' id='inputCollabratec' placeholder='Collabratec profile' name='collabratec'>" +
                "</div>" +
            "</div>" +

            "<div class='form-group'>" +
                "<label for='inputBio' class='col-sm-2 control-label'>Short Bio</label>" +
                "<div class='col-sm-10'>" +
                    "<textarea class='form-control' id='inputBio' placeholder='Short Bio' form='formRegister' name='bio'></textarea>" +
                "</div>" +
            "</div>" +

            "<div class='form-group'>" +
                "<div class='col-sm-offset-2 col-sm-10'>" +
                    "<button type='button' class='btn btn-default' onclick='cancelRegister();return false;'>Cancel</button>" +
                    "<button type='submit' class='btn btn-default' type='submit'>OK</button>" +
                "</div>" +
            "</div>" +
        "</form>"
    );
}

function addAlertMessage (msg) {
    //add message
    $('#alertMessage').append(
        "<div class='alert alert-danger' role='alert'>" + msg + "</div>"
    );
}

function cleanAlertMessage () {
    $('#alertMessage').empty();
}
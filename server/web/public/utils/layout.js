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
    var user = checkUserAuthentication();

    if (user == 0)
        $('#navbar-main').append(
        "<div class='navbar navbar-inverse navbar-fixed-top'>" +
            "<div class='container'>" +
                "<div class='navbar-collapse collapse'>" +
                    "<ul class='nav navbar-nav'>" +
                        "<li><a href='http://yp.ieee-pt.org/'>IEEE Young Professionals Portugal</a></li>" +
                    "</ul>" +
                    "<ul class='nav navbar-nav navbar-right'>" +
                        "<li><a href='/'> About</a></li>" +
                    "</ul>" +
                "</div><!--/.nav-collapse -->" +
            "</div>" +
        "</div>"
        );
    else
        $('#navbar-main').append(
            "<div class='navbar navbar-inverse navbar-fixed-top'>" +
                "<div class='container'>" +
                    "<div class='navbar-collapse collapse'>" +
                        "<ul class='nav navbar-nav'>" +
                            "<li><a href='http://yp.ieee-pt.org/'>IEEE Young Professionals Portugal</a></li>" +
                        "</ul>" +
                        "<ul class='nav navbar-nav navbar-right'>" +
                            "<li><a href='/'> About</a></li>" +
                            "<li><a href='#listStudents'> Students</a></li>" +
                            "<li><a href='#listCompanies'> Companies</a></li>" +
                            "<li><a href='#listInternships'> Internships</a></li>" +
                        "</ul>" +
                    "</div><!--/.nav-collapse -->" +
                "</div>" +
            "</div>"
        );
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
                    "<a href='/' onclick='addRegisterForm();return false;'>Register</a>." +
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
    $('#title').append(
        spacer + "<h2>" + aboutTitle + "<\h2>"+ spacer
    );

    $('#container').append(
        spacer + aboutText + spacer
    );
}

function addSigninForm() {
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
        "<form>" +
            "<div class='form-group'>" +
                "<label for='inputEmail1'>IEEE Email address</label>" +
                "<input type='email' class='form-control' id='inputEmail1' placeholder='Email' required>" +
            "</div>" +
            "<div class='form-group'>" +
                "<label for='inputPassword1'>Password</label>" +
                "<input type='password' class='form-control' id='inputPassword1' placeholder='Password' required>" +
            "</div>" +
            "<div class='form-group'>" +
                "<label for='inputPassword2'>Retype Password</label>" +
                "<input type='password' class='form-control' id='inputPassword2' placeholder='Password' required>" +
            "</div>" +
            "<button type='submit' class='btn btn-default' onclick='register();return false;'>OK</button>" +
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
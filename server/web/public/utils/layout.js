/**
 * Created by user on 10/04/2016.
 */

function initLayout ()
{
    if (debug)
        console.log("Initiating layout");

    addNavbar();
    addUserInformation();
}

function addNavbar()
{
    if (debug)
        console.log("Adding navbar");

    $('#navbar-main').append(
        "<div class='navbar navbar-inverse navbar-fixed-top'>" +
            "<div class='container'>" +
                "<div class='navbar-collapse collapse'>" +
                    "<ul class='nav navbar-nav'>" +
                        "<li><a href='http://yp.ieee-pt.org/'>IEEE Young Professionals Portugal</a></li>" +
                    "</ul>" +
                    "<ul class='nav navbar-nav navbar-right'>" +
                        "<li id='linkListStudents'><a href='/student/list'>Students</a></li>" +
                        "<li id='linkListCompanies'><a href='/company/list'>Companies</a></li>" +
                        "<li id='linkListInternships'><a href='/internship/list'>Internships</a></li>" +
                        "<li id='linkHome'><a href='/'>Home</a></li>" +
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

function addUserInformation ()
{
    if (debug)
        console.log("Adding user information");

    //clean DIV
    $('#userInformation').empty();


    var user = checkUserAuthentication();
    //add proper information on DIV according with the type of user in the system
    switch (user) {
        case "0": //non-authenticated
            $('#userInformation').append(
                "<div class='spacer'>&nbsp;</div>" +
                    "<a href='/signin'>Sign in</a> ·  " +
                    "<a href='/register' >Register</a>" +
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
                    "<a href='/' onclick='signOut()'>Sign out</a>" +
                "<div class='spacer'>&nbsp;</div>"
            );
            break;
    }
}

function loadAboutInformation () {
    $('#linkHome').addClass('active');

    $('#title').append(
        spacer + "<h2>" + aboutTitle + "<\h2>"+ spacer
    );

    $('#container').append(
        spacer + aboutText + spacer
    );
}

function initSignin() {
    //remove active class on navbar
    $('#linkHome').removeClass('active');

    //clean DIVs
    $('#title').empty();
    $('#alertMessage').empty();

    //add Title
    $('#title').append(
        spacer + "<h2>" + signinTitle + "<\h2>"+ spacer
    );
}

function initRegister() {
    //remove active class on navbar
    $('#linkHome').removeClass('active');

    //clean DIVs
    $('#title').empty();
    $('#alertMessage').empty();

    //add Title
    $('#title').append(
        spacer + "<h2>" + registerTitle + "<\h2>"+ spacer
    );

    //add info
    $('#registerText').append(
        "<h4>" + registerText + "<\h4>"+ spacer
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
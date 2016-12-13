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

/**
 * Sign out operation
 * Removes user rights and data from the session
 */
function signOut() {
    sessionStorage.setItem('user', 0);
    sessionStorage.removeItem('userData');
    addAlertMessage(signout);
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

function createStudentProfileForm ()
{
    var registerForm = "";
    var data = getUserData();

    for (var i=0; i < registerFields.length; i++){
        registerForm += "<div class='form-group'>";
        registerForm += "<label for='"+ registerFields[i].id +"' class='col-sm-3 control-label'>" + registerFields[i].placeholder + "</label>";
        registerForm += "<div class='col-sm-9'>";
        registerForm += "<" + registerFields[i].inputType +
            " class='form-control' id='" + registerFields[i].id +
            "' placeholder='" + registerFields[i].placeholder +
            "' name='" + registerFields[i].name + "'";

        if (registerFields[i].required)
            registerForm += " required";

        switch(registerFields[i].inputType)
        {
            case 'input':
                registerForm += " type='" + registerFields[i].type + "'";
                if(data && data.hasOwnProperty(registerFields[i].name))
                    registerForm += " value='" + data[registerFields[i].name] + "'";
                registerForm += ">";
                break;
            case 'select':
                registerForm += "></select>";
                break;
            case 'textarea':
                registerForm += "form='" + registerFields[i].form + "'>";
                if(data && data.hasOwnProperty(registerFields[i].name))
                    registerForm += data[registerFields[i].name];
                registerForm +="</textarea>";
                break;
        }

        registerForm += "</div></div>";
    }

    loadStudentBranchs();
    loadCities();

    console.log(data);
    return registerForm;
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

function loadStudentBranchs(){
    var data = getUserData();

    $.get('/api/studentbranch',function(reply){
        if(reply.code){
            if(reply.code == "accepted" && reply.msg.constructor === Array){
                for(var i = 0; i < reply.msg.length;i++){
                    $('#inputStudentBranch').append($('<option></option>').val(reply.msg[i].id).html(reply.msg[i].name));
                }

                if(data && data.hasOwnProperty('studentBranchId')) {
                    $('#inputStudentBranch').val(parseInt(data['studentBranchId']));
                    $('#inputStudentBranch').change();
                }
            } else {
                //error handling
            }
        }
    });
}

function loadCities(){
    var data = getUserData();

    $.get('/api/city',function(reply){
        if(reply.code){
            if(reply.code == "accepted" && reply.msg.constructor === Array){
                for(var i = 0; i < reply.msg.length;i++){
                    $('#inputCity').append($('<option></option>').val(reply.msg[i].id).html(reply.msg[i].name));
                }

                if(data && data.hasOwnProperty('cityId')) {
                    $('#inputCity').val(parseInt(data['cityId']));
                    $('#inputCity').change();
                }
            } else {
                //error handling
            }
        }
    });
}
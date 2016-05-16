/**
 * Created by user on 15/05/2016.
 */

//SIGNIN FUNCTIONS

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

function signIn() {
    var email = document.getElementById("inputEmail1").value;
    var password = document.getElementById("inputPassword1").value;

    if(email && password){
        var pattern = new RegExp(/\w+@ieee.org/);

        if(pattern.test(email)){
            $.post('/api/student/login',{email,password},function(reply){
                if(reply.code == 'accepted'){
                    sessionStorage.setItem('user', 1);
                    var userData = {firstName:reply.data.firstName,lastName:reply.data.lastName,birthdate:reply.data.birthdate,graduationYear:reply.data.graduationYear,linkedIn:reply.data.linkedIn,collabratec:reply.data.collabratec,bio:reply.data.bio,area:reply.data.area};
                    sessionStorage.setItem('userData',JSON.stringify(userData));
                    window.location.href = '/';
                } else {
                    cleanAlertMessage();
                    addAlertMessage(signinError3);
                }
            });
        } else {
            cleanAlertMessage();
            addAlertMessage(signinError2);
        }
    } else {
        cleanAlertMessage();
        addAlertMessage(signinError1);
    }
}

//REGISTER FUNCTIONS

function initRegister() {
    //remove active class on navbar
    $('#linkHome').removeClass('active');

    //clean DIVs
    $('#title').empty();
    $('#alertMessage').empty();
    $('#registerText').empty();
    $('#registerData').empty();

    //add Title
    $('#title').append(
        spacer + "<h2>" + registerTitle + "<\h2>"+ spacer
    );

    //add info
    $('#registerText').append(
        "<h4>" + registerText + "<\h4>"+ spacer
    );

    //add register data
    $('#registerData').append(createStudentProfileForm());
}

function validateRegisterEmailPassword() {

    var email = document.getElementById("inputEmail1").value;
    var password = document.getElementById("inputPassword1").value;
    var password2 = document.getElementById("inputPassword2").value;

    if(email && password && password2){
        var pattern = new RegExp(/\w+@ieee.org/);

        if(pattern.test(email)){
            $.post('/api/student/email',{email},function(reply){
                if (password === password2)
                {
                    cleanAlertMessage();
                    $("#userInformation").hide();
                    $("#preFormRegister").hide();
                    $("#formRegister").show();
                    $("#inputPassword3").val($("#inputPassword1").val());
                    $("#inputEmail2").val($("#inputEmail1").val());
                    $( "#inputGraduationYear" ).attr( "min", new Date().getFullYear() );
                    sendRegister();
                }
                else
                {
                    cleanAlertMessage();
                    addAlertMessage(registerError2);
                }
            });
        } else {
            cleanAlertMessage();
            addAlertMessage(signinError2);
        }
    } else {
        cleanAlertMessage();
        addAlertMessage(signinError1);
    }
}

function sendRegister() {
    var form = $('#formRegister');

    form.on('submit', function(e) {
        e.preventDefault();

        var formData = form.serialize();

        $.ajax({
            url: '/api/student',
            type: 'POST',
            dataType: 'json',
            data: formData,
            success: function(reply) {
                if(reply.code && reply.code == 'accepted'){
                    sessionStorage.setItem('user',1);
                    var userData = {
                        firstName:reply.data.firstName,
                        lastName:reply.data.lastName,
                        ieeeNumber:reply.data.ieeeNumber,
                        studentBranchId:reply.data.studentBranchId,
                        birthdate:reply.data.birthdate,
                        city:reply.data.city,
                        area:reply.data.area,
                        graduationYear:reply.data.graduationYear,
                        linkedIn:reply.data.linkedIn,
                        collabratec:reply.data.collabratec,
                        bio:reply.data.bio,
                        };
                    sessionStorage.setItem('userData',JSON.stringify(userData));

                    window.location.href = '/';
                }
            },
            error: function(e) {
                console.log(e)
            }
        });
    });
}

function cancelRegister() {
    var cancel = confirm("By canceling this operation you are removing your register");

    if (cancel){
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('password');
        window.location.href = '/';
    }
}

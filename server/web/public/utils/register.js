/**
 * Created by user on 14/05/2016.
 */

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
                    loadStudentBranchs();
                    loadCities();
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
                    var userData = {firstName:reply.data.firstName,lastName:reply.data.lastName,birthdate:reply.data.birthdate,graduationYear:reply.data.graduationYear,linkedIn:reply.data.linkedIn,collabratec:reply.data.collabratec,bio:reply.data.bio,area:reply.data.area};
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

function loadStudentBranchs(){
    $.get('/api/studentbranch',function(reply){
        if(reply.code){
            if(reply.code == "accepted" && reply.msg.constructor === Array){
                for(i = 0; i < reply.msg.length;i++){
                    $('#inputStudentBranch').append($('<option></option>').val(reply.msg[i].id).html(reply.msg[i].name));
                }
            } else {
                //error handling
            }
        }
    });
}

function loadCities(){
    $.get('/api/city',function(reply){
        if(reply.code){
            if(reply.code == "accepted" && reply.msg.constructor === Array){
                for(i = 0; i < reply.msg.length;i++){
                    $('#inputCity').append($('<option></option>').val(reply.msg[i].id).html(reply.msg[i].name));
                }
            } else {
                //error handling
            }
        }
    });
}
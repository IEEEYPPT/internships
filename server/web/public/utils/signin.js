/**
 * Created by user on 15/05/2016.
 */

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
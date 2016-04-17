/**
 * Created by user on 10/04/2016.
 */

/**
 * Verifies if the user is authenticated and returns the type of user
 * (0) Non-authenticated
 * (1) Student
 * (2) Company
 * @returns {int}
 */
function checkUserAuthentication () {
    if (!sessionStorage.getItem('user')) {
        sessionStorage.setItem('user', 0);
    }
    return sessionStorage.getItem('user');
}

function signIn() {
    //verify if it's an IEEE email
    //if yes then send to DB
    //return result
    
    var email = document.getElementById("inputEmail1").value;
    var password = document.getElementById("inputPassword1").value;
    
    var pattern = new RegExp(/\w+@ieee.org/);
    
    if(pattern.test(email)){
        $.post('/api/student/login',{email,password},function(reply){
            if(reply.code == 'accepted'){
                sessionStorage.setItem('user', 1);
                window.location.href = '/';
            } else {
                //do something fancy to output error
            }
        });
    } else {
        //do something fancy to output error
    }
}
function signOut() {
    //return result
    sessionStorage.setItem('user', 0);
}

function register() {
    //verify if it's an IEEE email
    //verify if IEEE email already exists on DB
    //go to form
    window.location.href = '/student/edit';
}

function cancelRegister() {
    var cancel = confirm("By canceling this operation you are removing your register");

    if (cancel)
        window.location.href = '/';
}
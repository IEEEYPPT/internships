/**
 * Created by user on 15/05/2016.
 */

function deleteUser(){
    var deleteUser = confirm(deleteUserMessage);

    if (deleteUser){
        //TODO deleteUser
        console.log("TODO delete user from DB");
        sessionStorage.setItem('user', 0);
        sessionStorage.removeItem('userData');
        window.location.href = '/';
    }
}

function showStudentProfile() {
    //clean DIV
    $('#container').empty();

    console.log(sessionStorage.getItem('userData'));
}
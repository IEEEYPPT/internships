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

    var data = getUserData();
    console.log(data);
    var txt = "";
    for (var key in data) {
        txt += "<div class='row'><h4>";
        txt += "<div class='col-sm-offset-1 col-sm-4'>";
        txt += getExternalNameFromUserData(key);
        txt += "</div>";
        txt += "<div class='col-sm-6'>";
        txt += "<small>" + data[key] + "</small>";
        txt += "</div>";
        txt += "</h4></div>";
        txt += spacer;
    }
    console.log(txt);
    $('#container').append(txt);
}
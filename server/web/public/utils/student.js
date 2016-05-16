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

function addEditProfileForm ()
{
    $('#editStudentProfile').append(createStudentProfileForm());
}

function sendEditProfileForm() {
    var form = $('#formEditStudentProfile');

    form.on('submit', function(e) {
        e.preventDefault();

        //var formData = form.serialize();

        //TODO talk to server
        window.location.href = '/';
        /*$.ajax({
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
        });*/
    });
}

function cancelProfileEdition() {
    var cancel = confirm(confirmCancelEditProfile);

    if (cancel){
        window.location.href = '/student/profile';
    }
}
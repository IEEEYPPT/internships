/**
 * Created by user on 16/05/2016.
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

function getUserData() {
    return JSON.parse(sessionStorage.getItem('userData'));
}

function getExternalNameFromUserData(name) {
    for (var i=0; i < registerFields.length; i++)
        if (registerFields[i].name === name)
            return registerFields[i].placeholder;
}
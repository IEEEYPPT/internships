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

/**
 * Sign out operation
 * Removes user rights and data from the session
 */
function signOut() {
    sessionStorage.setItem('user', 0);
    sessionStorage.removeItem('userData');
    addAlertMessage(signout);
}


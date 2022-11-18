import React from 'react';
import * as jwt_decode from 'jwt-decode';

class Users extends React.Component {
  getIDToken() {
    const tokenFromStorage = localStorage.getItem("msal.idtoken");
    if (tokenFromStorage)
      return jwt_decode(tokenFromStorage);
  }

  getUserName() {
    const idToken = this.getIDToken();
    if (idToken)
      return idToken.given_name;
  }
  getUserFullName() {
    const idToken = this.getIDToken();
    if (idToken)
      return idToken.given_name + " " + idToken.family_name;
  }
  getUser() {

    return this.getIDToken();
  }
  getUserEmail() {
    const idToken = this.getIDToken();
    if (idToken)
      return idToken.emails[0];
  }

  getAddUser() {
    var modal = {};
    const currentUser = this.getUser();
    if (currentUser) {
      if (currentUser.idp === undefined)
        modal.usertype = 1
      else
        modal.usertype = 0
      modal.upn = currentUser.emails[0];
      modal.firstname = currentUser.given_name;
      modal.lastname = currentUser.family_name;
      modal.emailAddress = currentUser.emails[0];
      modal.countryName = currentUser.country;
      modal.objectId = currentUser.oid;
      modal.desktopUserID = "";
      modal.isActive = true;
      modal.isManager = false
      return modal;
    }

  }
  render() {
    return (
      <div></div>
    )
  }
}
export default Users;

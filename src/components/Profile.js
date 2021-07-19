import React from 'react';
import firebase from '@firebase/app';
import 'firebase/auth';
import '@firebase/firestore';
import { Container} from '@material-ui/core';
import * as CgIcons from 'react-icons/cg';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.iconSize = "80";
    this.currentUser = firebase.auth().currentUser;
  }

  render() {
    return (
      <Container component="main" maxWidth="xs">
        <h1 className="headingOne">Profile Page</h1>
        <div className="content">
          {this.currentUser.photoURL ? <img src={this.currentUser.photoURL} alt={this.currentUser.displayName + '-image'}></img> : <CgIcons.CgProfile size={this.iconSize} style={{ color: "black" }} />}
          <p>uid: <b>{this.currentUser.uid}</b></p>
          <p>Hello <b>{this.currentUser.displayName}</b></p>
          <p><b>Email: </b>{this.currentUser.email}</p>
        </div>
      </Container>
    );
  }
}

export default Profile;

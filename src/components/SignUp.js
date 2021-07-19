import React from 'react';
import '@firebase/firestore';
import firebase from '@firebase/app';
import 'firebase/auth';
import { TextField, Button, CircularProgress, Avatar, Box, Typography } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Container from '@material-ui/core/Container';
import Alerts from './Alerts';
import ChangeLocationButton from './navigation/ChangeLocationButton';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: '',
      email: '',
      password: '',
      loading: false,
      showError: false,
      errorMsg: [],
    };
    this.signUpWithEmailPassword = this.signUpWithEmailPassword.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  async signUpWithEmailPassword(e) {
    this.db = firebase.firestore();
    e.preventDefault();
    this.setState({ loading: true });
    await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((userCredential) => {

        // cant change users display name when creating the account, but will be added on next login
        let user = firebase.auth().currentUser;
        user.updateProfile({
          displayName: this.state.displayName
        });
        // sign up, add new user to a collection with their user id
        return this.db.collection('user').doc(userCredential.user.uid).set({ uid: userCredential.user.uid, name: this.state.displayName, currentRoom: "", isRoomOwner: false, roomOwnerId: "" });
      }).catch((error) => {
        this.setState({ errorMsg: error, showError: true });
      });
    this.setState({ displayName: '', email: '', password: '', loading: false });
  }

  render() {
    return (
      <Container
        style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
        component="main" maxWidth="sm">
        <div className="gradient-border">
          <div style={{ padding: "20px", marginTop: "8px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
              {this.state.showError ? <Alerts type="error" msg={this.state.errorMsg.message} /> : null}
              <Avatar style={{ margin: "5px" }} >
                <LockOutlinedIcon />
              </Avatar>
              <Typography data-testid="sign-up-title" component="h1" variant="h5">
                Register
      </Typography>
            </div>
            <form style={{ width: "100%", marginTop: "1px" }} onSubmit={this.signUpWithEmailPassword} noValidate>
              <TextField
                data-testid="sign-in-displayname-field"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Display Name"
                name="displayName"
                autoComplete="displayName"
                // autoFocus
                value={this.state.displayName}
                onChange={this.handleChange}
              />
              <TextField
                data-testid="sign-in-email-field"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Email Address"
                name="email"
                autoComplete="email"
                value={this.state.email}
                onChange={this.handleChange}
              />
              <TextField
                data-testid="sign-in-password-field"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                value={this.state.password}
                onChange={this.handleChange}
              />
              <div style={{ marginTop: "10px", textAlign: "center" }}>
                {this.state.loading ? <CircularProgress /> :
                  <Button
                    data-testid="sign-up-register-button"
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={{ margin: "3px 0px 2px" }}
                  >
                    Register
                </Button>}
              </div>
            </form>
            <Box mt={8}>
              <ChangeLocationButton location={"/"} text={"Already have an account? Login Here"}/>
            </Box>
          </div>
        </div>
      </Container>
    );
  }
}

export default SignUp;

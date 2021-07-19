import React from 'react';
import firebase from '@firebase/app';
import 'firebase/auth';
import '@firebase/firestore';
import { TextField, Button, CircularProgress, Avatar, Grid, Box, Typography } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Container from '@material-ui/core/Container';
import * as FcIcons from 'react-icons/fc';
import * as FaIcons from 'react-icons/fa';
import './Border.scss';
import Alerts from './Alerts';
import ChangeLocationButton from './navigation/ChangeLocationButton';

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loading: false,
      showError: false,
      errorMsg: [],
    }

    this.handleChange = this.handleChange.bind(this);
    this.signInWithEmailPassword = this.signInWithEmailPassword.bind(this);
    this.signInWithGoogle = this.signInWithGoogle.bind(this);
    this.signInAnonymously = this.signInAnonymously.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  async signInWithEmailPassword(e) {
    e.preventDefault();
    this.setState({ loading: true });
    await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((userCredential) => {
        // Signed in 
        console.log(userCredential.user);
      })
      .catch((error) => {
        this.setState({ errorMsg: error, showError: true });
      });
    // reset sign in input fields and closed sign in form
    this.setState({ email: '', password: '', showSignIn: false, loading: false });
  }

  async checkIfGoogleUserExists(googleUser) {
    this.db = firebase.firestore();
    await this.db.collection('user').doc(googleUser.user.uid).get()
      .then(doc => {
        if (doc.exists) {
          console.log('Document data:', doc.data());
        } else {
          console.log('No such document!');
          // sign in with google, add new user to a collection with their user id
          return this.db.collection('user').doc(googleUser.user.uid).set({ uid: googleUser.user.uid, name: googleUser.user.displayName, currentRoom: "", isRoomOwner: false, roomOwnerId: "" });
        }
      })
      .catch((error) => {
        this.setState({ errorMsg: error, showError: true });
      });
  }

  async signInWithGoogle(e) {
    let googleUser;
    e.preventDefault();
    this.setState({ loading: true });
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithPopup(googleAuthProvider)
      .then((userCredential => {
        googleUser = userCredential;
      }));
    await this.checkIfGoogleUserExists(googleUser);
    this.setState({ loading: false });
  }

  async signInAnonymously() {
    this.setState({ loading: true });
    await firebase.auth().signInAnonymously();

  }

  render() {
    return (
      <Container
        style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)'
        }} component="main" maxWidth="sm">
        <div className="gradient-border">
          <div style={{ padding: "20px", marginTop: "8px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
              {this.state.showError ? <Alerts type="error" msg={this.state.errorMsg.message} /> : null}
              <Avatar style={{ margin: "5px" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography data-testid="sign-in-title" component="h1" variant="h5">
                Login
        </Typography>
            </div>
            <form style={{ width: "100%", marginTop: "1px" }} onSubmit={this.signInWithEmailPassword} noValidate>
              <TextField
                data-testid="sign-in-email-field"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Email Address"
                name="email"
                autoComplete="email"
                // autoFocus
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
                    data-testid="sign-in-email-button"
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={{ margin: "3px 0px 2px" }}
                  >
                    Login
            </Button>}
              </div>
              <div style={{ marginTop: "10px", textAlign: "center" }}>
                {this.state.loading ? '' :
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Button
                        data-testid="sign-in-google-button"
                        type="submit"
                        fullWidth
                        variant="outlined"
                        color="primary"
                        style={{ margin: "3px 0px 2px" }}
                        onClick={this.signInWithGoogle}
                      >
                        <FcIcons.FcGoogle size={20} style={{ marginRight: "5px" }} />
                      Google
                    </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        data-testid="sign-in-guest-button"
                        type="submit"
                        fullWidth
                        variant="outlined"
                        color="primary"
                        style={{ margin: "3px 0px 2px" }}
                        onClick={this.signInAnonymously}
                      >
                        <FaIcons.FaUserSecret size={20} style={{ marginRight: "5px" }} />
                      Guest
                    </Button>
                    </Grid>
                  </Grid>}
              </div>
            </form>
            <Box mt={8}>
            <ChangeLocationButton location={"/register"} text={"Dont have an account? Register Here"}/>
            </Box>
          </div>
        </div>
      </Container>
    );
  }
}

export default SignIn;

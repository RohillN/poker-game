import React from 'react';
import { AppBar, Toolbar, Typography, Button, withStyles } from '@material-ui/core';

// firebase imports
import firebase from '@firebase/app';
import 'firebase/auth';
import '@firebase/firestore';
import { AuthNavBarData } from './NavBarData';

const styles = {
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: 2,
  },
  title: {
    textAlign: "left",
    flexGrow: 1,
  },
};

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.currentUser = firebase.auth().currentUser;
  }


  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static" style={{ backgroundColor: "red" }}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Advance App Dev Project
            </Typography>
            {
              AuthNavBarData.map((item, index) => (
                <Button key={`button-${item}-${index}`} color="inherit" onClick={() => { window.location = item.path }}>{item.title}</Button>
              ))
            }
            <div style={{ borderLeft: "1px solid white", height: "25px", marginLeft: "10px", marginRight: "10px" }}></div>
            <Button color="inherit" onClick={() => { window.location = "/profile" }} >Welcome, {this.currentUser.displayName}</Button>
            <Button onClick={() => { firebase.auth().signOut() }} color="inherit">Logout</Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(NavBar);

import React from 'react';
import '@firebase/firestore';
import './App.css';

// components
import ErrorBoundary from './components/ErrorBoundary';
import NavBar from './components/navigation/NavBar';
import SwitchRoute from './components/navigation/SwitchRoute';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { IfFirebaseUnAuthed, IfFirebaseAuthed } from "@react-firebase/auth";

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <ErrorBoundary>
          <Router >
            <IfFirebaseUnAuthed>
              <Switch>
                <Redirect exact from="/" to="/login" />
                <Route exact path='/login' component={SignIn} />
                <Route exact path='/register' component={SignUp} />
              </Switch>
            </IfFirebaseUnAuthed>
            <IfFirebaseAuthed>
              <NavBar />
              <SwitchRoute />
            </IfFirebaseAuthed>
          </Router>
        </ErrorBoundary>
      </div>
    );
  }
}

export default App;

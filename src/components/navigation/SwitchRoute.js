import React from 'react';
import firebase from '@firebase/app';
import 'firebase/auth';
import '@firebase/firestore';
import Home from '../Home';
import Profile from '../Profile';
import Room from '../room/Room';
import CreateRoom from '../room/CreateRoom';
import EditRoom from '../room/EditRoom';
import Game from '../game/Game';
import Play from '../game/Play';
import { Redirect, Route, Switch } from "react-router-dom";
import AuthCheckRedirect from '../../AuthCheckRedirect';

class SwitchRoute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        }
        this.authCheckRedirect = new AuthCheckRedirect();
    }

    componentDidMount() {
        this.checkUserChanged();
        this.authCheckRedirect.checkIfLoggedOut();
    }

    componentWillUnmount() {
        this.checkUserChanged();
        this.authCheckRedirect.checkIfLoggedOut();
    }

    checkUserChanged() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.assignLoadingState(user);
            }
        });
    }

    assignLoadingState(user) {
        if (user != null) {
            this.setState({ loading: false });
        }
        else {
            this.setState({ loading: true });
        }
    }

    render() {
        return (
            <div>
                <Switch>
                    <Redirect exact from = "/login" to="/home" />
                    <Route exact path='/home' component={Home} />
                    <Route exact path='/profile' component={Profile} />
                    <Route exact path='/rooms' component={Room} />
                    <Route exact path='/rooms/create' component={CreateRoom} />
                    <Route exact path='/rooms/edit' component={EditRoom} />
                    <Route exact path='/game' component={Game} />
                    <Route path="/play/:playId" component={Play}/>
                    <Route component={Home} />
                </Switch>
            </div>
        );
    }
}

export default SwitchRoute;

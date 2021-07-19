import React from 'react';
import firebase from '@firebase/app';
import '@firebase/firestore';
import 'firebase/auth';
import { Container } from '@material-ui/core';
import GameMenu from './GameMenu';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            returnedData: [],
            loading: true,
            cards: [],
            currentRoom: "",
        }
    }

    componentDidMount() {
        this.getUserData();
    }

    async getUserData() {
        this.currentUser = firebase.auth().currentUser;
        this.db = firebase.firestore();
        let usersCurrentRoom = null;
        await this.db.collection("user").doc(this.currentUser.uid).get()
            .then((doc) => {
                usersCurrentRoom = doc.data().currentRoom
            });
        this.setState({ currentRoom: usersCurrentRoom });
        console.log(this.state.currentRoom);
    }

    render() {
        return (
            <div>
                <Container maxWidth="lg">
                    {this.state.currentRoom !== "" ? <GameMenu roomId={this.state.currentRoom} /> : <p>You need to join a room before playing!</p>}
                </Container>
            </div>
        );
    }
}

export default Game;

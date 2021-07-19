import React from 'react';
import { Button, Container } from '@material-ui/core';
import { FirestoreCollection } from 'react-firestore';
import firebase from '@firebase/app';
import '@firebase/firestore';
import 'firebase/auth';
import PlayerLayout from './PlayerLayout';
import GameGlobalDisplay from './GameGlobalDisplay';
import CommonRoomMethods from '../room/CommonRoomMethods';
import CheckBotMember from './CheckBotMember';
import './Game.scss';

class Play extends React.Component {
    constructor(props) {
        super(props);
        this.currentUser = firebase.auth().currentUser;
        this.commonRoomMethods = new CommonRoomMethods();
        this.state = {
            currentRoom: ""
        }
    }

    // check the current players room is the same room they are in
    async componentWillMount() {
        this.setState({ currentRoom: await this.commonRoomMethods.checkPlayerRoom(this.currentUser.uid) });
        console.log(this.state.currentRoom);
    }

    render() {
        return (
            <Container maxWidth="lg">
                {this.state.currentRoom === this.props.match.params.playId ?
                    <div>
                        <h1 className="headingOne">POKER</h1>
                        {console.log(this.props)}
                        <h2>Room ID: {this.props.match.params.playId}</h2>
                        <FirestoreCollection
                            path="room"
                            filter={[[firebase.firestore.FieldPath.documentId(), "==", this.props.match.params.playId]]}
                            render={({ isLoading, data }) => {
                                return isLoading ? (
                                    <p>Loading...</p>
                                ) : (
                                    <div>
                                        {data.map(room => (
                                            room.isGameStarted ?
                                                <div>
                                                    {room.roomOwnerId === this.currentUser.uid ? <CheckBotMember currentUser={this.currentUser} room={room} /> : null}
                                                    <PlayerLayout room={room} currentUser={this.currentUser} view="otherPlayer" />
                                                    <GameGlobalDisplay room={room} currentUser={this.currentUser} view="myView" />
                                                    <PlayerLayout room={room} currentUser={this.currentUser} view="myView" />
                                                </div>
                                                :
                                                <div>
                                                    <p class="saving">Waiting for host to start<span>.</span><span>.</span><span>.</span></p>
                                                    <Button variant="contained" onClick={() => { window.location = "/game" }}>Click here to see waiting room</Button>
                                                </div>
                                        ))}
                                    </div>
                                );
                            }
                            }
                        />
                    </div >
                    : <h1>Invaild Game</h1>}
            </Container>
        );
    }
}

export default Play;

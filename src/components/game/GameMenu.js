import React from 'react';
import { Button, Container, Grid, Paper } from '@material-ui/core';
import RoomSearchDisplayMembers from '../room/RoomSearchDisplayMembers';
import { FirestoreCollection } from 'react-firestore';
import firebase from '@firebase/app';
import '@firebase/firestore';
import 'firebase/auth';
import GameAddBot from './GameAddBot';
import GameDeleteBot from './GameDeleteBot';
import GameInfo from './GameInfo';
import './Game.scss';
import * as VscIcons from 'react-icons/vsc';
import { Dealer, standardDeck } from "card-dealer";

class GameMenu extends React.Component {
    constructor(props) {
        super(props);
        this.currentUser = firebase.auth().currentUser;
        this.state = {
            gameStartClicked: false,
        }
        this.iconSize = 25;
        this.dealer = new Dealer(standardDeck);
        this.dealer.shuffle();
    }

    async updateStartGameStatus(roomId, currentStatus, isOwner) {
        this.db = firebase.firestore();
        if (!currentStatus && isOwner) {
            await this.db.collection("room").doc(roomId).update({
                isGameStarted: true,
                deck: this.dealer._deck,
                roundNumber: 1,
                inRoundTurnCount: 1,

            });
        }
        window.location = `/play/${roomId}`
    }

    render() {
        return (
            <div>
                <Container maxWidth="lg">
                    <div style={{ paddingTop: '20px' }}>
                        <FirestoreCollection
                            path="room"
                            filter={[[firebase.firestore.FieldPath.documentId(), "==", this.props.roomId]]}
                            render={({ isLoading, data }) => {
                                return isLoading ? (
                                    <p>Loading...</p>
                                ) : (
                                    <div>
                                        {data.map(room => (
                                            <div>
                                                <GameInfo />
                                                <Grid container spacing={2} key={room.id}>
                                                    {room.id === this.props.roomId ?

                                                        <Grid item xs={12}>
                                                            <Grid container justify="center" spacing={3}>
                                                                <Grid item xs={this.currentUser.uid === room.roomOwnerId ? 4 : 6}>
                                                                    <Paper elevation={3} className="menu-box-padding">
                                                                        <h2>Room: {room.roomName}</h2>
                                                                        <p><b>Owner:</b> {room.roomOwnerId === this.currentUser.uid ? `${room.roomOwnerName} (Me)` : room.roomOwnerName}</p>
                                                                        <p>Room Limit: {room.membersList.length} / 5</p>
                                                                    </Paper>
                                                                </Grid>
                                                                <Grid item xs={this.currentUser.uid === room.roomOwnerId ? 4 : 6}>
                                                                    <Paper elevation={3} className="menu-box-padding">
                                                                        <h3>Players</h3>
                                                                        <RoomSearchDisplayMembers currentUserId={this.currentUser.uid} room={room} />
                                                                    </Paper>
                                                                </Grid>
                                                                {this.currentUser.uid === room.roomOwnerId ?
                                                                    <Grid item xs={4}>
                                                                        <Paper elevation={3} className="menu-box-padding">
                                                                            <h3>Add / Delete Bot</h3>
                                                                            {room.membersList.length < 5 && room.roomOwnerId === this.currentUser.uid ?
                                                                                <div>
                                                                                    <GameAddBot room={room} />
                                                                                    <GameDeleteBot room={room} />
                                                                                </div> : null}
                                                                            {room.membersList.length === 5 && room.roomOwnerId === this.currentUser.uid ?
                                                                                <div>
                                                                                    <GameDeleteBot room={room} />
                                                                                </div> : null}
                                                                        </Paper>
                                                                    </Grid> : null}
                                                            </Grid>
                                                        </Grid>

                                                        : null}
                                                    <Grid container justify="center" spacing={1}>
                                                        <Grid item xs={12}>
                                                            <Paper elevation={3} className="menu-box-padding">
                                                                {room.roomOwnerId === this.currentUser.uid & room.membersList.length >= 2 ? <Button variant="contained" style={{ margin: 5, color: "#86C232", backgroundColor: "#1F2833", padding: "10px", marginTop: "20px", fontSize: "20px" }} onClick={() => { this.updateStartGameStatus(room.id, room.isGameStarted, true) }}>{room.isGameStarted ? "Open Game" : "Start Game"} <VscIcons.VscDebugStart size={this.iconSize} style={{ marginLeft: "10px" }} className="content" /></Button> : null}
                                                                {room.membersList.length < 2 ? <div style={{ fontSize: "20px" }} class="center pulse"><p>Need more players</p></div> : null}
                                                                {room.roomOwnerId !== this.currentUser.uid & room.membersList.includes(this.currentUser.uid) ? <Button variant="contained" style={{ margin: 5, color: "#86C232", backgroundColor: "#1F2833", padding: "10px", marginTop: "20px", fontSize: "20px" }} onClick={() => { this.updateStartGameStatus(room.id, room.isGameStarted, false) }}>Open Game <VscIcons.VscDebugStart size={this.iconSize} style={{ marginLeft: "10px" }} className="content" /></Button> : null}
                                                                {room.isGameStarted ? <p style={{ marginTop: "20px", fontSize: "20px" }}>Game has started!</p> : <p class="saving" style={{ marginTop: "20px", fontSize: "20px" }}><b>Status:</b> Waiting for host to start<span>.</span><span>.</span><span>.</span></p>}
                                                            </Paper>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        ))}
                                    </div>
                                );
                            }}
                        />
                    </div>
                </Container>
            </div>
        );
    }
}

export default GameMenu;

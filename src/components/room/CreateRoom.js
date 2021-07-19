import React from 'react';
import firebase from '@firebase/app';
import '@firebase/firestore';
import 'firebase/auth';
import { Button, TextField, CircularProgress, Container } from '@material-ui/core';
import CommonRoomMethods from './CommonRoomMethods';
import Alert from '@material-ui/lab/Alert';
import moment from 'moment';
import * as FiIcons from 'react-icons/fi';
import Alerts from '../Alerts';

class RoomCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomName: '',
            roomOwnerId: '',
            roomOwnerName: '',
            date: '',
            buttonClicked: false,
            alertMessageSuccess: false,
            alertMessageFail: false,
            tempName: '',
            createdroomId: '',
            isCreatingNewRoom: false,
            userData: [],
            userDataLoaded: false,
        }

        this.iconSize = 20;
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.db = firebase.firestore();
        this.currentUser = firebase.auth().currentUser;
        this.commonRoomMethods = new CommonRoomMethods();
    }

    getMomentDate() {
        var date = moment().format('YYYY-MM-DD hh:mm:ss a');
        return date;
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value, isCreatingNewRoom: true });
    }

    alertStates(success, fail, roomString) {
        this.setState({ alertMessageSuccess: success, alertMessageFail: fail, tempName: roomString });
        if (this.state.alertMessageFail) {
            this.setState({ buttonClicked: false });
        }
    }

    resetStates() {
        this.setState({
            roomName: '',
            roomOwnerId: '',
            roomOwnerName: '',
            date: '',
            buttonClicked: false,
            memberHasGroup: false,
        });
    }

    // check if room / room name already exists
    // return boolean
    // true = can create group || false = group exists cant create
    async checkIfRoomExists() {
        let canCreate = false;
        await this.db.collection("room").where("roomName", "==", this.state.roomName)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.exists) {
                        canCreate = false;
                    }
                });
            })
            .then(
                canCreate = true,
            )
        return canCreate;
    }

    // get the current users data from firebase
    async getUserData() {
        this.setState({ data: [], loaded: false });
        let arrayData = null;
        await this.db.collection("user").doc(this.currentUser.uid).get().then((doc) => {
            arrayData = doc.data()
        });
        this.setState({ userData: arrayData, userDataLoaded: true });
        console.log(this.state.userData);
    }

    // delete a room
    async deleteUsersGroupBeforeJoinning() {
        await this.db.collection("room").doc(this.state.userData.roomOwnerId).delete().then(() => {
            console.log("Removed Room:" + this.state.userData.roomOwnerId + "\nFrom User: " + this.currentUser.uid);
        });
    }

    // create a room with all default settings
    async createRoom() {
        let newId = '';
        await this.db.collection("room").add({
            roomName: this.state.roomName,
            roomOwnerId: this.currentUser.uid,
            roomOwnerName: this.currentUser.displayName,
            date: this.getMomentDate(),
            membersList: [this.currentUser.uid],
            maxPlayers: 5,
            deck: [],
            isGameStarted: false,
            roundNumber: 0,
            roundEnd: 5,
            currentPlayerTurn: 0,
            gamePot: 0,
            currentBettingAmount: 0,
            endTimer: 5,
            winnerDetail: [],
            winningPlayerIndex: 0,
            winnerSelected: false,
            foldedMembers: [],
            currentLeaderIndex: 0,


        }).then(function (docRef) {
            newId = docRef.id;
        });
        this.setState({ createdRoomId: newId });
    }

    // create room process
    async createAndAddRoom() {
        try {
            if (this.state.roomName !== '') {
                this.setState({ alertMessageSuccess: true, tempName: this.state.roomName, alertMessageFail: false, createdRoomId: '' });
                await this.createRoom();
                await this.commonRoomMethods.addRoomListToUser("currentRoom", "isRoomOwner", "user", this.currentUser.uid, this.state.createdRoomId);
                await this.commonRoomMethods.addMemberToRoomSubCollection(this.state.createdRoomId, this.currentUser.uid, "human", this.currentUser.displayName, "human");
            }
        } catch (error) {
            console.log(error);
        } finally {
            this.resetStates();
        }
    }

    // check if the room has a subcollection with memebers
    // if true remove the members 
    // set the state for membersInGroup to true
    async checkIfMembersExists() {
        this.setState({ memberHasGroup: false });
        if (this.state.userData.roomOwnerId !== "") {
            let path = "room/" + this.state.userData.roomOwnerId + "/members"
            await this.db.collection(path).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        if (doc.exists) {
                            this.commonRoomMethods.removeItemFromCollection(path, doc.id, this.state.userData.roomOwnerId);
                            this.commonRoomMethods.removeRoomListFromUser("currentRoom", "user", doc.id, this.state.userData.roomOwnerId);
                        }
                        else {
                            console.log("no members in this group");
                        }
                    });
                });
        } else {
            this.setState({ memberHasGroup: true });
        }
        console.log(this.state.memberHasGroup);
    }

    // on form submit
    // get user data, check if the room already exists and if the room is valid, if true, start the if statement
    // 
    async handleSubmit(e) {
        e.preventDefault();
        this.setState({ buttonClicked: true });
        await this.getUserData();
        let canCreate = await this.checkIfRoomExists();
        if (canCreate) {
            if (this.state.userData.currentRoom !== "") {
                console.log(this.state.userData.currentRoom)
                let path = "room/" + this.state.userData.currentRoom + "/members";
                await this.commonRoomMethods.removeItemFromCollection(path, this.currentUser.uid, this.state.userData.currentRoom);
                await this.commonRoomMethods.removeRoomListFromUser("membersList", "room", this.state.userData.currentRoom, this.currentUser.uid);
            }
            else {
            }
            await this.checkIfMembersExists();
            if (!this.state.memberHasGroup) {
                await this.deleteUsersGroupBeforeJoinning();
            }
            await this.createAndAddRoom();
        }
        else {
            this.alertStates(false, true, this.state.tempName);
        }
    }

    render() {
        return (
            <Container maxWidth="md">
                {this.state.roomName !== '' ? <div style={{ margin: 30 }}><Alerts type="warning" msg="Note: If you are currently in or own a room, you will be removed and auto joinned to the newly created group!" /></div> : ""}
                {this.state.alertMessageSuccess ? <Alert style={{ margin: 30 }} onClose={() => { this.alertStates(false, this.state.alertMessageFail, '') }}><b>{this.state.tempName}</b> successfully created. Go to game! <a href="/game">Click here to go to game</a></Alert> : ''}
                {this.state.alertMessageFail ? <Alert style={{ margin: 30 }} severity="error" onClose={() => { this.alertStates(this.state.alertMessageSuccess, false, this.state.tempName) }}>Room already exists! Try another room name.</Alert> : ''}
                <h1 className="headingOne">Create Room</h1>
                <form onSubmit={this.handleSubmit}>
                    <TextField label="Room Name" type="text" name='roomName' value={this.state.roomName} onChange={this.handleChange} />
                    {this.state.buttonClicked ? <CircularProgress /> : <Button style={{ margin: 10, color: "#45A29E", backgroundColor: "#222629" }} variant="outlined" type="submit">Add Room <FiIcons.FiPlus size={this.iconSize} style={{ marginLeft: "10px" }} className="content" /></Button>}
                </form>
            </Container>
        );
    }
}

export default RoomCreate;

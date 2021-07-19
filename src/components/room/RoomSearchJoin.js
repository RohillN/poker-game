import React from 'react';
import { FirestoreCollection } from 'react-firestore';
import firebase from '@firebase/app';
import 'firebase/auth';
import { Button, CircularProgress } from '@material-ui/core';
import CommonRoomMethods from './CommonRoomMethods';
import * as FiIcons from 'react-icons/fi';
import * as BiIcons from 'react-icons/bi';

class RoomSearchJoin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userData: [],
            userDataLoaded: false,
        }
        this.iconSize = 20;
        this.currentUser = firebase.auth().currentUser;
        this.db = firebase.firestore();
        this.commonRoomMethods = new CommonRoomMethods();
    }

    async getUserData() {
        this.setState({ data: [], loaded: false });
        let arrayData = null;
        await this.db.collection("user").doc(this.currentUser.uid).get().then((doc) => {
            arrayData = doc.data()
        });
        this.setState({ userData: arrayData, userDataLoaded: true });
        console.log(this.state.userData);
    }

    async checkIfMembersExists() {
        if (this.state.userData.roomOwnerId !== "") {
            this.setState({ memberHasGroup: false })
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

    async deleteUsersGroupBeforeJoinning() {
        await this.db.collection("room").doc(this.state.userData.roomOwnerId).delete().then(() => {
            console.log("Removed Room:" + this.state.userData.roomOwnerId + "\nFrom User: " + this.currentUser.uid);
        });
    }

    async checkRoomMaxLimit(roomId) {
        let roomLimit = null;
        await this.db.collection("room").doc(roomId).get()
            .then((doc) => {
                roomLimit = doc.data().maxPlayers
            });
        console.log(roomLimit);
        return roomLimit;
    }

    async combinedAddMemberUpdateUser(roomId) {
        await this.getUserData();
        await this.checkIfMembersExists();
        if (!this.state.memberHasGroup) {
            await this.deleteUsersGroupBeforeJoinning();
        }
        await this.commonRoomMethods.addMemberToRoomSubCollection(roomId, this.currentUser.uid, "human", this.currentUser.displayName, "human")
        await this.commonRoomMethods.addRoomListToUser("currentRoom", "removeOwner", "user", this.currentUser.uid, roomId);
        await this.commonRoomMethods.addRoomListToUser("membersList", "", "room", roomId, this.currentUser.uid);
    }

    render() {
        return (
            <FirestoreCollection
                path={"user"}
                filter={[["uid", "==", this.currentUser.uid]]}
                render={({ isLoading, data }) => {
                    return isLoading ? (
                        <CircularProgress />
                    ) : (
                        <div>
                            {data.map(user => (
                                user.currentRoom === "" || user.roomOwnerId !== "" ?
                                this.props.room.isGameStarted ?  <Button key={"game-started-" + this.props.room.id} style={{ margin: 5, color: "#86C232", backgroundColor: "#1F2833" }} disabled={true} size="small" variant="contained" color="primary">Game Started <BiIcons.BiCommentError size={this.iconSize} style={{ marginLeft: "10px", color: "#86C232" }} className="content" /></Button> :
                                this.props.room.membersList.length !== 5 ? <Button key={"join-" + this.props.room.id} style={{ margin: 5, color: "#86C232", backgroundColor: "#1F2833" }} onClick={() => this.combinedAddMemberUpdateUser(this.props.room.id)} size="small" variant="contained" color="primary">Join <FiIcons.FiPlus size={this.iconSize} style={{ marginLeft: "10px", color: "#86C232" }} className="content" /></Button>
                                        : <Button key={"join22-" + this.props.room.id} style={{ margin: 5, color: "#86C232", backgroundColor: "#1F2833" }} disabled={true} size="small" variant="contained" color="primary">Room Full <BiIcons.BiError size={this.iconSize} style={{ marginLeft: "10px", color: "#86C232" }} className="content" /></Button> : null
                            ))}
                        </div>
                    );
                }}
            />
        );
    }
}

export default RoomSearchJoin;

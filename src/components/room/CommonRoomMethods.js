import React from 'react';
import firebase from '@firebase/app';
import 'firebase/auth';
import '@firebase/firestore';

class CommonRoomMethods extends React.Component {
    constructor(props) {
        super(props);
        this.currentUser = firebase.auth().currentUser;
        this.db = firebase.firestore();
    }
    
    // add roomList to users or membersList to rooms 
    // provide type to select with field is going to be targeted
    // also provide collection path, id of the document and item "roomId/memberId" is being added
    // e.g ('roomList', 'user', 'user-1234', 'room-555')
    async addRoomListToUser(fieldCurrent, fieldOwner, collectionPath, docId, itemId) {
        if (fieldCurrent === "currentRoom" && fieldOwner === "isRoomOwner") {
            await this.db.collection(collectionPath).doc(docId).update({
                currentRoom: itemId,
                isRoomOwner: true,
                roomOwnerId: itemId
            });
        }
        if (fieldCurrent === "currentRoom") {
            await this.db.collection(collectionPath).doc(docId).update({
                currentRoom: itemId
            });
        }
        if (fieldCurrent === "currentRoom" && fieldOwner === "removeOwner") {
            await this.db.collection(collectionPath).doc(docId).update({
                currentRoom: itemId,
                roomOwnerId: ""
            });
        }
        if (fieldCurrent === "membersList") {
            await this.db.collection(collectionPath).doc(docId).update({
                membersList: firebase.firestore.FieldValue.arrayUnion(itemId)
            });
        }
    }

    // delete roomId or memberId from array
    // provide type to select with field is going to be targeted
    // also provide collection path, id of the document and item "roomId/memberId" is being removed
    // e.g ('roomList', 'user', 'user-1234', 'room-555')
    async removeRoomListFromUser(arrayType, collectionPath, docId, itemId) {
        if (arrayType === "currentRoom") {
            await this.db.collection(collectionPath).doc(docId).update({
                currentRoom: "",
            });
        }
        if (arrayType === "membersList") {
            await this.db.collection(collectionPath).doc(docId).update({
                membersList: firebase.firestore.FieldValue.arrayRemove(itemId)
            });
        }
    }

    // delete an item
    // provide collection path, id of the document being deleted and which item "member/owner" is being removed
    // e.g ('room/room-555/members', user-1234, room-555)
    async removeItemFromCollection(collectionPath, docId, itemId) {
        await this.db.collection(collectionPath).doc(docId).delete().then(() => {
            console.log("Member:" + docId + "\nRemoved From room: " + itemId);
        });
    }

    // Adds a member to a subcollection in a room
    async addMemberToRoomSubCollection(roomId, userId, playerType, userName, botType) {
        let path = "room/" + roomId + "/members"
        await this.db.collection(path).doc(userId).set({
            inroomState: true,
            memberId: userId,
            name: userName,
            type: playerType,
            botType: botType,
            cards: [],
            deltCards: false,
            swapedCards: false,
            countCardsSwapped: 0,
            totalSwapAmmount: 5,
            balance: 100,
            hasFolded: false,
            excludeCards: [],
            status: "",
            lastBetAmount: 0,
        });
    }

    // checks users current room and returns room id
    async checkPlayerRoom(userToCheck) {
        let usersCurrentRoom = null;
        await this.db.collection("user").doc(userToCheck).get()
            .then((doc) => {
                usersCurrentRoom = doc.data().currentRoom
            });
        return usersCurrentRoom;
    }

}



export default CommonRoomMethods;
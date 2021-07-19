import React from 'react';
import firebase from '@firebase/app';
import '@firebase/firestore';
import 'firebase/auth';

class UpdateRoom extends React.Component {
    constructor(props) {
        super(props);
        this.db = firebase.firestore();
    }

    // check if the next players index in memberslist
    // if index is greater than the length of the members list 
    // set it back to the starting player.
    evaluateMembersIndex(index, membersCount) {
        let currentPlayerIndex = index += 1

        if (currentPlayerIndex > membersCount - 1) {
            currentPlayerIndex = 0;
        }
        return currentPlayerIndex
    }

    // update round if the player index is zero = starting player
    // if the current round is the end round reset game. 
    evaluateExternalRound(leaderIndex, playerIndex, roundCount, roundEnd, isBettingContinue) {
        let newRoundCount = roundCount;

        if (!isBettingContinue && playerIndex === leaderIndex && roundCount < roundEnd) {
            newRoundCount++;
        }
        if (isBettingContinue) {
            newRoundCount = newRoundCount;
        }
        if (roundCount === roundEnd) {
            newRoundCount = 1;
        }
        return newRoundCount;
    }

    // check if the player has called or raised 
    // return true or false
    evaluateLastBetRoundCheck(lastCurrentBet, playersCurrentBet) {
        let keepBetting = true;

        // player has called bet or checked 
        if (playersCurrentBet === lastCurrentBet) {
            keepBetting = false;
        }
        // player has rasied bet
        if (playersCurrentBet > lastCurrentBet) {
            keepBetting = true;
        }
        return keepBetting;

    }

    // update the current player index
    async updateRoomRound(collectionPath, roomId, newPlayersIndex, externalRoundCount) {
        await this.db.collection(collectionPath).doc(roomId).update({
            currentPlayerTurn: newPlayersIndex,
            roundNumber: externalRoundCount
        })
    }

    // update the current betting amount for the room 
    async updateCurrentBettingForFreshRound(collectionPath, roomId) {
        await this.db.collection(collectionPath).doc(roomId).update({
            currentBettingAmount: 0
        })
    }

    // update rooms pot and the last be amount for calling
    async updateRoomPot(collectionPath, roomId, newTotal, lastBetAmount) {
        await this.db.collection(collectionPath).doc(roomId).update({
            gamePot: newTotal,
            currentBettingAmount: lastBetAmount,
        });
    }

    // add member to folded members array
    async roomAddPlayerToFoldedList(collectionPath, roomId, memberId) {
        await this.db.collection(collectionPath).doc(roomId).update({
            foldedMembers: firebase.firestore.FieldValue.arrayUnion(memberId),
        });
    }

}

export default UpdateRoom;

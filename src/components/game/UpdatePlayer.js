import React from 'react';
import firebase from '@firebase/app';
import '@firebase/firestore';
import 'firebase/auth';

class UpdatePlayer extends React.Component {
    constructor(props) {
        super(props);
        this.db = firebase.firestore();
    }

    // deduct bet amount from player
    async updatePlayerBalance(collectionPath, userId, newUserBalance, lastBet) {
        await this.db.collection(collectionPath).doc(userId).update({
            balance: newUserBalance,
            lastBetAmount: lastBet,
        });
    }

    // update players last betting amount
    async updatePlayerLastBetFreshRound(collectionPath, userId) {
        await this.db.collection(collectionPath).doc(userId).update({
            lastBetAmount: 0
        })
    }

    // update players balance
    async updateWinningPlayersBalance(collectionPath, userId, amount) {
        await this.db.collection(collectionPath).doc(userId).update({
            balance: amount
        })
    }

    // player removed cards array when folding
    async updatePlayerFoldCards(collectionPath, userId) {
        await this.db.collection(collectionPath).doc(userId).update({
            cards: [],
            hasFolded: true,
        })
    }
}

export default UpdatePlayer;

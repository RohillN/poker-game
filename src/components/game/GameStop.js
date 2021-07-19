import React from 'react';
import { Button } from '@material-ui/core';
import firebase from '@firebase/app';
import '@firebase/firestore';
import 'firebase/auth';
import * as GoIcons from 'react-icons/go';

class GameStop extends React.Component {
    constructor(props) {
        super(props);
        this.iconSize = 20;
        this.db = firebase.firestore();
    }

    resetPlayersHands() {
        this.props.room.membersList.forEach(item => {
            this.db.collection("room/" + this.props.room.id + "/members").doc(item).update({
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
        });
    }

    async stopAndResetDeckAndHand() {
        await this.stopGame();
        await this.resetPlayersHands();
        console.log(this.props.room)
    }

    async stopGame() {
        await this.db.collection("room").doc(this.props.room.id).update({
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
            currentLeaderIndex: 0
        });
    }

    render() {
        return (
            // this.props.room.inRoundTurnCount !== 4 ? 
            // <Button style={{ margin: 5, color: "#86C232", backgroundColor: "#1F2833" }} disabled={true} size="small" variant="contained" color="primary" >Stop game at round end.<AiIcons.AiOutlineStop size={this.iconSize} style={{ marginLeft: "10px", color: "#86C232" }} className="content" /></Button> :
            this.props.room.roomOwnerId === this.props.currentUser.uid ? <Button style={{ margin: 5, color: "#86C232", backgroundColor: "#1F2833" }} onClick={() => { this.stopAndResetDeckAndHand() }} size="small" variant="contained" color="primary" >Stop Game <GoIcons.GoStop size={this.iconSize} style={{ marginLeft: "10px", color: "#86C232" }} className="content" /></Button>
                : null
        );
    }
}

export default GameStop;

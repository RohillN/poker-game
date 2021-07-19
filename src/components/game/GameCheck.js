import React from 'react';
import { Button } from '@material-ui/core';
import firebase from '@firebase/app';
import '@firebase/firestore';
import 'firebase/auth';
import * as GiIcons from 'react-icons/gi';
import UpdateRoom from './UpdateRoom';

class GameCheck extends React.Component {
    constructor(props) {
        super(props);
        this.iconSize = 20;
        this.updateRoom = new UpdateRoom();
    }

    async evaluateRounds() {
        let continueBetting = this.updateRoom.evaluateLastBetRoundCheck(this.props.room.currentBettingAmount, this.props.room.currentBettingAmount);
        let newPlayerIndex = this.updateRoom.evaluateMembersIndex(this.props.room.currentPlayerTurn, this.props.room.membersList.length);
        let newExternalRound = this.updateRoom.evaluateExternalRound(this.props.room.currentLeaderIndex, newPlayerIndex, this.props.room.roundNumber, this.props.room.roundEnd, continueBetting);
        await this.updateRoom.updateRoomRound("room", this.props.room.id, newPlayerIndex, newExternalRound);
    }

    // if users checks, the current betting will be zero
    // last bet needs to be zero in order to check
    async checkHand() {
        this.db = firebase.firestore();
        await this.db.collection("room").doc(this.props.room.id).update({
            currentBettingAmount: 0,
        })
    }

    async checkHandProcess() {
        await this.evaluateRounds();
        await this.checkHand();
    }

    render() {
        return (
            <Button data-testid="check-button" style={{ margin: 5, color: "#86C232", backgroundColor: "#1F2833" }} onClick={() => { this.checkHandProcess() }} size="small" variant="contained" color="primary" >Check <GiIcons.GiPokerHand size={this.iconSize} style={{ marginLeft: "10px", color: "#86C232" }} className="content" /></Button>
        );
    }
}

export default GameCheck;

import React from 'react';
import { Button } from '@material-ui/core';
import * as GiIcons from 'react-icons/gi';
import UpdatePlayer from './UpdatePlayer';
import UpdateRoom from './UpdateRoom';

class GameCall extends React.Component {
    constructor(props) {
        super(props);
        this.iconSize = 20;
        this.updatePlayer = new UpdatePlayer();
        this.updateRoom = new UpdateRoom();
    }

    async callAndUpdateRoomPot() {
        let newTotal = this.props.room.gamePot + this.props.room.currentBettingAmount;
        await this.updateRoom.updateRoomPot("room", this.props.room.id, newTotal, this.props.room.currentBettingAmount);
    }
    
    // deduct bet amount from player
    async callAndUpdatePlayerBalance() {
        let collectionPath = "room/" + this.props.room.id + "/members";
        let newBalance = this.props.members.balance - this.props.room.currentBettingAmount;
        if (newBalance <= 0) {
            newBalance = 0
        }
        await this.updatePlayer.updatePlayerBalance(collectionPath, this.props.currentUser.uid, newBalance, this.props.room.currentBettingAmount);
    }

    async callTrigger() {
        await this.callAndUpdateRoomPot();
        await this.callAndUpdatePlayerBalance();

        // after change to next player and add round
        let continueBetting = this.updateRoom.evaluateLastBetRoundCheck(this.props.room.currentBettingAmount, this.props.members.lastBetAmount);
        let newPlayerIndex = this.updateRoom.evaluateMembersIndex(this.props.room.currentPlayerTurn, this.props.room.membersList.length);
        let newExternalRound = this.updateRoom.evaluateExternalRound(this.props.room.currentLeaderIndex, newPlayerIndex, this.props.room.roundNumber, this.props.room.roundEnd, continueBetting);
        await this.updateRoom.updateRoomRound("room", this.props.room.id, newPlayerIndex, newExternalRound);

    }

    render() {
        return (
            this.props.members.balance > 0 ?
            <Button data-testid="call-button" style={{ margin: 5, color: "#86C232", backgroundColor: "#1F2833" }} onClick={() => { this.callTrigger() }} size="small" variant="contained" color="primary" >Call Bet - {this.props.room.currentBettingAmount > this.props.members.balance ? "ALL IN" : `$${this.props.room.currentBettingAmount}`} <GiIcons.GiBugleCall size={this.iconSize} style={{ marginLeft: "10px", color: "#86C232" }} className="content" /></Button>
            : null
        );
    }
}

export default GameCall;

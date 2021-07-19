import React from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import * as MdIcons from 'react-icons/md';
import UpdatePlayer from './UpdatePlayer';
import UpdateRoom from './UpdateRoom';

class GameStop extends React.Component {
    constructor(props) {
        super(props);
        this.iconSize = 20;
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            buttonClicked: false,
            betAmount: this.props.room.currentBettingAmount >= 5 ? this.props.room.currentBettingAmount + 1 : 5,
            continueBet: false,
        }
        this.updatePlayer = new UpdatePlayer();
        this.updateRoom = new UpdateRoom();
    }

    // change change of the betting ammount
    handleChange(e) {
        e.preventDefault();
        this.setState({ [e.target.name]: Number(e.target.value) });
    }

    // on submit, update room pot and dedcut money from player
    async handleSubmit(e) {
        e.preventDefault();
        this.setState({ buttonClicked: true, continueBet: false });

        console.log(`Last Bet: ${this.props.room.currentBettingAmount} || Players Bet: ${this.state.betAmount}`)
        let continueBetting = this.updateRoom.evaluateLastBetRoundCheck(this.props.room.currentBettingAmount, this.state.betAmount);
        this.setState({ continueBet: continueBetting });

        await this.updateRoomPot();
        await this.updatePlayerBalance();

        // after change to next player and add round
        let newPlayerIndex = this.updateRoom.evaluateMembersIndex(this.props.room.currentPlayerTurn, this.props.room.membersList.length);
        let newExternalRound = this.updateRoom.evaluateExternalRound(this.props.room.currentLeaderIndex, newPlayerIndex, this.props.room.roundNumber, this.props.room.roundEnd, continueBetting);

        await this.updateRoom.updateRoomRound("room", this.props.room.id, newPlayerIndex, newExternalRound);

        this.setState({ buttonClicked: false, betAmount: 5 });
    }

    // update rooms pot and the last be amount for calling
    async updateRoomPot() {
        let newTotal = this.props.room.gamePot + this.state.betAmount;
        await this.updateRoom.updateRoomPot("room", this.props.room.id, newTotal, this.state.betAmount);
    }

    // deduct bet amount from player
    async updatePlayerBalance() {
        let collectionPath = "room/" + this.props.room.id + "/members";
        let newBalance = this.props.members.balance - this.state.betAmount;
        await this.updatePlayer.updatePlayerBalance(collectionPath, this.props.currentUser.uid, newBalance, this.state.betAmount);
    }

    render() {
        return (
            this.props.members.balance > 0 ?
                <form onSubmit={this.handleSubmit}>
                    <input label="Bet Amount" type="number" name='betAmount' min={this.props.room.currentBettingAmount + 1} max={this.props.members.balance} value={this.state.betAmount} onChange={this.handleChange} />
                    {this.state.buttonClicked ? <CircularProgress /> : <Button data-testid="bet-button" style={{ margin: 5, color: "#86C232", backgroundColor: "#1F2833" }} type="submit" size="small" variant="contained" color="primary" >Bet <MdIcons.MdAttachMoney size={this.iconSize} style={{ marginLeft: "10px", color: "#86C232" }} className="content" /></Button>}
                </form>
                : null
        );
    }
}

export default GameStop;

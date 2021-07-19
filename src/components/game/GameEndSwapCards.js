import React from 'react';
import firebase from '@firebase/app';
import '@firebase/firestore';
import 'firebase/auth';
import { Button } from '@material-ui/core';
import UpdateRoom from './UpdateRoom';
import * as MdIcons from 'react-icons/md';
import UpdatePlayer from './UpdatePlayer';


class GameSwapCards extends React.Component {
  constructor(props) {
    super(props);
    this.updateRoom = new UpdateRoom();
    this.updatePlayer = new UpdatePlayer();
    this.iconSize = 30;
  }

  async updateRound() {
    // after change to next player and add round
    let newPlayerIndex = this.updateRoom.evaluateMembersIndex(this.props.room.currentPlayerTurn, this.props.room.membersList.length);
    let newExternalRound = this.updateRoom.evaluateExternalRound(this.props.room.currentLeaderIndex, newPlayerIndex, this.props.room.roundNumber, this.props.room.roundEnd);
    await this.updateRoom.updateRoomRound("room", this.props.room.id, newPlayerIndex, newExternalRound);
    // if card swapping router, restart the last bet amount to 0
    if (newExternalRound === 2 && this.props.room.roomOwnerId === this.props.currentUser.uid) {
      await this.updateRoom.updateCurrentBettingForFreshRound("room", this.props.room.id);
    }
    // reset players last be amount
    await this.updatePlayer.updatePlayerLastBetFreshRound("room/" + this.props.room.id + "/members", this.props.currentUser.uid);
  }

async finishCardSwap() {
  this.db = firebase.firestore();
  await this.db.collection("room/" + this.props.room.id + "/members").doc(this.props.currentUser.uid).update({
    swapedCards: false,
  })
}

async endCardSwapTrigger() {
  await this.finishCardSwap();
  await this.updateRound();
}

render() {
  return (
    <Button data-testid="end-swap-cards" style={{ margin: 5, color: "#86C232", backgroundColor: "#1F2833" }} onClick={() => { this.endCardSwapTrigger() }} size="small" variant="contained" color="primary" >Finish Card Exchange <MdIcons.MdSwapHoriz size={this.iconSize} style={{ marginLeft: "10px", color: "#86C232" }} className="content" /></Button>
  );
}
}

export default GameSwapCards;

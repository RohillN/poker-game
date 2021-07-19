import React from 'react';
import firebase from '@firebase/app';
import '@firebase/firestore';
import 'firebase/auth';
import { Tooltip } from '@material-ui/core';
import clsx from 'clsx';

class GameSwapCards extends React.Component {
  constructor(props) {
    super(props);
    this.db = firebase.firestore();
    this.state = {
      cardRemoved: false,
      cardAdded: false,
      isSwaping: false,
    }
  }

  // removed the selected card from players hand
  async removeSelectedPlayerCard() {
    this.setState({ cardRemoved: false });
    await this.db.collection("room/" + this.props.room.id + "/members").doc(this.props.currentUser.uid).update({
      cards: firebase.firestore.FieldValue.arrayRemove(this.props.members.cards[this.props.cardIndex])
    });
    this.setState({ cardRemoved: true });
  }

  // draw the last from the rooms deck append to players hand
  // new card will always be the last card the the deck
  async drawNewPlayerCard() {
    let newCard = this.props.room.deck[this.props.room.deck.length - 1];
    let countCardSwap = this.props.members.countCardsSwapped += 1;
    let exclueCardIndex = this.props.members.cards.length - countCardSwap;
    this.setState({ cardAdded: false });
    await this.db.collection("room/" + this.props.room.id + "/members").doc(this.props.currentUser.uid).update({
      cards: firebase.firestore.FieldValue.arrayUnion(newCard),
      countCardsSwapped: countCardSwap,
      excludeCards: firebase.firestore.FieldValue.arrayUnion(exclueCardIndex),
      swapedCards: true,
    });
    this.setState({ cardAdded: true });
  }

  //update the rooms deck with the removed card
  async updateRoomDeck() {
    let newDeck = this.props.room.deck;
    newDeck.pop();
    await this.db.collection("room").doc(this.props.room.id).update({
      deck: newDeck
    });
  }


  // start the change exchange process
  // if player has a new card and old card removed,
  // then update the rooms deck
  async cardExchangeProcess() {
    this.setState({ isSwaping: true });
    await this.drawNewPlayerCard();
    await this.removeSelectedPlayerCard();
    if (this.state.cardRemoved & this.state.cardAdded) {
      await this.updateRoomDeck();
    }
    this.setState({ isSwaping: false });
  }


  render() {
    return (
      this.state.isSwaping ? null :
        this.props.room.membersList[this.props.room.currentPlayerTurn] === this.props.currentUser.uid && this.props.room.roundNumber === 2 ?
          <Tooltip title={this.props.members.excludeCards.includes(this.props.cardIndex) ? "" : "Swap Card"} placement="bottom" arrow>
            <img className={
              clsx({
                "grow": this.props.members.memberId === this.props.currentUser.uid && !this.props.members.excludeCards.includes(this.props.cardIndex),
              })
            } style={{ width: "15%", margin: "4px", marginTop: "40px", marginBottom: "40px" }} onClick={() => { { this.props.members.memberId === this.props.currentUser.uid ? this.props.members.excludeCards.includes(this.props.cardIndex) ? console.log(`Newly Swapped Card Excluded Swap: ${this.props.cardIndex}`) : this.cardExchangeProcess() : console.log("Can not change other players cards...") } }} src={`/images/${this.props.rank}${this.props.suit}.png`} alt={`card-${this.props.rank}-${this.props.suit}`} />
          </Tooltip>
          :
          <img style={{ width: "15%", margin: "4px", marginTop: "40px", marginBottom: "40px" }} src={`/images/${this.props.rank}${this.props.suit}.png`} alt={`card-${this.props.rank}-${this.props.suit}`} />
    );
  }
}

export default GameSwapCards;

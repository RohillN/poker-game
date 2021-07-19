import React from 'react';
import firebase from '@firebase/app';
import '@firebase/firestore';
import 'firebase/auth';
import GameSwapCards from './GameSwapCards';
import { Dealer, standardDeck } from "card-dealer";
import UpdatePlayer from './UpdatePlayer';
import { Button } from '@material-ui/core';
import * as VscIcons from 'react-icons/vsc';
// https://www.npmjs.com/package/poker-hand-evaluator/v/1.0.0
// https://github.com/codeKonami/poker-hand

class GameWinnerEvaluation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            memberSubCollection: [],
            evaluateHandCollection: [],
            oldCards: [],
            winningPlayerIndex: 0,
            lastPlayerScore: 0,
            winnerSelected: false,
        }
        this.iconSize = 30;
        this.updatePlayer = new UpdatePlayer();
        this.dealer = new Dealer(standardDeck);
        this.dealer.shuffle();
        this.PokerHand = require('poker-hand-evaluator');
        this.db = firebase.firestore();
    }

    async componentDidMount() {
        if (!this.props.room.winnerSelected && this.props.room.roomOwnerId === this.props.currentUser.uid) {
            if (this.props.room.membersList.length !== this.props.room.foldedMembers.length) {
                await this.getCollectionGroup();
                this.changeCardName();
                this.evaluateHand();
                this.calculateWinner();
                await this.updateRoomWinningTable();

                let membersPath = `room/${this.props.room.id}/members`;
                let newWinnings = this.props.room.winnerDetail[this.props.room.winningPlayerIndex].balance + this.props.room.gamePot;
                await this.updatePlayer.updateWinningPlayersBalance(membersPath, this.props.room.winnerDetail[this.props.room.winningPlayerIndex].id, newWinnings)
            }
        }
    }

    // get sub collection members from the room
    // store each member in array state
    async getCollectionGroup() {
        let localArrayHold = []
        let temp = []
        await this.db.collectionGroup("members").where("memberId", "in", this.props.room.membersList).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    localArrayHold.push({ 'id': doc.data().memberId, 'name': doc.data().name, 'cards': doc.data().cards, 'balance': doc.data().balance })
                    temp.push({ 'cards': doc.data().cards });
                });
            });
        this.setState({ memberSubCollection: localArrayHold, oldCards: temp });
    }

    // change the value of the cards inorder to work with the hand evaluation npm package 
    // from '3Clubs, queenHearts, kingSpades, aceDiamonds, jackSpades' => '3C, QH, KS, AD, JS' 
    changeCardName() {
        for (let index = 0; index < this.state.memberSubCollection.length; index++) {
            this.state.memberSubCollection[index].cards.forEach((card, item) => {
                if (card.rank === "10" || card.rank === 10) {
                    this.state.memberSubCollection[index].cards[item] = "T" + card.suit.charAt(0)
                } else {
                    this.state.memberSubCollection[index].cards[item] = card.rank.charAt(0).toUpperCase() + card.suit.charAt(0)
                }
            });
        }
    }

    // loop through each players and use the pokehand package to get the result of the players hand
    // store the result into a state array
    async evaluateHand() {
        let hand = ""
        let evaluateHand = "";
        let handEvaluation = []
        for (let playerIndex = 0; playerIndex < this.state.memberSubCollection.length; playerIndex++) {
            for (let cardIndex = 0; cardIndex < this.state.memberSubCollection[playerIndex].cards.length; cardIndex++) {
                if (cardIndex === this.state.memberSubCollection[playerIndex].cards.length - 1) {
                    hand = hand + this.state.memberSubCollection[playerIndex].cards[cardIndex].toString();
                } else {
                    hand = hand + this.state.memberSubCollection[playerIndex].cards[cardIndex].toString() + " ";
                }
            }
            if (hand.length === 0) {
                handEvaluation.push({ 'id': this.state.memberSubCollection[playerIndex].id, 'name': this.state.memberSubCollection[playerIndex].name, 'rank': '9999', 'score': '9999', 'cards': this.state.oldCards[playerIndex].cards, 'balance': this.state.memberSubCollection[playerIndex].balance })

            } else {
                evaluateHand = new this.PokerHand(hand)
                handEvaluation.push({ 'id': this.state.memberSubCollection[playerIndex].id, 'name': this.state.memberSubCollection[playerIndex].name, 'rank': evaluateHand.getRank(), 'score': evaluateHand.getScore(), 'cards': this.state.oldCards[playerIndex].cards, 'balance': this.state.memberSubCollection[playerIndex].balance })
                this.setState({ evaluateHandCollection: handEvaluation });
            }
            hand = ""
            evaluateHand = ""
        };
    }

    // loop through players cards
    // check if the players score is less than the last score, save the index of the player with a higher score
    // lower the score the better 
    calculateWinner() {
        let cWinningPlayerIndex = 0;
        let cLastPlayerScore = '9999';
        console.log(`Starting Player Hand Score: ${this.state.evaluateHandCollection[cWinningPlayerIndex].name} = Score ${cLastPlayerScore}`)
        for (let playerIndex = 0; playerIndex < this.state.evaluateHandCollection.length; playerIndex++) {
            if (this.state.evaluateHandCollection[playerIndex].score < cLastPlayerScore) {
                cLastPlayerScore = this.state.evaluateHandCollection[playerIndex].score;
                cWinningPlayerIndex = playerIndex;
            }
            console.log(`Player: ${this.state.evaluateHandCollection[cWinningPlayerIndex].name} = Card Score ${cLastPlayerScore}`)
        }
        this.setState({ winningPlayerIndex: cWinningPlayerIndex, lastPlayerScore: cLastPlayerScore, winnerSelected: true });
        console.log(`Winner: ${this.state.evaluateHandCollection[cWinningPlayerIndex].name} = Score ${cLastPlayerScore}`)
    }
    // update room with an array of player evaluated hand and score
    // add winning players index to reference at the end and set selected winner bool to true
    async updateRoomWinningTable() {
        await this.db.collection("room").doc(this.props.room.id).update({
            winnerDetail: this.state.evaluateHandCollection,
            winningPlayerIndex: this.state.winningPlayerIndex,
            winnerSelected: true,
        })
    }

    // reset rooms default for a new game round
    async restartGame() {
        await this.db.collection("room").doc(this.props.room.id).update({
            deck: this.dealer._deck,
            roundNumber: 1,
            roundEnd: 5,
            currentPlayerTurn: 0,
            gamePot: 0,
            currentBettingAmount: 0,
            endTimer: 5,
            winnerDetail: [],
            winningPlayerIndex: 0,
            winnerSelected: false,
            foldedMembers: [],
            currentLeaderIndex: 0,
        });
    }

    // reset players hand for new game round
    resetPlayersHands() {
        this.props.room.membersList.forEach(item => {
            this.db.collection("room/" + this.props.room.id + "/members").doc(item).update({
                cards: [],
                deltCards: false,
                swapedCards: false,
                countCardsSwapped: 0,
                totalSwapAmmount: 5,
                hasFolded: false,
                excludeCards: [],
                status: "",
                lastBetAmount: 0,
            });
        });
    }

    async restartGameProcess() {
        this.resetPlayersHands();
        await this.restartGame();
    }

    render() {
        return (
            <div>
                {this.props.room.winnerSelected ?
                    <div>
                        <h1>Winner: {this.props.room.winnerDetail[this.props.room.winningPlayerIndex].name}</h1>
                        <h2>Hand: {this.props.room.winnerDetail[this.props.room.winningPlayerIndex].rank}</h2>
                        {this.props.room.winnerDetail[this.props.room.winningPlayerIndex].cards.map((item, index) => (
                            <GameSwapCards room={this.props.room} members={this.props.members} currentUser={this.props.currentUser} cardIndex={10} rank={item.rank} suit={item.suit} />
                        ))}
                        <h3>Pot: ${this.props.room.gamePot}</h3>
                        <h4 class="saving">Restarting Game<span>.</span><span>.</span><span>.</span></h4>
                        {this.props.room.roomOwnerId === this.props.currentUser.uid ? 
                        <Button style={{ margin: 5, color: "#86C232", backgroundColor: "#1F2833", fontSize: "20px" }} onClick={() => { this.restartGameProcess() }} size="small" variant="contained" color="primary" >Restart Game <VscIcons.VscDebugRestart size={this.iconSize} style={{ marginLeft: "10px", color: "#86C232" }} className="content" /></Button>
                        : null}
                    </div>
                    : null
                }
            </div>
        );
    }
}

export default GameWinnerEvaluation;

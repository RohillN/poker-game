import { Button } from '@material-ui/core';
import React from 'react';
import firebase from '@firebase/app';
import 'firebase/auth';
import '@firebase/firestore';
import UpdateRoom from './UpdateRoom';
import UpdatePlayer from './UpdatePlayer';

class BotAPI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            returnedData: [],
            loading: true,
            botData: [],
            finished: false,
        }

        this.updateRoom = new UpdateRoom();
        this.updatePlayer = new UpdatePlayer();
        this.sendPostRequest = this.sendPostRequest.bind(this);
        this.url = "https://app-dev-project-rest-api.herokuapp.com/bot-move"
    }

    // on mount, bot will start. If bot does not work try refreshing browser
    // can take 5 - 10 seconds for heroku to become active
    async componentDidMount() {
        await this.loadBot();
    }

    // bot load and check process
    async loadBot() {
        await this.getBotData();
        if (this.state.botData.length > 0) {
            await this.sendPostRequest();
            if (!this.state.loading) {
                this.startSleeper();
            }
        }
    }

    // create a timeout promise that will sleep for a value passed in
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // start time for random 2 to 5 seonds. Give the bot some appearance of thinking / delay
    async startSleeper() {
        let randomSleepAmount = Math.floor((Math.random() * 5) + 2);
        for (let i = randomSleepAmount; i > 0; i--) {
            await this.sleep(1000);
        }
        await this.checkBotMove();
    }

    // get subcollection of all bot in a a room
    async getBotData() {
        this.db = firebase.firestore();
        let localArrayHold = [];
        await this.db.collectionGroup("members").where("memberId", "==", this.props.room.membersList[this.props.room.currentPlayerTurn]).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    localArrayHold.push(doc.data())
                });
            });
        this.setState({ botData: localArrayHold });
        console.log(this.state.botData)
    }

    // check if bot needs to continue betting and moved the the next players turn
    async updateBettingRoundProcess() {
        let continueBetting = this.updateRoom.evaluateLastBetRoundCheck(this.props.room.currentBettingAmount, this.state.returnedData.botBetAmount);
        let newPlayerIndex = this.updateRoom.evaluateMembersIndex(this.props.room.currentPlayerTurn, this.props.room.membersList.length);
        let newExternalRound = this.updateRoom.evaluateExternalRound(this.props.room.currentLeaderIndex, newPlayerIndex, this.props.room.roundNumber, this.props.room.roundEnd, continueBetting);
        await this.updateRoom.updateRoomRound("room", this.props.room.id, newPlayerIndex, newExternalRound);
    }

    // updates next players turn
    async updateRoundProcess() {
        let newPlayerIndex = this.updateRoom.evaluateMembersIndex(this.props.room.currentPlayerTurn, this.props.room.membersList.length);
        let newExternalRound = this.updateRoom.evaluateExternalRound(this.props.room.currentLeaderIndex, newPlayerIndex, this.props.room.roundNumber, this.props.room.roundEnd);
        await this.updateRoom.updateRoomRound("room", this.props.room.id, newPlayerIndex, newExternalRound);
    }

    // bot will update his own balance and the rooms pot
    async updateBotBalanceAndRoomPot() {
        let collectionPath = "room/" + this.props.room.id + "/members";
        let botId = this.props.room.membersList[this.props.room.currentPlayerTurn];
        let newPot = this.props.room.gamePot + this.state.returnedData.botBetAmount;
        await this.updatePlayer.updateWinningPlayersBalance(collectionPath, botId, this.state.returnedData.newTotalBalance);
        await this.updateRoom.updateRoomPot("room", this.props.room.id, newPot, this.state.returnedData.botBetAmount);
    }

    async updateBotFold() {
        await this.foldPlayersHand();
        await this.addPlayerFoldList();
    }

    // fold bots hand
    async foldPlayersHand() {
        let collectionPath = "room/" + this.props.room.id + "/members";
        this.updatePlayer.updatePlayerFoldCards(collectionPath, this.state.returnedData.uid)
    }

    // bot adds them self to folded list
    async addPlayerFoldList() {
        this.updateRoom.roomAddPlayerToFoldedList("room", this.props.room.id, this.state.returnedData.uid);
    }

    // switch case, check bots moves
    async checkBotMove() {
        switch (this.state.returnedData.botMove) {
            case "BET":
                console.log("SWITCH CASE: BOT IS BETTING", this.state.returnedData.name);
                await this.updateBettingRoundProcess();
                await this.updateBotBalanceAndRoomPot();
                break;
            case "CALL":
                await this.updateBettingRoundProcess();
                await this.updateBotBalanceAndRoomPot();
                break;
            case "FOLD":
                await this.updateBotFold();
                await this.updateRoundProcess();
                break;
            case "SKIP":
                // skip and check will act as the same action
                await this.updateBettingRoundProcess();
                break;
            default: 
            break;


        }
    }

    // set a post request to a flask api host on heroku
    // url: https://app-dev-project-rest-api.herokuapp.com/bot-move
    // post json data, expect json data returned
    async sendPostRequest() {
        await fetch(this.url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                    "name": this.state.botData[0].name,
                    "uid": this.state.botData[0].memberId,
                    "roomId": this.props.room.id,
                    "botType": this.state.botData[0].botType,
                    "balance": this.state.botData[0].balance,
                    "lastBetAmount": this.props.room.currentBettingAmount,
                    "roundNumber": this.props.room.roundNumber,
                    "cardLength": this.state.botData[0].cards.length,
                }
            )
        })
            .then(response => response.json())
            .then(data => this.setState({ returnedData: data, loading: false }));
        // console.log(this.state.returnedData);
    }

    render() {
        return (
            <div>
                {/* Buttons are for manual testing if the component mount does not work */}
                {/* <Button variant="contained" onClick={() => { this.sendPostRequest() }}>Send Post</Button>
                <Button variant="contained" onClick={() => { this.checkBotMove() }}>Check Bot Move</Button>
                <Button variant="contained" onClick={() => { this.getBotData(); }}>Get New Bot Data</Button> */}
                {this.state.loading ? <div><h3 class="saving">Waiting for bots response<span>.</span><span>.</span><span>.</span></h3><p>If bot does not respone in 5 seconds. Please try refreshing browser!</p></div> :
                    <div>
                        <p><b>POST REQUEST TO: {this.url}</b></p>
                        <p>name: {this.state.returnedData.name}</p>
                        <p>uid: {this.state.returnedData.uid}</p>
                        <p>roomId: {this.state.returnedData.roomId}</p>
                        <p>botType: {this.state.returnedData.botType}</p>
                        <p>newTotalBalance: {this.state.returnedData.newTotalBalance}</p>
                        <p>botMove: {this.state.returnedData.botMove}</p>
                        <p>botBetAmount: {this.state.returnedData.botBetAmount}</p>
                    </div>
                }
            </div>
        );
    }
}

export default BotAPI;

import React from 'react';
import { Grid } from '@material-ui/core';
import GameBet from './GameBet';
import GameCall from './GameCall';
import GameFold from './GameFold';
import GameCheck from './GameCheck';
import GameSwapCards from './GameEndSwapCards';
import GameNextTurn from './GameNextTurn';
import GameReturnName from './GameReturnName';

class GameUtils extends React.Component {

    render() {
        return (
            this.props.room.foldedMembers.includes(this.props.currentUser.uid) && this.props.room.membersList[this.props.room.currentPlayerTurn] === this.props.currentUser.uid ?
                <GameNextTurn room={this.props.room} members={this.props.members} currentUser={this.props.currentUser} /> :
                this.props.members.cards.length === 0 && this.props.members.balance === 0 && this.props.room.membersList[this.props.room.currentPlayerTurn] === this.props.currentUser.uid ?
                    <GameNextTurn room={this.props.room} members={this.props.members} currentUser={this.props.currentUser} /> :
                    this.props.room.roundNumber !== 4 && this.props.room.membersList.length - this.props.room.foldedMembers.length !== 1 ?
                        this.props.room.membersList[this.props.room.currentPlayerTurn] === this.props.currentUser.uid ?
                            this.props.room.roundNumber !== 2 ?
                                <Grid container spacing={3}>
                                    <Grid item xs={4}>
                                        <GameBet room={this.props.room} members={this.props.members} currentUser={this.props.currentUser} />
                                    </Grid>

                                    {this.props.room.currentBettingAmount > 0 && this.props.members.lastBetAmount !== this.props.room.currentBettingAmount ?
                                        <Grid item xs={4}>
                                            <GameCall room={this.props.room} members={this.props.members} currentUser={this.props.currentUser} />
                                        </Grid>
                                        :
                                        <Grid item xs={4}>
                                            <GameCheck room={this.props.room} members={this.props.members} currentUser={this.props.currentUser} />
                                        </Grid>
                                    }
                                    {this.props.room.membersList[this.props.room.currentPlayerTurn] === this.props.currentUser.uid && this.props.members.balance === 0 && this.props.room.currentBettingAmount > 0 ?
                                        <Grid item xs={6}>
                                            <GameCheck room={this.props.room} members={this.props.members} currentUser={this.props.currentUser} />
                                        </Grid>
                                        : null}
                                    <Grid item xs={4}>
                                        <GameFold room={this.props.room} members={this.props.members} currentUser={this.props.currentUser} />
                                    </Grid>
                                </Grid>
                                :
                                this.props.room.membersList[this.props.room.currentPlayerTurn] === this.props.currentUser.uid ?
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <h3>Swap Cards</h3><GameSwapCards view="myView" room={this.props.room} members={this.props.members} currentUser={this.props.currentUser} />
                                        </Grid>
                                    </Grid>
                                    : <h3 class="saving" style={{ marginTop: "20px", fontSize: "20px" }}>Wait for your turn to swap<span>.</span><span>.</span><span>.</span></h3>
                            : <h3 class="saving" style={{ marginTop: "20px", fontSize: "20px" }}><GameReturnName room={this.props.room} memberId={this.props.room.membersList[this.props.room.currentPlayerTurn]} /> turn, please wait<span>.</span><span>.</span><span>.</span></h3>
                        : null

        );
    }
}

export default GameUtils;

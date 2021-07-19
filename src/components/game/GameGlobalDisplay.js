import React from 'react';
import { Container, Grid, Paper } from '@material-ui/core';
import { FirestoreCollection } from 'react-firestore';
import GameWinnerEvaluation from './GameWinnerEvaluation';
import GameReturnName from './GameReturnName';

class GameGlobalDisplay extends React.Component {

    render() {
        let myViewSize = 12;
        return (
            <Container maxWidth="lg">
                <FirestoreCollection
                    path={"room/" + this.props.room.id + "/members"}
                    filter={this.props.view === "myView" ? [["memberId", "==", this.props.currentUser.uid]] : [["memberId", "!=", this.props.currentUser.uid]]}
                    render={({ isLoading, data }) => {
                        return isLoading ? (
                            <p>Loading...</p>
                        ) : (
                            <Grid container spacing={3}>
                                {data.map(members => (
                                    <Grid item xs={
                                        this.props.view === "myView" ? myViewSize :
                                            this.calculateSpacing(this.props.room.membersList.length)
                                    }>
                                        <Paper elevation={3} style={{ padding: "50px" }}>
                                            {this.props.room.membersList.length - this.props.room.foldedMembers.length !== 1 ?
                                                this.props.room.roundNumber !== 4 ?
                                                    this.props.currentUser.uid === members.memberId ?
                                                        <Grid container spacing={3}>
                                                            <Grid item xs={4}>
                                                                Current Turn: <GameReturnName room={this.props.room} memberId={this.props.room.membersList[this.props.room.currentPlayerTurn]} />
                                                            </Grid>
                                                            <Grid item xs={4}>
                                                                Room POT: ${this.props.room.gamePot}
                                                            </Grid>
                                                            <Grid item xs={4}>
                                                                <div>Total Rounds: {this.props.room.roundNumber} / {this.props.room.roundEnd}</div>
                                                            </Grid>
                                                        </Grid>
                                                        :
                                                        null
                                                    : <GameWinnerEvaluation room={this.props.room} currentUser={this.props.currentUser} members={members} />
                                                : <GameWinnerEvaluation room={this.props.room} currentUser={this.props.currentUser} members={members} />
                                            }
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        );
                    }
                    }
                />
            </Container>
        );
    }
}

export default GameGlobalDisplay;

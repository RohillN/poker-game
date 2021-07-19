import React from 'react';
import { Container, Grid, Paper } from '@material-ui/core';
import { FirestoreCollection } from 'react-firestore';
import DealCards from './DealCards';
import GameSwapCards from './GameSwapCards';
import GameStop from './GameStop';
import GameUtils from './GameUtils';
import Alerts from '../Alerts';

class PlayerLayout extends React.Component {

    calculateSpacing(playNumbers) {
        switch (playNumbers) {
            case 3:
                return 6;
            case 4:
                return 4;
            case 5:
                return 3;
            default:
                return 12;
        }
    }

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
                                            {this.props.currentUser.uid === members.memberId ?
                                                <div>
                                                    {this.props.room.membersList[this.props.room.currentPlayerTurn] === this.props.currentUser.uid ? <div style={{ marginBottom: "50px" }} class="pulse blue circle"></div> : null}
                                                    {this.props.room.roundNumber === 2 && this.props.room.membersList[this.props.room.currentPlayerTurn] === this.props.currentUser.uid ? <Container maxWidth="md" style={{ marginTop: "50px" }}><Alerts type="info" msg="Hover over the cards to swap" /></Container> : null}
                                                    <GameUtils room={this.props.room} members={members} currentUser={this.props.currentUser} />
                                                    {members.deltCards ? <div>
                                                        {members.cards.map((item, index) => (
                                                            <GameSwapCards room={this.props.room} members={members} currentUser={this.props.currentUser} cardIndex={index} rank={item.rank} suit={item.suit} />
                                                        ))}
                                                        <Grid style={{ marginTop: "20px" }} container spacing={3}>
                                                            <Grid item xs={4}>
                                                                <GameStop room={this.props.room} currentUser={this.props.currentUser} />
                                                            </Grid>
                                                            <Grid item xs={4}>
                                                            </Grid>
                                                            <Grid item xs={4}>
                                                                <Paper elevation={3}>Balance: ${members.balance}</Paper>
                                                            </Grid>
                                                        </Grid>
                                                    </div> : null}
                                                </div>
                                                :
                                                <div>
                                                    {this.props.room.membersList[this.props.room.currentPlayerTurn] === members.memberId ? <div style={{ marginBottom: "20px" }} class="pulse blue circle"></div> : null}
                                                    <p>Name: {members.name}</p>
                                                    <p>Balance: ${members.balance}</p>
                                                    {members.deltCards ? <div>
                                                        {members.cards.map((item, index) => (
                                                            <GameSwapCards room={this.props.room} members={members} currentUser={this.props.currentUser} cardIndex={10} rank={this.props.room.roundNumber !== 4 ? "card" : item.rank} suit={this.props.room.roundNumber !== 4 ? "Back" : item.suit} />
                                                        ))}
                                                    </div> : null}
                                                </div>
                                            }
                                            {!members.deltCards && !members.hasFolded && members.balance > 0 ? <DealCards members={members} room={this.props.room} /> : null}
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

export default PlayerLayout;

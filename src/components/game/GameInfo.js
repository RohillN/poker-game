import React from 'react';
import { Accordion, AccordionSummary, Typography, AccordionDetails, Grid } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// provides information at game menu 
// information include, what you can do in game menu
// information about how the game will run
class GameInfo extends React.Component {
    render() {
        return (
            <div style={{ margin: "50px" }}>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography>Rules &amp; Information</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={1}>
                            <Grid style={{ textAlign: "left" }} item xs={6}>
                                <p><b>Game Menu</b></p>
                                <ul>
                                    <li>Need 3 or more players to start game.</li>
                                    <li>Only room owner can start the game.</li>
                                    <li>Only room owner can add / remove bots to game.</li>
                                    <li>Bots are random, Bluffer, Risker, Conservative.</li>
                                    <li>If room owner leaves game, game will be deleted and members will be removed.</li>
                                </ul>
                            </Grid>
                            <Grid style={{ textAlign: "left" }} item xs={6}>
                                <p><b>Game</b></p>
                                <ul>
                                    <li>On load, all players will be given five cards</li>
                                    <li>Total of four internal rounds, playing for ten total rounds... (4 internal rounds = 1 full round)</li>
                                    <li>1. First round, players can bet, check, call or fold.</li>
                                    <li>2. Second round, after initial betting, players can choose to swap cards.</li>
                                    <li>3. Thrid round, players can only bet, check, call or fold</li>
                                    <li>4. Last round, all players hands will be evaluated and a winner will be decided.</li>
                                    <li>Game will reset, go to rule 1.</li>
                                </ul>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </div>
        );
    }
}

export default GameInfo;

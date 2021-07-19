import React from 'react';
import { Button } from '@material-ui/core';
import * as AiIcons from 'react-icons/ai';
import UpdateRoom from './UpdateRoom';
import UpdatePlayer from './UpdatePlayer';

class GameFold extends React.Component {
    constructor(props) {
        super(props);
        this.iconSize = 20;
        this.updateRoom = new UpdateRoom();
        this.updatePlayer = new UpdatePlayer();
    }

    // update and remove players cards when fold
    async foldPlayersHand() {
        let collectionPath = "room/" + this.props.room.id + "/members";
        this.updatePlayer.updatePlayerFoldCards(collectionPath, this.props.members.memberId)
    }

    async addPlayerFoldList() {
        this.updateRoom.roomAddPlayerToFoldedList("room", this.props.room.id, this.props.currentUser.uid);
    }

    async roundUpdate() {
        // after change to next player and add round
        let newPlayerIndex = this.updateRoom.evaluateMembersIndex(this.props.room.currentPlayerTurn, this.props.room.membersList.length);
        let newExternalRound = this.updateRoom.evaluateExternalRound(this.props.room.currentLeaderIndex, newPlayerIndex, this.props.room.roundNumber, this.props.room.roundEnd);
        if (this.props.room.membersList.length === this.props.room.foldedMembers.length) {
            await this.updateRoom.updateRoomRound("room", this.props.room.id, 0, 4);
        } else {
            await this.updateRoom.updateRoomRound("room", this.props.room.id, newPlayerIndex, newExternalRound);
        }
    }

    async foldTrigger() {
        await this.foldPlayersHand();
        await this.addPlayerFoldList();
        await this.roundUpdate();
    }

    render() {
        return (
            <Button data-testid="fold-button" style={{ margin: 5, color: "#86C232", backgroundColor: "#1F2833" }} onClick={() => { this.foldTrigger() }} size="small" variant="contained" color="primary" >Fold <AiIcons.AiOutlineStop size={this.iconSize} style={{ marginLeft: "10px", color: "#86C232" }} className="content" /></Button>
        );
    }
}

export default GameFold;

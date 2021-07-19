import React from 'react';
import { Button } from '@material-ui/core';
import CommonRoomMethods from '../room/CommonRoomMethods';
import * as FiIcons from 'react-icons/fi';

class GameAddBot extends React.Component {
    constructor(props) {
        super(props);
        this.commonRoomMethods = new CommonRoomMethods();
        this.iconSize = 20;
    }

    generateBotId() {
        let idLength = 5;
        let charset = "abcdefghijklmnopqrstuvwxyz0123456789";
        let randomId = "";

        for (let i = 0; i < idLength; i++) {
            randomId += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        return randomId;
    }

    async addBotProcess(roomId) {
        let randomBotType = Math.floor(Math.random() * 3);
        let botTypes = ["bluffer", 'risker', 'conservative']
        let botRandomId = this.generateBotId();
        let botId = `bot-${botRandomId}-${botTypes[randomBotType]}`;
        await this.commonRoomMethods.addMemberToRoomSubCollection(roomId, botId, "bot", botId, botTypes[randomBotType]);
        await this.commonRoomMethods.addRoomListToUser("membersList", "", "room", roomId, botId);
    }

    render() {
        return (
            <Button data-testid="add-bot-button" style={{ margin: 5, color: "#86C232", backgroundColor: "#1F2833" }} onClick={() => { this.addBotProcess(this.props.room.id) }} size="small" variant="contained" color="primary" >Add Bot <FiIcons.FiPlus size={this.iconSize} style={{ marginLeft: "10px", color: "#86C232" }} className="content" /></Button>
        );
    }
}

export default GameAddBot;

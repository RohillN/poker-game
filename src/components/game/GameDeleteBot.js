import React from 'react';
import { Button } from '@material-ui/core';
import { FirestoreCollection } from 'react-firestore';
import CommonRoomMethods from '../room/CommonRoomMethods';
import * as TiIcons from 'react-icons/ti';

class GameDeleteBot extends React.Component {
    constructor(props) {
        super(props);
        this.commonRoomMethods = new CommonRoomMethods();
        this.handleChange = this.handleChange.bind(this);
        this.iconSize = 20;
        this.state = {
            botValue: 0
        }
    }

    handleChange(e) {
        this.setState({ botValue: e.target.value });
    }

    async combinedRemoveBot(roomId, botToDel) {
        let path = "room/" + roomId + "/members";
        await this.commonRoomMethods.removeItemFromCollection(path, botToDel, botToDel);
        await this.commonRoomMethods.removeRoomListFromUser("membersList", "room", roomId, botToDel);
    }

    render() {
        return (
            <div>
                <FirestoreCollection
                    path={"room/" + this.props.room.id + "/members"}
                    render={({ isLoading, data }) => {
                        return isLoading ? (
                            <p>Loading...</p>
                        ) : (
                            <div>
                                {data.map(members => (
                                    <div key={members.id}>
                                        {members.type === "bot" ? <Button style={{ margin: 5, color: "#45A29E", backgroundColor: "#1F2833", fontSize: "12px", padding: "10px" }} onClick={() => {this.combinedRemoveBot(this.props.room.id, members.id)}} size="small" variant="contained" color="secondary">{members.name} <TiIcons.TiDelete size={this.iconSize} style={{marginLeft: "10px"}} className="content" /></Button> : null }
                                    </div>
                                ))}
                            </div>
                        );
                    }}
                />
            </div>
        );
    }
}

export default GameDeleteBot;

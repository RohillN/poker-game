import React from 'react';
import { FirestoreCollection } from 'react-firestore';
import { Button } from '@material-ui/core';
import CommonRoomMethods from './CommonRoomMethods';
import * as IoIcons from 'react-icons/io';

class RoomSearchLeave extends React.Component {
    constructor(props) {
        super(props);
        this.iconSize = 20;
        this.commonRoomMethods = new CommonRoomMethods();
    }

    async combinedRemoveMemberUpdateUser(roomId) {
        let path = "room/" + roomId + "/members";
        await this.commonRoomMethods.removeItemFromCollection(path, this.props.currentUserId, roomId);
        await this.commonRoomMethods.removeRoomListFromUser("membersList", "room", roomId, this.props.currentUserId);
        await this.commonRoomMethods.removeRoomListFromUser("currentRoom", "user", this.props.currentUserId, roomId);
    }

    render() {
        return (
            <div>
                <FirestoreCollection
                    path={"room/" + this.props.room.id + "/members"}
                    filter={['memberId', '==', this.props.currentUserId]}
                    render={({ isLoading, data }) => {
                        return isLoading ? (
                            <p>Loading...</p>
                        ) : (
                            <div>
                                {data.map(member => (
                                    <div>
                                        {member.memberId ? <Button style={{ margin: 5, color: "#45A29E", backgroundColor: "#1F2833" }} onClick={() => this.combinedRemoveMemberUpdateUser(this.props.room.id)} key={"buttonRoom-Leave-" + this.props.roomid} size="small" variant="contained" color="secondary">Leave <IoIcons.IoMdExit size={this.iconSize} style={{marginLeft: "10px"}} className="content" /></Button> : null}
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

export default RoomSearchLeave;

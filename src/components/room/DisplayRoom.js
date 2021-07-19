import React from 'react';
import { FirestoreCollection } from 'react-firestore';
import firebase from '@firebase/app';
import 'firebase/auth';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, withStyles } from '@material-ui/core';
import RoomSearchLeave from './RoomSearchLeave';
import RoomSearchDisplayMembers from './RoomSearchDisplayMembers';
import RoomSearchJoin from './RoomSearchJoin';

const contentColor = "#45A29E";

const styles = {
  tableHeaders: {
    color: contentColor,
    fontSize: "16px",
  },
  tableRows: {
    color: contentColor,
    fontSize: "14px",
  }
};

class DisplayRoom extends React.Component {
  constructor(props) {
    super(props);
    this.iconSize = 20;
    this.currentUser = firebase.auth().currentUser;
  }


  render() {
    const { classes } = this.props;
    return (
      <TableContainer component={Paper} style={{ marginTop: 50, backgroundColor: "#222629" }}>
        <Table aria-label="membersTable" size="small" >
          <TableHead>
            <TableRow>
              <TableCell classes={{ root: classes.tableHeaders }} >Room Name</TableCell>
              <TableCell classes={{ root: classes.tableHeaders }} align="right">Owner</TableCell>
              <TableCell classes={{ root: classes.tableHeaders }} align="right">Created On</TableCell>
              <TableCell classes={{ root: classes.tableHeaders }} align="right">Members</TableCell>
              <TableCell classes={{ root: classes.tableHeaders }} align="right">Leave</TableCell>
              <TableCell classes={{ root: classes.tableHeaders }} align="right">Join</TableCell>
            </TableRow>
          </TableHead>
          <FirestoreCollection
            path="room"
            filter={[["roomOwnerId", "!=", this.currentUser.uid]]}
            render={({ isLoading, data }) => {
              return isLoading ? (
                <p>Loading...</p>
              ) : (
                <TableBody>
                  {data.map(room => (
                    <TableRow key={room.id}>
                      <TableCell classes={{ root: classes.tableRows }} component="th" scope="row">{room.roomName}</TableCell>
                      <TableCell classes={{ root: classes.tableRows }} align="right">{room.roomOwnerName}</TableCell>
                      <TableCell classes={{ root: classes.tableRows }} align="right">{room.date}</TableCell>
                      <TableCell classes={{ root: classes.tableRows }} align="right"><RoomSearchDisplayMembers currentUserId={this.currentUser.uid} room={room} /></TableCell>
                      <TableCell classes={{ root: classes.tableRows }} align="right"><RoomSearchLeave currentUserId={this.currentUser.uid} room={room} /></TableCell>
                      <TableCell classes={{ root: classes.tableRows }} align="right"><RoomSearchJoin currentUserId={this.currentUser.uid} room={room}/></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              );
            }}
          />
        </Table>
      </TableContainer>
    );
  }
}

export default withStyles(styles)(DisplayRoom);

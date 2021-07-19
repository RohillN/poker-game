import React from 'react';
import UpdateRoom from './UpdateRoom';

class GameNextTurn extends React.Component {
  constructor(props) {
    super(props);
    this.updateRoom = new UpdateRoom();
  }

  async componentDidMount() {
    await this.updateRound();
  }

  async updateRound() {
    // after change to next player and add round
    let newPlayerIndex = this.updateRoom.evaluateMembersIndex(this.props.room.currentPlayerTurn, this.props.room.membersList.length);
    let newExternalRound = this.updateRoom.evaluateExternalRound(this.props.room.currentLeaderIndex, newPlayerIndex, this.props.room.roundNumber, this.props.room.roundEnd);
    await this.updateRoom.updateRoomRound("room", this.props.room.id, newPlayerIndex, newExternalRound);
  }

render() {
  return (
    <p>You have folded...</p>
  );
}
}

export default GameNextTurn;

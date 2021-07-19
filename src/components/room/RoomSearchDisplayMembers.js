import React from 'react';
import { FirestoreCollection } from 'react-firestore';

class RoomSearchDisplayMembers extends React.Component {
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
                {data.map(member => (
                  <div>
                  {member.id === this.props.currentUserId ? <p key={member.id}>{member.name} (Me)</p> : <p key={member.id}>{member.name}</p>}
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

export default RoomSearchDisplayMembers;
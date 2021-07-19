import React from 'react';
import { FirestoreCollection } from 'react-firestore';

class GameReturnName extends React.Component {

    // return players name
    render() {
        return (
            <FirestoreCollection
                path={"room/" + this.props.room.id + "/members"}
                filter={[["memberId", "==", this.props.memberId]]}
                render={({ isLoading, data }) => {
                    return isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        data.map(member => (
                            member.name
                        ))
                    );
                }
                }
            />
        );
    }
}

export default GameReturnName;

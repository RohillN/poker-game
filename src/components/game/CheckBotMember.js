import React from 'react';
import { Container } from '@material-ui/core';
import { FirestoreCollection } from 'react-firestore';
import BotAPI from './BotAPI';

class CheckBotMember extends React.Component {

    render() {
        return (
            <Container maxWidth="lg">
                <FirestoreCollection
                    path={"room/" + this.props.room.id + "/members"}
                    filter={[["memberId", "!=", this.props.currentUser.uid]]}
                    render={({ isLoading, data }) => {
                        return isLoading ? (
                            <p>Loading...</p>
                        ) : (
                            <div container spacing={3}>
                                {data.map(members => (
                                    <div>
                                        {this.props.room.membersList[this.props.room.currentPlayerTurn] === members.memberId && members.type === "bot" ? <BotAPI room={this.props.room} /> : null}
                                    </div>
                                ))}
                            </div>
                        );
                    }
                    }
                />
            </Container>
        );
    }
}

export default CheckBotMember;

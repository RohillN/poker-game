import React from 'react';
import firebase from '@firebase/app';
import '@firebase/firestore';
import 'firebase/auth';

class DealCards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deck: this.props.room.deck
        }
        this.totalCards = 5
        this.db = firebase.firestore();
    }

    async componentDidMount() {
        await this.membersCards();
        await this.updateDeckOfCards();
    }

    drawCards() {
        let processDeck = this.state.deck;
        let playersHard = [];
        console.log(`Cards for player: ${this.props.name}`);
        for (let i = 0; i < this.totalCards; i++) {
            let lastCard = processDeck.length - 1;
            let giveCard = processDeck[lastCard];
            playersHard.push(giveCard);
            processDeck.pop();
        }
        this.setState({deck: processDeck});
        return playersHard;
    }

    // update a rooms deck of cards
    async updateDeckOfCards() {
        await this.db.collection("room").doc(this.props.room.id).update({
            deck: this.state.deck,
        })
    }

    // update members sub-collection of cards
    async membersCards() {
        let drawCards = this.drawCards();
        await this.db.collection("room/" + this.props.room.id + "/members").doc(this.props.members.id).update({
            cards: drawCards,
            deltCards: true,
        });
    }

    render() {
        return (
            <div>
                <p>Deal cards To this member</p>
            </div>
        );
    }
}

export default DealCards;

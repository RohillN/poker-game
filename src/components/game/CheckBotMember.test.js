import React from "react"
import ReactDOM from 'react-dom';
import CheckBotMember from "./CheckBotMember";
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom/extend-expect";

import { FirestoreProvider } from 'react-firestore';
import { firebaseApp } from '../../FirebaseConfig';
import firebase from '@firebase/app';

let container = null;
beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

test("Render check bot members with props", () => {
    firebase.initializeApp(firebaseApp);
    act(() => {
        let roomId = { id: "aNSNGAjKHUYePD4akvJo" }
        let userId = { uid: "jt4P0jVIq3Pek6R5i2CzmxBi6dp2" };
        ReactDOM.render(<FirestoreProvider firebase={firebase}><CheckBotMember room={roomId} currentUser={userId} /></FirestoreProvider>, container);
    });
});

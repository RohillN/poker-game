import React from "react"
import ReactDOM from 'react-dom';
import RoomSearchLeave from "./RoomSearchLeave";
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

test("render Room leave button component without crashing, while passing room and user props", () => {
  firebase.initializeApp(firebaseApp);
  act(() => {
    let roomId = { id: "aNSNGAjKHUYePD4akvJo" }
    let userId = "jt4P0jVIq3Pek6R5i2CzmxBi6dp2";
    ReactDOM.render(<FirestoreProvider firebase={firebase}><RoomSearchLeave room={roomId} currentUserId={userId} /></FirestoreProvider>, container);
  });
});

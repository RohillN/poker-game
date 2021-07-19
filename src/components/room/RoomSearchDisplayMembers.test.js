import React from "react"
import ReactDOM from 'react-dom';
import RoomSearchDisplayMembers from "./RoomSearchDisplayMembers";
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom/extend-expect";

import { firebaseApp } from '../../FirebaseConfig';
import { FirestoreProvider } from 'react-firestore';
import firebase from '@firebase/app';
import '@firebase/firestore';
import 'firebase/auth';

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

test("render room display members without crashing, while passing room and user props", () => {
  firebase.initializeApp(firebaseApp);
  act(() => {
    let roomId = {id: "aNSNGAjKHUYePD4akvJo"}
    let userId = "jt4P0jVIq3Pek6R5i2CzmxBi6dp2";
    ReactDOM.render(<FirestoreProvider firebase={firebase}><RoomSearchDisplayMembers room={roomId} currentUserId={userId} /></FirestoreProvider>, container);
  });
});

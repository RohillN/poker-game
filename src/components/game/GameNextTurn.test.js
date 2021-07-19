import React from "react"
import ReactDOM from 'react-dom';
import GameNextTurn from "./GameNextTurn";
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom/extend-expect";

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

test("render game next turn component without crashing", () => {
  firebase.initializeApp(firebaseApp);
  let roomData = {currentBettingAmount: 5, membersList: [0, 1, 2], currentPlayerTurn: 0, currentLeaderIndex: 0, roundNumber: 0, roundEnd: 0}
  let memberData = {balance: 100}
  act(() => {
    ReactDOM.render(<GameNextTurn room={roomData} members={memberData} />, container);
  });
});
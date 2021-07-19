import React from "react"
import ReactDOM from 'react-dom';
import { render, fireEvent } from '@testing-library/react';
import GameDeleteBot from "./GameDeleteBot";
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

test("render bot delete component without crashing", () => {
  firebase.initializeApp(firebaseApp);
  let roomData = {currentBettingAmount: 5}
  let memberData = {balance: 100}
  act(() => {
    ReactDOM.render(<FirestoreProvider firebase={firebase}><GameDeleteBot room={roomData} members={memberData} /></FirestoreProvider>, container);
  });
});
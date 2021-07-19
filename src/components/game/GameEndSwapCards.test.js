import React from "react"
import ReactDOM from 'react-dom';
import { render, fireEvent } from '@testing-library/react';
import GameEndSwapCards from "./GameEndSwapCards";
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

test("render game end swap cards component without crashing", () => {
  firebase.initializeApp(firebaseApp);
  let roomData = {currentBettingAmount: 5}
  let memberData = {balance: 100}
  act(() => {
    ReactDOM.render(<FirestoreProvider firebase={firebase}><GameEndSwapCards room={roomData} members={memberData} /></FirestoreProvider>, container);
  });
});

test("find check button, check button label and is clickable", () => {
  act(() => {
    let roomData = {currentBettingAmount: 5}
    let memberData = {balance: 100}
    const { getByTestId } = render(<GameEndSwapCards room={roomData} members={memberData} />, container);
    const endCardSwap = getByTestId("end-swap-cards");
    expect(endCardSwap).toHaveTextContent("Finish Card Exchange");
    expect(endCardSwap.getAttribute("disabled")).toBe(null);  // button is clickable
  });
});
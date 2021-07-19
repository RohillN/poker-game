import React from "react"
import ReactDOM from 'react-dom';
import { render, fireEvent } from '@testing-library/react';
import GameAddBot from "./GameAddBot";
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

test("render bot add component without crashing", () => {
  firebase.initializeApp(firebaseApp);
  act(() => {
    ReactDOM.render(<FirestoreProvider firebase={firebase}><GameAddBot /></FirestoreProvider>, container);
  });
});

test("find add bot button, check button label and is clickable", () => {
  act(() => {
    const { getByTestId } = render(<GameAddBot />, container);
    const botAdd = getByTestId("add-bot-button");
    expect(botAdd).toHaveTextContent("Add Bot");
    expect(botAdd.getAttribute("disabled")).toBe(null);  // button is clickable
  });
});
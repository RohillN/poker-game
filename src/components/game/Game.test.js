import React from "react"
import ReactDOM from 'react-dom';
import Game from "./Game";
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

test("render game component without crashing", () => {
    act(() => {
        ReactDOM.render(<Game />, container);
    });
});

test("render game check if join room before joinning text appears", () => {
    act(() => {
        let textExpect = "You need to join a room before playing!"
        ReactDOM.render(<Game />, container);
        expect(container.textContent).toBe(textExpect);
    });
});

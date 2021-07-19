import React from "react"
import ReactDOM from 'react-dom';
import { render, fireEvent } from '@testing-library/react';
import Alerts from "./Alerts";
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom/extend-expect";

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

test("render Alerts component without crashing, no props", () => {
    act(() => {
        ReactDOM.render(<Alerts />, container);
    });
});

test("render Alerts component with text props and type props", () => {
    act(() => {
        const textInput = "testing alert with props";
        ReactDOM.render(<Alerts type="info" msg="testing alert with props" />, container);
        expect(container.textContent).toBe(textInput);
    });
});

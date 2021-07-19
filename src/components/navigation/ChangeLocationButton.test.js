import React from "react"
import ReactDOM from 'react-dom';
import { render, fireEvent } from '@testing-library/react';
import ChangeLocationButton from "./ChangeLocationButton";
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

test("render ChangeLocationButton component without crashing, no props", () => {
    act(() => {
        ReactDOM.render(<ChangeLocationButton />, container);
    });
});

test("render ChangeLocationButton component with text props", () => {
    act(() => {
        const textInput = "Click to change location";
        ReactDOM.render(<ChangeLocationButton text={textInput} />, container);
        expect(container.textContent).toBe(textInput);
    });
});

test("render ChangeLocationButton component with text and location props", () => {
    act(() => {
        const textInput = "Click to change location";
        const locationInput = "/home";
        ReactDOM.render(<ChangeLocationButton location={locationInput} text={textInput} />, container);
        expect(container.textContent).toBe(textInput);

        const button = document.querySelector("[data-testid='change-location-button']");
        expect(button.innerHTML).toBe(`<span class=\"MuiButton-label\">${textInput}</span>`);
        expect(button.getAttribute("disabled")).toBe(null);  // button is clickable

    });
});

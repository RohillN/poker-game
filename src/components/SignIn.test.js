import React from "react"
import ReactDOM from 'react-dom';
import { render, fireEvent } from '@testing-library/react';
import SignIn from "./SignIn";
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


test("render sign in component without crashing", () => {
  act(() => {
    ReactDOM.render(<SignIn />, container);
  });
});

test("find and check sign in title", () => {
  act(() => {
    const { getByTestId } = render(<SignIn />, container);
    expect(getByTestId("sign-in-title")).toHaveTextContent("Login");
  });
});

test("find and check text fields in form", () => {
  act(() => {
    const { getByTestId } = render(<SignIn />, container);
    expect(getByTestId("sign-in-email-field")).toHaveTextContent("Email Address *Email Address *");
    expect(getByTestId("sign-in-password-field")).toHaveTextContent("Password *Password *");
  });
});


test("find all buttons in form and check if they are clickable", () => {
  act(() => {
    const { getByTestId } = render(<SignIn />, container);

    const emailButton = getByTestId("sign-in-email-button");
    const googleButton = getByTestId("sign-in-google-button");
    const guestButton = getByTestId("sign-in-guest-button");
        
    expect(emailButton).toHaveTextContent("Login");
    expect(googleButton).toHaveTextContent("Google");
    expect(guestButton).toHaveTextContent("Guest");

    expect(emailButton.getAttribute("disabled")).toBe(null);  // button is clickable
    expect(googleButton.getAttribute("disabled")).toBe(null); // button is clickable
    expect(guestButton.getAttribute("disabled")).toBe(null);  // button is clickable

    // throws errors, need to check if firebase is initializeApp, if feilds are not null etc etc.. 
    // fireEvent.click(emailButton);
    // fireEvent.click(googleButton);
    // fireEvent.click(guestButton);
  });
});
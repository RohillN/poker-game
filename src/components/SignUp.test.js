import React from "react"
import ReactDOM from 'react-dom';
import { render, fireEvent } from '@testing-library/react';
import SignUp from "./SignUp";
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
    ReactDOM.render(<SignUp />, container);
  });
});

test("find and check sign in title", () => {
  act(() => {
    const { getByTestId } = render(<SignUp />, container);
    expect(getByTestId("sign-up-title")).toHaveTextContent("Register");
  });
});

test("find and check text fields in form", () => {
  act(() => {
    const { getByTestId } = render(<SignUp />, container);
    expect(getByTestId("sign-in-displayname-field")).toHaveTextContent("Display Name *Display Name *");
    expect(getByTestId("sign-in-email-field")).toHaveTextContent("Email Address *Email Address *");
    expect(getByTestId("sign-in-password-field")).toHaveTextContent("Password *Password *");
  });
});


test("find all buttons in form and check if they are clickable", () => {
  act(() => {
    const { getByTestId } = render(<SignUp />, container);
    const registerButton = getByTestId("sign-up-register-button");
    expect(registerButton).toHaveTextContent("Register");
    expect(registerButton.getAttribute("disabled")).toBe(null);  // button is clickable
  });
});
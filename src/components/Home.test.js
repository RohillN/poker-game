import React from "react"
import ReactDOM from 'react-dom';
import { render, fireEvent } from '@testing-library/react';
import Home from "./Home";
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


test("render home component without crashing", () => {
  act(() => {
    ReactDOM.render(<Home />, container);
  });
});

test("find home component title", () => {
  act(() => {
    const { getByTestId } = render(<Home />, container);
    expect(getByTestId("title")).toHaveTextContent("Home Page");
  });
});
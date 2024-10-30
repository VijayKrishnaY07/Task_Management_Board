import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

// Basic Unit test case : Check if App renders without crashing
test("renders App without crashing", () => {
  render(<App />);
  expect(screen.getByText(/Task Management Board/i)).toBeInTheDocument();
});

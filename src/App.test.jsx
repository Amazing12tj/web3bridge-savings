import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the dashboard title", () => {
  render(<App />);
  expect(screen.getByText(/Savings Group Dashboard/i)).toBeInTheDocument();
});

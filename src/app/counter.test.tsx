import {fireEvent, render, screen} from "@testing-library/react";

import {Counter} from "./counter";

it("Test counter", () => {
  render(<Counter />);
  expect(screen.getByRole("heading")).toHaveTextContent("0");
  fireEvent.click(screen.getByRole("button"));
  expect(screen.getByRole("heading")).toHaveTextContent("1");
});

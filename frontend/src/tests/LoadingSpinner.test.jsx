import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LoadingSpinner from "../components/common/LoadingSpinner";

describe("LoadingSpinner Component", () => {
  it("should render the spinner", () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("should render fullscreen spinner", () => {
    render(<LoadingSpinner fullScreen />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });
});
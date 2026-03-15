import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import EMICalculator from "../components/customer/EMICalculator";

describe("EMICalculator Component", () => {
    it("should render the EMI calculator", () => {
        render(<EMICalculator />);
        expect(
            screen.getByText(/emi calculator/i)
        ).toBeInTheDocument();
    });

    it("should calculate EMI when values are entered", () => {
        render(<EMICalculator />);
        fireEvent.change(
            screen.getByPlaceholderText(/e.g. 100000/i),
            { target: { value: "100000" } }
        );
        fireEvent.change(
            screen.getByPlaceholderText(/e.g. 8.5/i),
            { target: { value: "10" } }
        );
        fireEvent.change(
            screen.getByPlaceholderText(/e.g. 12/i),
            { target: { value: "12" } }
        );
        fireEvent.click(screen.getByText(/calculate/i));
        expect(screen.getByText(/monthly emi/i)).toBeInTheDocument();
    });

    it("should not calculate if fields are empty", () => {
        render(<EMICalculator />);
        fireEvent.click(screen.getByText(/calculate/i));
        expect(screen.queryByText(/monthly emi/i)).not.toBeInTheDocument();
    });
});
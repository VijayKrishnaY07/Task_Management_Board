import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskBoard from "../Components/TaskBoard";
import { TaskContext } from "../context/TaskContext";

// Mock functions from TaskContext
const mockAddColumn = jest.fn();
const mockEditColumnName = jest.fn();
const mockDeleteColumn = jest.fn();

const mockColumns = [
  {
    id: "1",
    name: "Column 1",
    tasks: [
      {
        id: "task1",
        name: "Task 1",
        assignedTo: "User",
        description: "Test task",
        deadline: new Date(),
      },
    ],
  },
  { id: "2", name: "Column 2", tasks: [] },
];

const renderTaskBoard = (customColumns = mockColumns) => {
  render(
    <TaskContext.Provider
      value={{
        columns: customColumns,
        addColumn: mockAddColumn,
        editColumnName: mockEditColumnName,
        deleteColumn: mockDeleteColumn,
      }}
    >
      <TaskBoard />
    </TaskContext.Provider>
  );
};

describe("TaskBoard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  // Test Case 1: Check if the TaskBoard renders correctly
  test("renders Task Management Board", () => {
    renderTaskBoard();
    expect(screen.getByText(/Task Management Board/i)).toBeInTheDocument();
  });

  // Test Case 2: Check if columns are rendered
  test("renders columns", () => {
    renderTaskBoard();
    expect(screen.getByText("Column 1")).toBeInTheDocument();
    expect(screen.getByText("Column 2")).toBeInTheDocument();
  });

  // Test Case 3: Check if deleteColumn is called when delete button is clicked
  test("calls deleteColumn when delete button is clicked", () => {
    renderTaskBoard();

    const deleteButton = screen.getAllByTestId("DeleteIcon")[0]; // Target using test ID
    fireEvent.click(deleteButton);

    expect(mockDeleteColumn).toHaveBeenCalledWith("1");
  });

  // Test Case 4: Check if TaskBoard shows a message when there are no columns
  test("shows message when no columns are available", () => {
    renderTaskBoard([]);
    expect(screen.getByText(/Task Management Board/i)).toBeInTheDocument();
    expect(screen.queryByText("Column 1")).not.toBeInTheDocument();
  });
});

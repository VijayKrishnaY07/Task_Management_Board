import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Task from "../Components/Task";
import { TaskContext } from "../context/TaskContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// Mock functions from TaskContext
const mockEditTask = jest.fn();
const mockDeleteTask = jest.fn();

const taskProps = {
  taskId: "task1",
  columnId: "column1",
};

// Mock columns with empty fields for testing default values
const mockColumns = [
  {
    id: "column1",
    name: "Column 1",
    tasks: [
      {
        id: "task1",
        name: "Test Task",
        assignedTo: "", // Empty assignedTo to check "Unassigned" default
        description: "", // Empty description to check "No description provided" default
        deadline: new Date(),
      },
    ],
  },
];

const renderTaskComponent = (props = {}) =>
  render(
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TaskContext.Provider
        value={{
          columns: mockColumns,
          editTask: mockEditTask,
          deleteTask: mockDeleteTask,
        }}
      >
        <Task {...taskProps} {...props} />
      </TaskContext.Provider>
    </LocalizationProvider>
  );

describe("Task Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test Case 1: Check if the task renders correctly with task details
  test("renders task with correct details", () => {
    renderTaskComponent();
    expect(screen.getByText(/Test Task/i)).toBeInTheDocument();
    expect(screen.getByText(/No description provided/i)).toBeInTheDocument();
    expect(screen.getByText(/Unassigned/i)).toBeInTheDocument();
  });

  // Test Case 2: Check if deleteTask function is called when delete button is clicked
  test("calls deleteTask when delete button is clicked", () => {
    renderTaskComponent();
    const deleteButton = screen.getByTestId("delete-button");
    fireEvent.click(deleteButton);
    expect(mockDeleteTask).toHaveBeenCalledWith("column1", "task1");
  });

  // Test Case 3: Check if deadline is displayed in the correct format
  test("displays the deadline in the correct format", () => {
    renderTaskComponent();
    const deadlineDate = new Date(
      mockColumns[0].tasks[0].deadline
    ).toLocaleDateString();
    expect(screen.getByText(`Deadline: ${deadlineDate}`)).toBeInTheDocument();
  });

  // Test Case 4: Check if the edit dialog opens and displays correct values
  test("opens edit dialog with correct initial values", () => {
    renderTaskComponent();
    const editButton = screen.getByTestId("edit-button");
    fireEvent.click(editButton);

    expect(screen.getByLabelText(/Task Name/i).value).toBe("Test Task");
    expect(screen.getByLabelText(/Assign To/i).value).toBe("");
    expect(screen.getByLabelText(/Description/i).value).toBe("");
  });
});

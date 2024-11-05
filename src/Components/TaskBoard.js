import React, { useContext, useState } from "react";
import Column from "./Column";
import Task from "./Task";
import ColumnForm from "./ColumnForm";
import { TaskContext } from "../context/TaskContext";
import { Button, Typography, Stack } from "@mui/material";
import { DndContext, closestCorners, DragOverlay } from "@dnd-kit/core";

const TaskBoard = () => {
  const { columns, addColumn, updateColumns } = useContext(TaskContext);

  // State for visibility of column creation form dialog and active dragged task
  const [isColumnFormOpen, setIsColumnFormOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

  const handleOpenColumnForm = () => setIsColumnFormOpen(true);
  const handleCloseColumnForm = () => setIsColumnFormOpen(false);

  // Function to handle column creation when form is submitted
  const handleAddColumnSubmit = (columnName) => {
    if (columnName.trim()) {
      const newColumn = {
        id: Date.now().toString(),
        name: columnName,
        tasks: [],
      };
      addColumn(newColumn);
      handleCloseColumnForm();
    }
  };

  // Function called when dragging starts, setting the active task for DragOverlay
  const handleDragStart = ({ active }) => {
    const columnWithActiveTask = columns.find((column) =>
      column.tasks.some((task) => task.id === active.id)
    );

    const task = columnWithActiveTask.tasks.find(
      (task) => task.id === active.id
    );
    setActiveTask(task); // Set the active task for use in DragOverlay
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveTask(null); // Clear active task for DragOverlay after dragging ends

    if (!over) return;

    const activeId = active.id; // ID of the task being dragged
    const overId = over.id; // ID of the drop target

    // Find the source and destination columns
    const sourceColumn = columns.find((col) =>
      col.tasks.some((task) => task.id === activeId)
    );
    const destinationColumn = columns.find(
      (col) => col.id === overId || col.tasks.some((task) => task.id === overId)
    );

    if (!sourceColumn || !destinationColumn) return;

    // Find the index of the dragged task in the source column
    const sourceTaskIndex = sourceColumn.tasks.findIndex(
      (task) => task.id === activeId
    );
    // Remove the task from the source column
    const [movedTask] = sourceColumn.tasks.splice(sourceTaskIndex, 1);

    // Check if the task is being moved within the same column
    if (sourceColumn.id === destinationColumn.id) {
      // Get the index of the drop target task in the same column
      const destinationTaskIndex = destinationColumn.tasks.findIndex(
        (task) => task.id === overId
      );
      // Insert the task at the new position within the same column
      destinationColumn.tasks.splice(destinationTaskIndex + 1, 0, movedTask);
    } else {
      // If moved to a different column, add the task to the end of the destination column
      destinationColumn.tasks = [...destinationColumn.tasks, movedTask];
    }

    // Update columns state with the new column/task structure
    updateColumns([...columns]);
  };

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Typography variant="h3" align="center" color="textPrimary" gutterBottom>
        Task Management Board
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenColumnForm}
        sx={{ marginBottom: "20px", marginLeft: "50px" }}
      >
        + ADD NEW BOARD
      </Button>

      <ColumnForm
        open={isColumnFormOpen}
        onClose={handleCloseColumnForm}
        onSubmit={handleAddColumnSubmit} // Create new column when form is submitted
        initialName=""
        isEditing={false}
      />

      {/* Display all columns in a horizontal row */}
      <Stack
        direction="row"
        spacing={7}
        sx={{ marginLeft: "50px", marginTop: "10px", overflowX: "auto" }}
      >
        {columns.map((column) => (
          <Column key={column.id} columnId={column.id} />
        ))}
      </Stack>

      <DragOverlay>
        {activeTask ? (
          <Task
            taskId={activeTask.id}
            columnId={
              columns.find((col) =>
                col.tasks.some((task) => task.id === activeTask.id)
              ).id
            }
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TaskBoard;

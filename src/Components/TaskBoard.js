import React, { useContext, useState } from "react";
import Column from "./Column";
import Task from "./Task";
import { TaskContext } from "../context/TaskContext";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { DndContext, closestCorners, DragOverlay } from "@dnd-kit/core";

const TaskBoard = () => {
  const { columns, addColumn, updateColumns } = useContext(TaskContext);

  // Initialize state hooks
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [activeTask, setActiveTask] = useState(null); // Track the active task for DragOverlay

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setNewBoardName("");
  };

  const handleAddBoard = () => {
    if (newBoardName.trim()) {
      const newColumn = {
        id: Date.now().toString(),
        name: newBoardName,
        tasks: [],
      };
      addColumn(newColumn);
      handleDialogClose();
    }
  };

  const handleDragStart = ({ active }) => {
    const columnWithActiveTask = columns.find((column) =>
      column.tasks.some((task) => task.id === active.id)
    );
    const task = columnWithActiveTask.tasks.find(
      (task) => task.id === active.id
    );
    setActiveTask(task); // Set the active task for DragOverlay
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveTask(null); // Clear the active task after dragging ends

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const sourceColumn = columns.find((col) =>
      col.tasks.some((task) => task.id === activeId)
    );
    const destinationColumn = columns.find(
      (col) => col.id === overId || col.tasks.some((task) => task.id === overId)
    );

    if (!sourceColumn || !destinationColumn) return;

    const sourceTaskIndex = sourceColumn.tasks.findIndex(
      (task) => task.id === activeId
    );
    const [movedTask] = sourceColumn.tasks.splice(sourceTaskIndex, 1);

    if (sourceColumn.id === destinationColumn.id) {
      const destinationTaskIndex = destinationColumn.tasks.findIndex(
        (task) => task.id === overId
      );
      destinationColumn.tasks.splice(destinationTaskIndex + 1, 0, movedTask);
    } else {
      destinationColumn.tasks = [...destinationColumn.tasks, movedTask];
    }

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
        onClick={handleDialogOpen}
        sx={{ marginBottom: "20px", marginLeft: "50px" }}
      >
        + ADD NEW BOARD
      </Button>

      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add a New Board</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Board Name"
            type="text"
            fullWidth
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Discard
          </Button>
          <Button variant="contained" onClick={handleAddBoard} color="primary">
            Add Board
          </Button>
        </DialogActions>
      </Dialog>

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

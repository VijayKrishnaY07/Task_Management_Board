import React, { useState, useContext } from "react";
import Task from "./Task";
import ColumnForm from "./ColumnForm";
import TaskForm from "./TaskForm";
import { TaskContext } from "../context/TaskContext";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Box,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const Column = ({ columnId }) => {
  const { columns, editColumnName, deleteColumn, addTask } =
    useContext(TaskContext);

  // Find the current column data using columnId
  const column = columns.find((col) => col.id === columnId);

  const tasks = column ? column.tasks : [];

  // State for controlling task form dialog visibility
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);

  // State for controlling column edit form dialog visibility
  const [isEditColumnDialogOpen, setIsEditColumnDialogOpen] = useState(false);
  // Enable droppable functionality for this column using DnD-kit
  const { setNodeRef } = useDroppable({
    id: columnId.toString(),
  });

  // Handle the addition of a new task to the column
  const handleAddTask = (newTask) => {
    addTask(columnId, {
      name: newTask.taskName,
      assignedTo: newTask.assignedTo,
      description: newTask.description,
      deadline: newTask.deadline,
    });
    setIsTaskDialogOpen(false);
  };

  return (
    <Card
      sx={{
        margin: "25px",
        backgroundColor: "#ddd",
        minWidth: "40vh",
        maxHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">{column.name}</Typography>
          <Stack direction="row" spacing={0}>
            <IconButton
              onClick={() => setIsEditColumnDialogOpen(true)}
              size="small"
            >
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => deleteColumn(columnId)} size="small">
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Stack>

        <Button
          variant="outlined"
          onClick={() => setIsTaskDialogOpen(true)}
          sx={{ marginTop: "15px" }}
        >
          + Add Task
        </Button>

        <Box
          ref={setNodeRef} // Reference for droppable area
          sx={{
            marginTop: "20px",
            overflowY: "auto",
            height: "68vh",
            padding: "10px",
          }}
        >
          {/* Sortable context to allow task reordering */}
          <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <Task key={task.id} taskId={task.id} columnId={columnId} />
            ))}
          </SortableContext>
        </Box>

        {/* Task creation form dialog */}
        <TaskForm
          open={isTaskDialogOpen}
          onClose={() => setIsTaskDialogOpen(false)}
          onSubmit={handleAddTask}
          initialValues={{}}
          isEditing={false}
        />

        {/* Column edit form dialog */}
        <ColumnForm
          open={isEditColumnDialogOpen}
          onClose={() => setIsEditColumnDialogOpen(false)}
          onSubmit={(newName) => {
            editColumnName(columnId, newName.trim());
            setIsEditColumnDialogOpen(false);
          }}
          initialName={column.name} // Pre-fill with existing column name
          isEditing={true}
        />
      </CardContent>
    </Card>
  );
};

export default Column;

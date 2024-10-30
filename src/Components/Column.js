import React, { useState, useContext } from "react";
import Task from "./Task";
import { TaskContext } from "../context/TaskContext";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Box,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskForm from "./Form";

const Column = ({ columnId }) => {
  const { columns, editColumnName, deleteColumn, addTask } =
    useContext(TaskContext);
  const column = columns.find((col) => col.id === columnId);

  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isEditColumnDialogOpen, setIsEditColumnDialogOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState(column.name);

  const { setNodeRef } = useDroppable({
    id: columnId.toString(),
  });

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
        margin: "20px",
        backgroundColor: "#ddd",
        minWidth: "300px",
        maxHeight: "80vh",
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
          ref={setNodeRef}
          sx={{
            marginTop: "20px",
            overflowY: "auto",
            height: "65vh",
            padding: "10px",
          }}
        >
          <SortableContext
            items={column.tasks}
            strategy={verticalListSortingStrategy}
          >
            {column.tasks.map((task) => (
              <Task key={task.id} taskId={task.id} columnId={columnId} />
            ))}
          </SortableContext>
        </Box>

        <TaskForm
          open={isTaskDialogOpen}
          onClose={() => setIsTaskDialogOpen(false)}
          onSubmit={handleAddTask}
          initialValues={{
            taskName: "",
            assignedTo: "",
            description: "",
            deadline: null,
          }}
          isEditing={false}
        />

        <Dialog
          open={isEditColumnDialogOpen}
          onClose={() => setIsEditColumnDialogOpen(false)}
        >
          <DialogTitle>Edit Column Name</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Column Name"
              type="text"
              fullWidth
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setIsEditColumnDialogOpen(false)}
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                editColumnName(columnId, newColumnName.trim());
                setIsEditColumnDialogOpen(false);
              }}
              color="primary"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default Column;

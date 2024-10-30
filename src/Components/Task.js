import React, { useState, useContext } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDraggable } from "@dnd-kit/core";
import { TaskContext } from "../context/TaskContext";
import TaskForm from "./Form";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const Task = ({ taskId, columnId }) => {
  const { columns, editTask, deleteTask } = useContext(TaskContext);

  const column = columns.find((col) => col.id === columnId);
  const task = column?.tasks.find((t) => t.id === taskId);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: taskId ? taskId.toString() : "",
  });

  if (!taskId || !column || !task) {
    return null;
  }

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  const handleSaveTask = (updatedTask) => {
    editTask(columnId, taskId, {
      name: updatedTask.taskName,
      assignedTo: updatedTask.assignedTo,
      description: updatedTask.description,
      deadline: updatedTask.deadline,
    });
    setIsEditDialogOpen(false);
  };

  const handleDeleteTask = () => {
    deleteTask(columnId, taskId);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isEditDialogOpen ? {} : listeners)}
      {...attributes}
    >
      <Card style={{ margin: "10px 0", backgroundColor: "#f9f9f9" }}>
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5">{task.name || "Unnamed Task"}</Typography>
            <Stack direction="row" spacing={0}>
              <IconButton
                data-testid="favorite-button"
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                size="small"
              >
                <FavoriteBorderIcon />
              </IconButton>

              <IconButton
                data-testid="edit-button"
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => setIsEditDialogOpen(true)}
                size="small"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                data-testid="delete-button"
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={handleDeleteTask}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Stack>

          <Typography variant="body2">
            Description: {task.description || "No description provided"}
          </Typography>
          <Typography variant="body2">
            Assigned to: {task.assignedTo || "Unassigned"}
          </Typography>
          <Typography variant="body2">
            Deadline: {new Date(task.deadline).toLocaleDateString()}
          </Typography>
        </CardContent>

        {/* Use TaskForm for editing */}
        <TaskForm
          open={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSubmit={handleSaveTask}
          initialValues={{
            taskName: task.name || "",
            assignedTo: task.assignedTo || "",
            description: task.description || "",
            deadline: task.deadline || null,
          }}
          isEditing
        />
      </Card>
    </div>
  );
};

export default Task;

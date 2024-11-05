import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

const TaskForm = ({ open, onClose, onSubmit, initialValues, isEditing }) => {
  const validationSchema = Yup.object({
    taskName: Yup.string().required("Task name is required."),
    assignedTo: Yup.string().required("Username is required."),
    deadline: Yup.date()
      .required("Deadline is required")
      .min(new Date(), "Deadline must be in the future"),
  });

  // Initialize Formik for form handling
  const formik = useFormik({
    initialValues: {
      taskName: initialValues?.taskName || "",
      assignedTo: initialValues?.assignedTo || "",
      description: initialValues?.description || "",
      deadline: initialValues?.deadline || null,
    },
    enableReinitialize: true, // Reinitialize form values when props change
    validationSchema, // Attach validation schema to the form
    onSubmit: (values, { resetForm }) => {
      onSubmit(values);
      resetForm();
      onClose();
    },
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEditing ? "Edit Task" : "Add New Task"}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Task Name"
            name="taskName"
            value={formik.values.taskName}
            onChange={formik.handleChange}
            error={formik.touched.taskName && Boolean(formik.errors.taskName)}
            helperText={formik.touched.taskName && formik.errors.taskName}
          />

          <TextField
            fullWidth
            margin="dense"
            label="Assign To"
            name="assignedTo"
            value={formik.values.assignedTo}
            onChange={formik.handleChange}
            error={
              formik.touched.assignedTo && Boolean(formik.errors.assignedTo)
            }
            helperText={formik.touched.assignedTo && formik.errors.assignedTo}
          />

          <TextField
            fullWidth
            margin="dense"
            label="Description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            multiline
            rows={4}
          />

          <DatePicker
            label="Deadline"
            value={formik.values.deadline}
            onChange={(date) => formik.setFieldValue("deadline", date)}
            renderInput={(params) => (
              <TextField
                key={params.key}
                {...params}
                fullWidth
                margin="dense"
                error={
                  formik.touched.deadline && Boolean(formik.errors.deadline)
                }
                helperText={formik.touched.deadline && formik.errors.deadline}
              />
            )}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {isEditing ? "Save" : "Add Task"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm;

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

const ColumnForm = ({ open, onClose, onSubmit, initialName, isEditing }) => {
  const formik = useFormik({
    initialValues: {
      columnName: initialName,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      columnName: Yup.string().required("Column name is required."),
    }),
    onSubmit: (values) => {
      onSubmit(values.columnName);
      formik.resetForm();
    },
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {isEditing ? "Edit Column Name" : "Add New Column"}
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <TextField
            margin="dense"
            label="Column Name"
            name="columnName"
            fullWidth
            value={formik.values.columnName}
            onChange={formik.handleChange}
            error={
              formik.touched.columnName && Boolean(formik.errors.columnName)
            }
            helperText={formik.touched.columnName && formik.errors.columnName}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {isEditing ? "Save" : "Add Column"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ColumnForm;

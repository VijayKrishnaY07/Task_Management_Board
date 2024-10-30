import React, { createContext, useState, useEffect } from "react";
import { getStoredData, storeData } from "../utils/localStorage";

export const TaskContext = createContext();

const TaskProvider = ({ children }) => {
  const [columns, setColumns] = useState(() => getStoredData("columns") || []); //Get Columns from LocalStorage

  useEffect(() => {
    storeData("columns", columns); // Side effect to save every change to LocalStorage
  }, [columns]);

  /////////////////////////  Columns Opeartions ////////////////////////

  const addColumn = (newColumn) => {
    setColumns([...columns, newColumn]);
  };

  const editColumnName = (columnId, newName) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === columnId ? { ...column, name: newName } : column
      )
    );
  };

  const deleteColumn = (columnId) => {
    setColumns((prevColumns) =>
      prevColumns.filter((column) => column.id !== columnId)
    );
  };

  const updateColumns = (updatedColumns) => {
    setColumns(updatedColumns);
  };

  ////////////////////////// Task Operations //////////////////////

  const addTask = (columnId, task) => {
    const newTask = { ...task, id: Date.now().toString() };
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === columnId
          ? { ...column, tasks: [...column.tasks, newTask] }
          : column
      )
    );
  };

  const editTask = (columnId, taskId, updatedTask) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              tasks: column.tasks.map((task) =>
                task.id === taskId
                  ? {
                      ...task,
                      ...updatedTask,
                      assignedTo: updatedTask.assignedTo,
                    }
                  : task
              ),
            }
          : column
      )
    );
  };

  const deleteTask = (columnId, taskId) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              tasks: column.tasks.filter((task) => task.id !== taskId),
            }
          : column
      )
    );
  };

  return (
    <TaskContext.Provider
      value={{
        columns,
        addColumn,
        editColumnName,
        deleteColumn,
        updateColumns,
        addTask,
        editTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskProvider;

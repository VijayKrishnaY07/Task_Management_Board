import React, { createContext, useState, useEffect } from "react";
import { getStoredData, storeData } from "../utils/localStorage";

export const TaskContext = createContext();

const TaskProvider = ({ children }) => {
  const [columns, setColumns] = useState(() => getStoredData("columns"));

  useEffect(() => {
    storeData("columns", columns);
  }, [columns]);

  ///////////////////////// Column Operations /////////////////////////

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

  ///////////////////////// Task Operations //////////////////////////

  // Helper function to update a task based on a callback
  const updateColumnTasks = (columnId, taskUpdater) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === columnId
          ? { ...column, tasks: taskUpdater(column.tasks) }
          : column
      )
    );
  };

  const addTask = (columnId, task) => {
    const newTask = { ...task, id: Date.now().toString() };
    updateColumnTasks(columnId, (tasks) => [...tasks, newTask]);
  };

  const editTask = (columnId, taskId, updatedTask) => {
    updateColumnTasks(columnId, (tasks) =>
      tasks.map((task) =>
        task.id === taskId ? { ...task, ...updatedTask } : task
      )
    );
  };

  const deleteTask = (columnId, taskId) => {
    updateColumnTasks(columnId, (tasks) =>
      tasks.filter((task) => task.id !== taskId)
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

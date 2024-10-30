import React from "react";
import TaskBoard from "./Components/TaskBoard";
import TaskProvider from "./context/TaskContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const App = () => {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      data-testid="LocalizationProvider"
    >
      <TaskProvider>
        <TaskBoard />
      </TaskProvider>
    </LocalizationProvider>
  );
};

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import TasksView from "./screens/TasksView";
import RecurringSchedulesView from "./screens/RecurringSchedulesView"; // Create this component

const Main = () => {
  return (
    <div className="app-container">
      {/* Header */}
      <div className="common-header">
        <h1 className="title">Task Manager</h1>
      </div>

      {/* Sidebar Navigation */}
      <div className="side-bar">
        <ul>
          <li><Link to="/tasks">Tasks</Link></li>
          <li><Link to="/recurring-schedules">Recurring Schedules</Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Routes>
          <Route path="/tasks" element={<TasksView />} />
          <Route path="/recurring-schedules" element={<RecurringSchedulesView />} />
          <Route path="/" element={<Navigate replace to="/tasks" />} />  {/* Redirect to /tasks */}
        </Routes>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router basename="/">
      <Main />
    </Router>
  );
};

export default App;

import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  NavLink,
} from 'react-router-dom';
import TasksScreen from './screens/TasksScreen';
import SchedulesScreen from './screens/SchedulesScreen';

const Main = () => {
  const fnNavLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `nav-bar__link ${isActive ? 'active' : ''}`;
  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <h1 className="header__title">Task Manager</h1>
      </header>

      {/* Sidebar Navigation */}
      <nav className="nav-bar">
        <NavLink className={fnNavLinkClassName} to="/tasks">
          Tasks
        </NavLink>
        <NavLink className={fnNavLinkClassName} to="/recurring-schedules">
          Schedules
        </NavLink>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/tasks" element={<TasksScreen />} />
          <Route path="/recurring-schedules" element={<SchedulesScreen />} />
          <Route path="/" element={<Navigate replace to="/tasks" />} />{' '}
          {/* Redirect to /tasks */}
        </Routes>
      </main>
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

import React from 'react';
import { RecurringSchedule } from '../../state/recurringScheduleStore';
import { Task } from '../../state/taskStore';
import ScheduleEntry from './SchedulesEntry';

interface SchedulesListProps {
  recurringSchedules: RecurringSchedule[];
  removeSchedule: (id: number) => void;
}

const SchedulesList: React.FC<SchedulesListProps> = ({
  recurringSchedules,
  removeSchedule,
}) => {
  return (
    <div className="tasks-view__entries">
      <table className="task-table">
        <thead>
          <tr>
            <th>Title Prefix</th>
            <th>Frequency</th>
            <th>Priority</th>
            <th>Dependencies</th>
            <th>Created Tasks</th>
            <th>Next Running Date</th>
            <th>Next Task Suffix Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {recurringSchedules.map((schedule) => (
            <ScheduleEntry
              key={schedule._id}
              schedule={schedule}
              removeSchedule={removeSchedule}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SchedulesList;

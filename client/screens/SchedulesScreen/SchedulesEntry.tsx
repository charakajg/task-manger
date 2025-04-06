import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { Task } from '../../state/taskStore';
import { RecurringSchedule } from '../../state/recurringScheduleStore';
import moment from 'moment';
import ChildTaskList from '../common/ChildTaskList';

interface SchedulesEntryProps {
  schedule: RecurringSchedule;
  removeSchedule: (id: number) => void;
}

const SchedulesEntry: React.FC<SchedulesEntryProps> = ({
  schedule,
  removeSchedule,
}) => {
  return (
    <tr key={schedule._id}>
      <td>{schedule.titlePrefix}</td>
      <td>{schedule.frequency}</td>
      <td>{schedule.priority}</td>
      <td>
        <ChildTaskList
          childTasks={schedule.dependencies}
          taskLabel="dependent"
        />
      </td>
      <td>
        <ChildTaskList childTasks={schedule.createdTasks} taskLabel="created" />
      </td>
      <td>{moment(schedule.nextRunningDate).format('MMMM Do, YYYY')}</td>
      <td>{schedule.nextSuffixNumber}</td>
      <td>
        <button
          className="delete-btn"
          onClick={() => removeSchedule(schedule._id)}>
          <FaTrashAlt />
        </button>
      </td>
    </tr>
  );
};

export default SchedulesEntry;

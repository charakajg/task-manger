import React, { useState, useEffect } from "react";
import { FaTrashAlt, FaCheck } from "react-icons/fa";
import recurringScheduleStore from "../state/recurringScheduleStore";
import taskStore from "../state/taskStore";
import { FaX } from "react-icons/fa6";
import { Frequency } from "../constants";
import moment from "moment";

const RecurringSchedulesView = () => {
  // Access Zustand store state and actions
  const { recurringSchedules, fetchAll, updateSchedule, removeSchedule } = recurringScheduleStore();
  const { tasks } = taskStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <div className="tasks-view">
        <table className="task-table">
          <thead>
            <tr>
              <th>
                Title Prefix
              </th>
              <th>
                Frequency
              </th>
              <th>
                Priority
              </th>
              <th>Dependencies</th>
              <th>Created Tasks</th>
              <th>Next Running Date</th>
              <th>Next Task Suffix Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recurringSchedules.map((schedule) => {
              const dependentTasks = schedule.dependencies && schedule.dependencies.length > 0 ? schedule.dependencies.map((depId) => tasks.find((t) => String(t._id) == depId)) : [];
              const createdTasks = schedule.createdTasks && schedule.createdTasks.length > 0 ? schedule.createdTasks.map((taskId) => tasks.find((t) => String(t._id) == taskId)) : [];              
              return (
                <tr key={schedule._id}>
                  <td>{schedule.titlePrefix}</td>
                  <td>{schedule.frequency}</td>
                  <td>{schedule.priority}</td>
                  <td>
                    {dependentTasks.length > 0 ? (
                      dependentTasks.map((depTask) => {
                        return <div key={depTask?._id}>{depTask ? depTask.title : "Unknown Task"}</div>;
                      })
                    ) : (
                      "No dependencies"
                    )}
                  </td>
                  <td>
                    {createdTasks.length > 0 ? (
                      createdTasks.map((task) => {
                        return <div key={task?._id}>{task ? task.title : "Unknown Task"}</div>;
                      })
                    ) : (
                      "No created tasks"
                    )}
                  </td>
                  <td>
                    {moment(schedule.nextRunningDate).format("MMMM Do, YYYY")}
                  </td>
                  <td>{schedule.nextSuffixNumber}</td>
                  <td>
                    <button className="delete-btn" onClick={() => removeSchedule(schedule._id)}>
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>)

            }
            )}
          </tbody>
        </table>
        </div>
  );
};

export default RecurringSchedulesView;

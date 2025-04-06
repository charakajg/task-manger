import React, { useEffect } from 'react';
import recurringScheduleStore from '../../state/recurringScheduleStore';
import SchedulesList from './SchedulesList';

const SchedulesScreen = () => {
  const {
    recurringSchedules,
    fetchAll,
    removeSchedule,
    currentPage,
    totalPages,
    loading,
    error,
    changePage,
  } = recurringScheduleStore();

  useEffect(() => {
    fetchAll(1); // Start at page 1
  }, [fetchAll]);

  const handlePageChange = (page: number) => {
    changePage(page);
  };

  return (
    <div className="tasks-view">
      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <>
          <SchedulesList
            recurringSchedules={recurringSchedules}
            removeSchedule={removeSchedule}
          />

          {/* Pagination controls */}
          <div className="pagination-controls">
            {currentPage > 1 && (
              <button
                className="btn-dal"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={loading}>
                Previous
              </button>
            )}

            <span>
              Page {currentPage} of {totalPages || 1}
            </span>

            {currentPage < totalPages && (
              <button
                className="btn-dal"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={loading}>
                Next
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SchedulesScreen;

import { useState } from "react";
import EmptyState from "./EmptyState";
import { SearchIcon } from "./icons";
import { taskStatuses } from "../data/teamData";
import "./RecentTasks.css";

const statusKeyMap = {
  "On Track": "on-track",
  Blocked: "blocked",
};

function RecentTasks({ tasks, selectedTaskId, onTaskSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const hasActiveFilters = normalizedSearch !== "" || statusFilter !== "all";

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(normalizedSearch);
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function clearFilters() {
    setSearchTerm("");
    setStatusFilter("all");
  }

  return (
    <section className="panel" aria-labelledby="tasks-title">
      <div className="panel-header">
        <div className="panel-header__text">
          <h2 className="panel-title" id="tasks-title">
            Recent Tasks
          </h2>
          <p className="panel-subtitle">
            Latest task activity across active projects
          </p>
        </div>
      </div>

      <div className="panel-toolbar">
        <div className="search-field">
          <SearchIcon size={16} className="search-field__icon" />
          <input
            type="search"
            className="search-field__input"
            placeholder="Search tasks by name"
            aria-label="Search tasks by name"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="search-field__clear"
              onClick={() => setSearchTerm("")}
              aria-label="Clear task search"
            >
              ×
            </button>
          )}
        </div>

        <select
          className="select"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter tasks by status"
        >
          <option value="all">All statuses</option>
          {taskStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            className="button button--ghost"
            onClick={clearFilters}
          >
            Clear filters
          </button>
        )}

        <span className="recent-tasks__count" aria-live="polite">
          Showing {filteredTasks.length} of {tasks.length}
        </span>
      </div>

      {filteredTasks.length > 0 ? (
        <div className="table-wrap">
          <table className="data-table data-table--tasks">
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Owner</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => {
                const statusKey = statusKeyMap[task.status];
                const isSelected = selectedTaskId === task.id;

                return (
                  <tr
                    key={task.id}
                    className={isSelected ? "is-selected" : undefined}
                  >
                    <td>
                      <button
                        type="button"
                        className="link-button task-title"
                        onClick={() => onTaskSelect?.(task.id)}
                        aria-label={`View details for ${task.title} (coming soon)`}
                        title="Task details coming soon"
                      >
                        {task.title}
                      </button>
                    </td>
                    <td>
                      <span className="project-tag">{task.project}</span>
                    </td>
                    <td className="task-owner">{task.owner}</td>
                    <td className="due-date">{task.dueDate}</td>
                    <td>
                      <span
                        className={`badge badge--${statusKey}`}
                        title={task.blockerReason}
                      >
                        <span className="status-dot" />
                        {task.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={SearchIcon}
          title="No tasks found"
          message="No tasks match your search and status filter. Try adjusting the search term or choosing a different status."
          action={
            hasActiveFilters ? (
              <button
                type="button"
                className="button button--ghost"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            ) : null
          }
        />
      )}
    </section>
  );
}

export default RecentTasks;

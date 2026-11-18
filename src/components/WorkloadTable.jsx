import EmptyState from "./EmptyState";
import "./WorkloadTable.css";

const statusKeyMap = {
  Available: "available",
  "Fully Allocated": "allocated",
  Overloaded: "overloaded",
};

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function WorkloadTable({
  members,
  totalMembers,
  capacity,
  activeFilter,
  onClearFilter,
  selectedMemberId,
  onMemberSelect,
}) {
  const hasMembers = members.length > 0;
  const filterLabel = activeFilter === "all" ? null : activeFilter;
  const capacityStatusKey = statusKeyMap[capacity.status] ?? "allocated";
  const capacityProgress = Math.min(Math.max(capacity.utilization, 0), 100);
  const isOverCapacity = capacity.remaining < 0;

  return (
    <section className="panel" aria-labelledby="workload-title">
      <div className="panel-header panel-header--row workload-header">
        <div className="panel-header__text">
          <h2 className="panel-title" id="workload-title">
            Team Workload
          </h2>
          <p className="panel-subtitle">
            Assigned vs. weekly capacity for the current reporting period
          </p>
          <div className="table-meta workload-header__meta">
            <span className="result-count">
              Showing {members.length} of {totalMembers}
            </span>
            {filterLabel && (
              <span className="filter-chip">
                {filterLabel}
                <button
                  type="button"
                  className="filter-chip__clear"
                  onClick={onClearFilter}
                  aria-label={`Clear ${filterLabel} filter`}
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>

        <div
          className="workload-capacity"
          aria-label={`Team capacity: ${capacity.totalAssigned} of ${capacity.totalCapacity} hours assigned, ${capacity.remaining} hours remaining, ${capacity.utilization}% overall utilization.`}
        >
          <div className="workload-capacity__metrics">
            <span className="workload-capacity__metric">
              <span className="workload-capacity__label">
                Overall Capacity
              </span>
              <span className="workload-capacity__value">
                {capacity.totalAssigned} / {capacity.totalCapacity} hrs
              </span>
            </span>
            <span className="workload-capacity__metric">
              <span className="workload-capacity__label">Remaining</span>
              <span
                className={`workload-capacity__value${
                  isOverCapacity
                    ? " workload-capacity__value--negative"
                    : ""
                }`}
              >
                {capacity.remaining} hrs
              </span>
            </span>
            <span className="workload-capacity__metric">
              <span className="workload-capacity__label">Utilization</span>
              <span className="workload-capacity__value">
                {capacity.utilization}%
              </span>
            </span>
          </div>
          <div className="workload-capacity__bar">
            <div
              className="progress-track progress-track--sm"
              role="progressbar"
              aria-valuenow={capacityProgress}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuetext={`${capacity.utilization}% overall utilization`}
              aria-label="Overall team utilization"
            >
              <div
                className={`progress-fill progress-fill--${capacityStatusKey}`}
                style={{ width: `${capacityProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {hasMembers ? (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Team Member</th>
                <th className="num">Assigned Hours</th>
                <th className="num">Weekly Capacity</th>
                <th className="num">Remaining Hours</th>
                <th>Utilization</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => {
                const statusKey = statusKeyMap[member.status];
                const isSelected = selectedMemberId === member.id;
                const remaining = member.remainingHours;
                const remainingClass =
                  remaining < 0
                    ? " remaining-cell--negative"
                    : remaining === 0
                      ? " remaining-cell--zero"
                      : "";
                const remainingText =
                  remaining < 0
                    ? `−${Math.abs(remaining)} hrs`
                    : `${remaining} hrs`;

                return (
                  <tr
                    key={member.id}
                    className={isSelected ? "is-selected" : undefined}
                  >
                    <td>
                      <div className="member-cell">
                        <span className="avatar">
                          {getInitials(member.name)}
                        </span>
                        <div className="member-info">
                          <button
                            type="button"
                            className="link-button member-name"
                            onClick={() => onMemberSelect?.(member.id)}
                            aria-label={`View profile for ${member.name} (coming soon)`}
                            title="Member profile coming soon"
                          >
                            {member.name}
                          </button>
                          <span className="member-role">{member.role}</span>
                        </div>
                      </div>
                    </td>
                    <td className="num hours-cell">
                      {member.assignedHours} hrs
                    </td>
                    <td className="num hours-cell">
                      {member.capacityHours} hrs
                    </td>
                    <td
                      className={`num hours-cell remaining-cell${remainingClass}`}
                      title={
                        remaining < 0 ? "Over weekly capacity" : undefined
                      }
                    >
                      {remainingText}
                    </td>
                    <td>
                      <div className="utilization-cell">
                        <div
                          className="progress-track"
                          role="progressbar"
                          aria-valuenow={Math.min(member.utilization, 100)}
                          aria-valuemin="0"
                          aria-valuemax="100"
                          aria-valuetext={`${member.utilization}% utilized`}
                          aria-label={`${member.name} utilization`}
                        >
                          <div
                            className={`progress-fill progress-fill--${statusKey}`}
                            style={{
                              width: `${Math.min(member.utilization, 100)}%`,
                            }}
                          />
                        </div>
                        <span className="utilization-value">
                          {member.utilization}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge--${statusKey}`}>
                        <span className="status-dot" />
                        {member.status}
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
          title="No team members found"
          message={
            filterLabel
              ? `No team members are currently marked as ${filterLabel.toLowerCase()}.`
              : "No team members are available for this reporting period."
          }
          action={
            filterLabel ? (
              <button
                type="button"
                className="button button--ghost"
                onClick={onClearFilter}
              >
                Clear filter
              </button>
            ) : null
          }
        />
      )}
    </section>
  );
}

export default WorkloadTable;

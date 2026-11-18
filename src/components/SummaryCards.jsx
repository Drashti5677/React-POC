import "./SummaryCards.css";
import {
  TeamIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertTriangleIcon,
} from "./icons";

const iconMap = {
  team: TeamIcon,
  available: CheckCircleIcon,
  allocated: ClockIcon,
  overloaded: AlertTriangleIcon,
};

function SummaryCards({ stats, activeFilter, onSelect }) {
  return (
    <div className="summary-cards">
      {stats.map((stat) => {
        const CardIcon = iconMap[stat.icon];
        const isActive =
          stat.filter === activeFilter ||
          (stat.filter === "all" && activeFilter === "all");

        return (
          <button
            key={stat.id}
            type="button"
            className={`summary-card summary-card--${stat.color}${
              isActive ? " summary-card--active" : ""
            }`}
            aria-pressed={isActive}
            aria-label={`${stat.label}: ${stat.value}. ${
              isActive ? "Filter active" : "Filter team workload"
            }`}
            onClick={() => onSelect(stat.filter)}
          >
            <span className="summary-card__icon">
              <CardIcon size={22} />
            </span>
            <span className="summary-card__body">
              <span className="summary-card__value">{stat.value}</span>
              <span className="summary-card__label">{stat.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default SummaryCards;

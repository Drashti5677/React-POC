import "./Sidebar.css";
import {
  PulseIcon,
  DashboardIcon,
  TeamIcon,
  TasksIcon,
  ReportsIcon,
  SettingsIcon,
} from "./icons";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: DashboardIcon, page: "dashboard" },
  { id: "team", label: "Team", icon: TeamIcon, page: "team" },
  { id: "tasks", label: "Tasks", icon: TasksIcon },
  { id: "reports", label: "Reports", icon: ReportsIcon },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

function Sidebar({ activePage = "dashboard", onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <PulseIcon size={26} />
        <span>TeamPulse</span>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {navItems.map(({ id, label, icon: NavIcon, page }) => {
          const isActive = page === activePage;

          return (
            <a
              key={id}
              href={page ? `#${id}` : "#"}
              className={isActive ? "nav-item nav-item--active" : "nav-item"}
              aria-current={isActive ? "page" : undefined}
              onClick={(event) => {
                event.preventDefault();
                if (page) onNavigate?.(page);
              }}
            >
              <NavIcon size={18} />
              <span>{label}</span>
            </a>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <p>TeamPulse v1.0 · Phase 1</p>
      </div>
    </aside>
  );
}

export default Sidebar;

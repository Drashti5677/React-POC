import { InboxIcon } from "./icons";
import "./EmptyState.css";

function EmptyState({ icon: EmptyIcon = InboxIcon, title, message, action }) {
  return (
    <div className="empty-state" role="status">
      <span className="empty-state__icon">
        <EmptyIcon size={22} />
      </span>
      <p className="empty-state__title">{title}</p>
      {message && <p className="empty-state__message">{message}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}

export default EmptyState;

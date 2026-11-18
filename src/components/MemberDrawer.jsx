import { useEffect } from "react";
import { formatDate, getInitials } from "../data/teamData";

function SkillGroup({ title, items }) {
  return (
    <div className="drawer-skill-group">
      <h4 className="drawer-skill-group__title">{title}</h4>
      {items.length > 0 ? (
        <div className="skill-tags">
          {items.map((item) => (
            <span className="skill-tag" key={item}>
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="drawer-empty">Not specified</p>
      )}
    </div>
  );
}

function MemberDrawer({ member, onClose, onEdit }) {
  useEffect(() => {
    if (!member) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [member, onClose]);

  if (!member) return null;

  return (
    <div
      className="drawer-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {/* <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-drawer-title"
      >
        <header className="drawer-header">
          <div className="drawer-profile">
            <span className="avatar avatar--lg">
              {getInitials(member.name)}
            </span>
            <div className="drawer-profile__text">
              <h2 className="drawer-name" id="member-drawer-title">
                {member.name}
              </h2>
              <p className="drawer-role">{member.role}</p>
              <span className="department-tag">{member.department}</span>
            </div>
          </div>
          <button
            type="button"
            className="drawer-close"
            onClick={onClose}
            aria-label="Close member profile"
          >
            ×
          </button>
        </header>

        <div className="drawer-body">
          <section className="drawer-section">
            <h3 className="drawer-section__title">Basic Information</h3>
            <dl className="info-grid">
              <div className="info-item">
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${member.email}`}>{member.email}</a>
                </dd>
              </div>
              <div className="info-item">
                <dt>Department</dt>
                <dd>{member.department}</dd>
              </div>
              <div className="info-item">
                <dt>Job Title</dt>
                <dd>{member.role}</dd>
              </div>
              <div className="info-item">
                <dt>Member Since</dt>
                <dd>{formatDate(member.joinedDate)}</dd>
              </div>
            </dl>
          </section>

          <section className="drawer-section">
            <h3 className="drawer-section__title">Skills and Expertise</h3>
            <SkillGroup title="Technical Skills" items={member.skills} />
            <SkillGroup
              title="Professional Specializations"
              items={member.specializations}
            />
            <SkillGroup title="Areas of Expertise" items={member.expertise} />
          </section>

          <section className="drawer-section">
            <h3 className="drawer-section__title">Project Associations</h3>
            {member.projects.length > 0 ? (
              <ul className="project-list">
                {member.projects.map((project) => (
                  <li className="project-item" key={project.name}>
                    <span className="project-item__name">{project.name}</span>
                    <span className="project-item__role">{project.role}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="drawer-empty">No project associations yet.</p>
            )}
          </section>
        </div>

        <footer className="drawer-footer">
          <button type="button" className="button" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="button button--primary"
            onClick={() => onEdit(member)}
          >
            Edit Member
          </button>
        </footer>
      </aside> */}
    </div>
  );
}

export default MemberDrawer;

import { useEffect, useState } from "react";
import { departments, projectNames } from "../data/teamData";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getInitialValues(member) {
  return {
    name: member?.name ?? "",
    email: member?.email ?? "",
    role: member?.role ?? "",
    department: member?.department ?? departments[0],
    joinedDate: member?.joinedDate ?? "",
    skills: member?.skills?.join(", ") ?? "",
  };
}

function getInitialProjects(member) {
  return Object.fromEntries(
    (member?.projects ?? []).map((project) => [project.name, project.role]),
  );
}

function MemberForm({ member, members, onSave, onClose }) {
  const [values, setValues] = useState(() => getInitialValues(member));
  const [projectRoles, setProjectRoles] = useState(() =>
    getInitialProjects(member),
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
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
  }, [onClose]);

  function updateField(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function toggleProject(projectName) {
    setProjectRoles((current) => {
      if (projectName in current) {
        const next = { ...current };
        delete next[projectName];
        return next;
      }

      return { ...current, [projectName]: "" };
    });
  }

  function updateProjectRole(projectName, value) {
    setProjectRoles((current) => ({ ...current, [projectName]: value }));
  }

  function validate() {
    const nextErrors = {};
    const email = values.email.trim();

    if (!values.name.trim()) nextErrors.name = "Full name is required.";
    if (!email) {
      nextErrors.email = "Email is required.";
    } else if (!emailPattern.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    } else if (
      members.some(
        (existing) =>
          existing.id !== member?.id &&
          existing.email.toLowerCase() === email.toLowerCase(),
      )
    ) {
      nextErrors.email = "A team member with this email already exists.";
    }
    if (!values.role.trim()) nextErrors.role = "Job title is required.";
    if (!values.department) nextErrors.department = "Department is required.";
    if (!values.joinedDate) nextErrors.joinedDate = "Joining date is required.";

    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const seenSkills = new Set();
    const skills = values.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => {
        if (!skill) return false;
        const key = skill.toLowerCase();
        if (seenSkills.has(key)) return false;
        seenSkills.add(key);
        return true;
      });

    const projects = Object.entries(projectRoles).map(([name, role]) => ({
      name,
      role: role.trim() || "Contributor",
    }));

    onSave({
      id: member?.id,
      name: values.name.trim(),
      email: values.email.trim(),
      role: values.role.trim(),
      department: values.department,
      joinedDate: values.joinedDate,
      skills,
      projects,
      specializations: member?.specializations ?? [],
      expertise: member?.expertise ?? [],
    });
  }

  function fieldClass(field) {
    return errors[field] ? "form-input form-input--error" : "form-input";
  }

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {/* <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-form-title"
      >
        <header className="modal-header">
          <div>
            <h2 className="modal-title" id="member-form-title">
              {member ? "Edit Team Member" : "Add Team Member"}
            </h2>
            <p className="modal-subtitle">
              {member
                ? "Update this person's details, skills and project associations."
                : "Add a new person to the team directory."}
            </p>
          </div>
          <button
            type="button"
            className="drawer-close"
            onClick={onClose}
            aria-label="Close member form"
          >
            ×
          </button>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label" htmlFor="member-name">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  id="member-name"
                  className={fieldClass("name")}
                  type="text"
                  value={values.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "member-name-error" : undefined}
                  autoFocus
                />
                {errors.name && (
                  <p className="form-error" id="member-name-error">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="member-email">
                  Email <span className="required">*</span>
                </label>
                <input
                  id="member-email"
                  className={fieldClass("email")}
                  type="email"
                  value={values.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? "member-email-error" : undefined
                  }
                />
                {errors.email && (
                  <p className="form-error" id="member-email-error">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="member-role">
                  Job Title <span className="required">*</span>
                </label>
                <input
                  id="member-role"
                  className={fieldClass("role")}
                  type="text"
                  value={values.role}
                  onChange={(event) => updateField("role", event.target.value)}
                  aria-invalid={Boolean(errors.role)}
                  aria-describedby={errors.role ? "member-role-error" : undefined}
                />
                {errors.role && (
                  <p className="form-error" id="member-role-error">
                    {errors.role}
                  </p>
                )}
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="member-department">
                  Department <span className="required">*</span>
                </label>
                <select
                  id="member-department"
                  className={`form-select${
                    errors.department ? " form-input--error" : ""
                  }`}
                  value={values.department}
                  onChange={(event) =>
                    updateField("department", event.target.value)
                  }
                  aria-invalid={Boolean(errors.department)}
                  aria-describedby={
                    errors.department ? "member-department-error" : undefined
                  }
                >
                  {departments.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="form-error" id="member-department-error">
                    {errors.department}
                  </p>
                )}
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="member-joined">
                  Joining Date <span className="required">*</span>
                </label>
                <input
                  id="member-joined"
                  className={fieldClass("joinedDate")}
                  type="date"
                  value={values.joinedDate}
                  onChange={(event) =>
                    updateField("joinedDate", event.target.value)
                  }
                  aria-invalid={Boolean(errors.joinedDate)}
                  aria-describedby={
                    errors.joinedDate ? "member-joined-error" : undefined
                  }
                />
                {errors.joinedDate && (
                  <p className="form-error" id="member-joined-error">
                    {errors.joinedDate}
                  </p>
                )}
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="member-skills">
                  Skills
                </label>
                <input
                  id="member-skills"
                  className="form-input"
                  type="text"
                  value={values.skills}
                  onChange={(event) => updateField("skills", event.target.value)}
                  placeholder="React, TypeScript, Figma"
                />
                <p className="form-hint">Separate skills with commas.</p>
              </div>
            </div>

            <fieldset className="form-fieldset">
              <legend className="form-label">Project Associations</legend>
              <p className="form-hint">
                Select the projects this member is involved in and add their
                role.
              </p>
              <div className="form-projects">
                {projectNames.map((projectName) => {
                  const isSelected = projectName in projectRoles;

                  return (
                    <div className="project-check-row" key={projectName}>
                      <label className="project-check">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleProject(projectName)}
                        />
                        <span>{projectName}</span>
                      </label>
                      {isSelected && (
                        <input
                          className="form-input form-input--sm"
                          type="text"
                          value={projectRoles[projectName]}
                          onChange={(event) =>
                            updateProjectRole(projectName, event.target.value)
                          }
                          placeholder="Role in project"
                          aria-label={`Role in ${projectName}`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </fieldset>
          </div>

          <footer className="modal-footer">
            <button type="button" className="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button button--primary">
              {member ? "Save Changes" : "Add Member"}
            </button>
          </footer>
        </form>
      </div> */}
    </div>
  );
}

export default MemberForm;

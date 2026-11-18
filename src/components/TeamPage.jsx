import { useMemo, useState } from "react";
import EmptyState from "./EmptyState";
import MemberDrawer from "./MemberDrawer";
import MemberForm from "./MemberForm";
import { SearchIcon } from "./icons";
import { departments, formatDate, getInitials } from "../data/teamData";
import "./TeamPage.css";

const MAX_VISIBLE_SKILLS = 3;
const MAX_VISIBLE_PROJECTS = 2;

function TeamPage({ members, onSaveMember }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [skillFilter, setSkillFilter] = useState("all");
  const [activeMemberId, setActiveMemberId] = useState(null);
  const [formState, setFormState] = useState(null);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const hasActiveFilters =
    normalizedSearch !== "" ||
    departmentFilter !== "all" ||
    roleFilter !== "all" ||
    skillFilter !== "all";

  const roleOptions = useMemo(
    () => [...new Set(members.map((member) => member.role))].sort(),
    [members],
  );

  const skillOptions = useMemo(
    () =>
      [...new Set(members.flatMap((member) => member.skills))].sort((a, b) =>
        a.localeCompare(b),
      ),
    [members],
  );

  const filteredMembers = useMemo(
    () =>
      members.filter((member) => {
        const matchesSearch =
          normalizedSearch === "" ||
          member.name.toLowerCase().includes(normalizedSearch) ||
          member.role.toLowerCase().includes(normalizedSearch);
        const matchesDepartment =
          departmentFilter === "all" || member.department === departmentFilter;
        const matchesRole = roleFilter === "all" || member.role === roleFilter;
        const matchesSkill =
          skillFilter === "all" || member.skills.includes(skillFilter);

        return (
          matchesSearch && matchesDepartment && matchesRole && matchesSkill
        );
      }),
    [members, normalizedSearch, departmentFilter, roleFilter, skillFilter],
  );

  const activeMember =
    members.find((member) => member.id === activeMemberId) ?? null;

  const editingMember =
    formState?.mode === "edit"
      ? (members.find((member) => member.id === formState.memberId) ?? null)
      : null;

  function clearFilters() {
    setSearchTerm("");
    setDepartmentFilter("all");
    setRoleFilter("all");
    setSkillFilter("all");
  }

  function openProfile(memberId) {
    setActiveMemberId(memberId);
  }

  function closeProfile() {
    setActiveMemberId(null);
  }

  function openAddForm() {
    setFormState({ mode: "add" });
  }

  function openEditForm(member) {
    setActiveMemberId(null);
    setFormState({ mode: "edit", memberId: member.id });
  }

  function closeForm() {
    setFormState(null);
  }

  function handleSave(values) {
    onSaveMember(values);
    setFormState(null);

    if (!values.id) clearFilters();
  }

  return (
    <>
      <header className="page-header team-page-header">
        <div className="page-header__text">
          <h1 className="page-title">Team</h1>
          <p className="page-description">
            Manage team members, explore their expertise, and view their project
            associations.
          </p>
        </div>
        <button
          type="button"
          className="button button--primary"
          onClick={openAddForm}
        >
          + Add Team Member
        </button>
      </header>

      <section className="panel" aria-labelledby="team-directory-title">
        <div className="panel-header">
          <div className="panel-header__text">
            <h2 className="panel-title" id="team-directory-title">
              Team Directory
            </h2>
            <p className="panel-subtitle">
              Browse members by role, department, skills and project involvement
            </p>
          </div>
        </div>

        <div className="panel-toolbar team-toolbar">
          <div className="search-field team-toolbar__search">
            <SearchIcon size={16} className="search-field__icon" />
            <input
              type="search"
              className="search-field__input"
              placeholder="Search by name or job title"
              aria-label="Search team members by name or job title"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className="search-field__clear"
                onClick={() => setSearchTerm("")}
                aria-label="Clear team search"
              >
                ×
              </button>
            )}
          </div>

          <select
            className="select"
            value={departmentFilter}
            onChange={(event) => setDepartmentFilter(event.target.value)}
            aria-label="Filter team members by department"
          >
            <option value="all">All departments</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>

          <select
            className="select"
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            aria-label="Filter team members by role"
          >
            <option value="all">All roles</option>
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>

          <select
            className="select"
            value={skillFilter}
            onChange={(event) => setSkillFilter(event.target.value)}
            aria-label="Filter team members by skill"
          >
            <option value="all">All skills</option>
            {skillOptions.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              className="button button--ghost"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          )}

          <span className="team-toolbar__count" aria-live="polite">
            Showing {filteredMembers.length} of {members.length} members
          </span>
        </div>

        {filteredMembers.length > 0 ? (
          <div className="table-wrap">
            <table className="data-table team-table">
              <thead>
                <tr>
                  <th>Team Member</th>
                  <th>Designation</th>
                  <th>Department</th>
                  <th>Skills</th>
                  <th>Projects</th>
                  <th>Member Since</th>
                  {/* <th>Action</th> */}
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => {
                  const visibleSkills = member.skills.slice(
                    0,
                    MAX_VISIBLE_SKILLS,
                  );
                  const hiddenSkillCount =
                    member.skills.length - visibleSkills.length;
                  const visibleProjects = member.projects.slice(
                    0,
                    MAX_VISIBLE_PROJECTS,
                  );
                  const hiddenProjectCount =
                    member.projects.length - visibleProjects.length;

                  return (
                    <tr
                      key={member.id}
                      className="team-row"
                      onClick={() => openProfile(member.id)}
                    >
                      <td>
                        <div className="team-member-cell">
                          <span className="avatar">
                            {getInitials(member.name)}
                          </span>
                          <div className="team-member-info">
                            <span className="team-member-name">
                              {member.name}
                            </span>
                            <span className="team-member-email">
                              {member.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="team-role">{member.role}</td>
                      <td>
                        <span className="department-tag">
                          {member.department}
                        </span>
                      </td>
                      <td>
                        {member.skills.length > 0 ? (
                          <div className="skills-cell">
                            {visibleSkills.map((skill) => (
                              <span className="skill-tag" key={skill}>
                                {skill}
                              </span>
                            ))}
                            {hiddenSkillCount > 0 && (
                              <span className="skill-tag skill-tag--more">
                                +{hiddenSkillCount}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="muted">—</span>
                        )}
                      </td>
                      <td>
                        {member.projects.length > 0 ? (
                          <div className="projects-cell">
                            {visibleProjects.map((project) => (
                              <span className="project-tag" key={project.name}>
                                {project.name}
                              </span>
                            ))}
                            {hiddenProjectCount > 0 && (
                              <span className="project-more">
                                +{hiddenProjectCount} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="muted">—</span>
                        )}
                      </td>
                      <td className="member-since">
                        {formatDate(member.joinedDate)}
                      </td>
                      {/* <td className="action-cell">
                        <button
                          type="button"
                          className="button button--ghost team-view-button"
                          onClick={(event) => {
                            event.stopPropagation();
                            openProfile(member.id);
                          }}
                        >
                          View Profile
                        </button>
                      </td> */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={SearchIcon}
            title="No team members found"
            message="No team members match your search and filters. Try adjusting the search term or choosing different filters."
            action={
              hasActiveFilters ? (
                <button
                  type="button"
                  className="button button--ghost"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              ) : null
            }
          />
        )}
      </section>

      <MemberDrawer
        member={activeMember}
        onClose={closeProfile}
        onEdit={openEditForm}
      />

      {formState && (
        <MemberForm
          key={editingMember ? `edit-${editingMember.id}` : "add"}
          member={editingMember}
          members={members}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}
    </>
  );
}

export default TeamPage;

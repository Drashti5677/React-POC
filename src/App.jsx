import { useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import SummaryCards from "./components/SummaryCards";
import WorkloadTable from "./components/WorkloadTable";
import RecentTasks from "./components/RecentTasks";
import TeamPage from "./components/TeamPage";
import {
  buildMember,
  getCapacitySummary,
  getSummaryStats,
  reportingPeriod,
  teamMembers,
  recentTasks,
} from "./data/teamData";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [members, setMembers] = useState(() => teamMembers);
  const [workloadFilter, setWorkloadFilter] = useState("all");
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const summaryStats = useMemo(() => getSummaryStats(members), [members]);
  const capacitySummary = useMemo(() => getCapacitySummary(members), [members]);

  const filteredMembers = useMemo(
    () =>
      workloadFilter === "all"
        ? members
        : members.filter((member) => member.status === workloadFilter),
    [members, workloadFilter],
  );

  const tasksWithOwners = useMemo(
    () =>
      recentTasks.map((task) => ({
        ...task,
        owner:
          members.find((member) => member.id === task.ownerId)?.name ??
          task.owner,
      })),
    [members],
  );

  function handleSummarySelect(filter) {
    setWorkloadFilter((current) =>
      filter === "all" || current === filter ? "all" : filter,
    );
  }

  function clearWorkloadFilter() {
    setWorkloadFilter("all");
  }

  function handleMemberSelect(memberId) {
    setSelectedMemberId((current) => (current === memberId ? null : memberId));
  }

  function handleTaskSelect(taskId) {
    setSelectedTaskId((current) => (current === taskId ? null : taskId));
  }

  function handleSaveMember(memberData) {
    if (memberData.id) {
      setMembers((current) =>
        current.map((member) =>
          member.id === memberData.id
            ? buildMember({ ...member, ...memberData })
            : member,
        ),
      );
      return;
    }

    setMembers((current) => {
      const nextId = current.reduce(
        (highest, member) => Math.max(highest, member.id),
        0,
      );
      const newMember = buildMember({
        ...memberData,
        id: nextId + 1,
        assignedHours: 0,
        capacityHours: 40,
      });

      return [...current, newMember];
    });
  }

  return (
    <div className="app">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="app-main">
        {activePage === "team" ? (
          <TeamPage members={members} onSaveMember={handleSaveMember} />
        ) : (
          <>
            <header className="page-header">
              <div className="page-header__text">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-description">
                  Monitor team capacity, workload distribution, and delivery
                  risks at a glance.
                </p>
              </div>
              <div className="page-period">
                <span className="page-period__label">Reporting Period</span>
                <span className="page-period__value">{reportingPeriod}</span>
              </div>
            </header>

            <SummaryCards
              stats={summaryStats}
              activeFilter={workloadFilter}
              onSelect={handleSummarySelect}
            />
            <WorkloadTable
              members={filteredMembers}
              totalMembers={members.length}
              capacity={capacitySummary}
              activeFilter={workloadFilter}
              onClearFilter={clearWorkloadFilter}
              selectedMemberId={selectedMemberId}
              onMemberSelect={handleMemberSelect}
            />
            <RecentTasks
              tasks={tasksWithOwners}
              selectedTaskId={selectedTaskId}
              onTaskSelect={handleTaskSelect}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;

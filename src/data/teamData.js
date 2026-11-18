export const reportingPeriod = 'Nov 1 – Nov 30, 2026'

export const departments = ['Engineering', 'Design', 'Quality Assurance']

export const projectNames = [
  'TeamPulse',
  'Auth Service',
  'Portal Redesign',
  'QA Pipeline',
  'Billing Platform',
  'Infrastructure',
]

export function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function formatDate(isoDate) {
  if (!isoDate) return '—'

  const date = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(date.getTime())) return isoDate

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function getUtilization(assignedHours, capacityHours) {
  if (!capacityHours) return 0
  return Math.round((assignedHours / capacityHours) * 100)
}

export function getWorkloadStatus(utilization) {
  if (utilization > 100) return 'Overloaded'
  if (utilization >= 90) return 'Fully Allocated'
  return 'Available'
}

export function buildMember(member) {
  const capacityHours = member.capacityHours ?? 40
  const assignedHours = member.assignedHours ?? 0
  const utilization = getUtilization(assignedHours, capacityHours)

  return {
    ...member,
    capacityHours,
    assignedHours,
    remainingHours: capacityHours - assignedHours,
    utilization,
    status: getWorkloadStatus(utilization),
  }
}

export function getCapacitySummary(members) {
  const totals = members.reduce(
    (acc, member) => ({
      totalCapacity: acc.totalCapacity + member.capacityHours,
      totalAssigned: acc.totalAssigned + member.assignedHours,
    }),
    { totalCapacity: 0, totalAssigned: 0 },
  )

  const remaining = totals.totalCapacity - totals.totalAssigned
  const utilization =
    totals.totalCapacity === 0
      ? 0
      : Number(
          ((totals.totalAssigned / totals.totalCapacity) * 100).toFixed(2),
        )

  return {
    ...totals,
    remaining,
    utilization,
    status: getWorkloadStatus(utilization),
  }
}

const rawMembers = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Senior Frontend Engineer',
    department: 'Engineering',
    email: 'sarah.chen@teampulse.io',
    joinedDate: '2022-03-14',
    skills: ['React', 'JavaScript', 'CSS', 'Accessibility', 'Vite'],
    specializations: ['Frontend Architecture', 'Design Systems'],
    expertise: ['Component Libraries', 'Performance Optimization'],
    projects: [
      { name: 'TeamPulse', role: 'Frontend Lead' },
      { name: 'Portal Redesign', role: 'UI Engineer' },
    ],
    assignedHours: 28,
    capacityHours: 40,
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'Backend Engineer',
    department: 'Engineering',
    email: 'marcus.johnson@teampulse.io',
    joinedDate: '2021-08-02',
    skills: ['Node.js', 'Express', 'PostgreSQL', 'REST APIs', 'Docker'],
    specializations: ['API Design', 'Authentication'],
    expertise: ['Distributed Systems', 'Database Modeling'],
    projects: [
      { name: 'Auth Service', role: 'Backend Lead' },
      { name: 'Billing Platform', role: 'API Developer' },
    ],
    assignedHours: 22,
    capacityHours: 40,
  },
  {
    id: 3,
    name: 'Priya Patel',
    role: 'Product Designer',
    department: 'Design',
    email: 'priya.patel@teampulse.io',
    joinedDate: '2023-01-09',
    skills: [
      'Figma',
      'Prototyping',
      'User Research',
      'Wireframing',
      'Design Systems',
    ],
    specializations: ['UX Design', 'Visual Design'],
    expertise: ['Onboarding Flows', 'Usability Testing'],
    projects: [
      { name: 'Portal Redesign', role: 'Lead Product Designer' },
      { name: 'TeamPulse', role: 'UX Designer' },
    ],
    assignedHours: 40,
    capacityHours: 40,
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'QA Engineer',
    department: 'Quality Assurance',
    email: 'david.kim@teampulse.io',
    joinedDate: '2022-11-21',
    skills: [
      'Playwright',
      'Jest',
      'Cypress',
      'Test Automation',
      'API Testing',
    ],
    specializations: ['Test Strategy', 'Automation Engineering'],
    expertise: ['Regression Testing', 'CI Test Integration'],
    projects: [
      { name: 'QA Pipeline', role: 'QA Lead' },
      { name: 'TeamPulse', role: 'Test Engineer' },
    ],
    assignedHours: 38,
    capacityHours: 40,
  },
  {
    id: 5,
    name: 'Elena Rodriguez',
    role: 'Full Stack Developer',
    department: 'Engineering',
    email: 'elena.rodriguez@teampulse.io',
    joinedDate: '2020-06-15',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'PostgreSQL'],
    specializations: ['Full Stack Development', 'Webhook Integration'],
    expertise: ['Payment Systems', 'End-to-End Feature Delivery'],
    projects: [
      { name: 'Billing Platform', role: 'Full Stack Developer' },
      { name: 'Portal Redesign', role: 'Frontend Developer' },
    ],
    assignedHours: 46,
    capacityHours: 40,
  },
  {
    id: 6,
    name: "James O'Connor",
    role: 'DevOps Engineer',
    department: 'Engineering',
    email: 'james.oconnor@teampulse.io',
    joinedDate: '2021-02-08',
    skills: ['AWS', 'Kubernetes', 'Terraform', 'Docker', 'CI/CD'],
    specializations: ['Cloud Infrastructure', 'Site Reliability'],
    expertise: ['Monitoring & Observability', 'Environment Automation'],
    projects: [
      { name: 'Infrastructure', role: 'DevOps Lead' },
      { name: 'Auth Service', role: 'Deployment Engineer' },
    ],
    assignedHours: 52,
    capacityHours: 40,
  },
]

export const teamMembers = rawMembers.map(buildMember)

const summaryCardDefinitions = [
  {
    id: 'total',
    label: 'Total Team Members',
    icon: 'team',
    color: 'indigo',
    filter: 'all',
  },
  {
    id: 'available',
    label: 'Available',
    icon: 'available',
    color: 'green',
    filter: 'Available',
  },
  {
    id: 'allocated',
    label: 'Fully Allocated',
    icon: 'allocated',
    color: 'amber',
    filter: 'Fully Allocated',
  },
  {
    id: 'overloaded',
    label: 'Overloaded',
    icon: 'overloaded',
    color: 'red',
    filter: 'Overloaded',
  },
]

export function getSummaryStats(members) {
  return summaryCardDefinitions.map((card) => ({
    ...card,
    value:
      card.filter === 'all'
        ? members.length
        : members.filter((member) => member.status === card.filter).length,
  }))
}

export const taskStatuses = ['On Track', 'Blocked']

export const recentTasks = [
  {
    id: 1,
    title: 'Implement dashboard navigation',
    project: 'TeamPulse',
    ownerId: 1,
    owner: 'Sarah Chen',
    dueDate: 'Nov 20, 2026',
    status: 'On Track',
  },
  {
    id: 2,
    title: 'Refactor authentication middleware',
    project: 'Auth Service',
    ownerId: 2,
    owner: 'Marcus Johnson',
    dueDate: 'Nov 22, 2026',
    status: 'Blocked',
    blockerReason: 'Awaiting security team review',
  },
  {
    id: 3,
    title: 'Design onboarding flow mockups',
    project: 'Portal Redesign',
    ownerId: 3,
    owner: 'Priya Patel',
    dueDate: 'Nov 18, 2026',
    status: 'On Track',
  },
  {
    id: 4,
    title: 'Automate regression test suite',
    project: 'QA Pipeline',
    ownerId: 4,
    owner: 'David Kim',
    dueDate: 'Nov 24, 2026',
    status: 'On Track',
  },
  {
    id: 5,
    title: 'Integrate payment webhook handlers',
    project: 'Billing Platform',
    ownerId: 5,
    owner: 'Elena Rodriguez',
    dueDate: 'Nov 17, 2026',
    status: 'Blocked',
    blockerReason: 'Pending API credentials from vendor',
  },
  {
    id: 6,
    title: 'Set up staging environment monitoring',
    project: 'Infrastructure',
    ownerId: 6,
    owner: "James O'Connor",
    dueDate: 'Nov 21, 2026',
    status: 'On Track',
  },
]

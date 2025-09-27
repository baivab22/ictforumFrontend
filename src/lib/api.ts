import axios from 'axios';

/* ===========================
   Types
=========================== */
export type Role = 'student' | 'teacher' | 'staff' | 'alumni' | 'admin';
export type Category = 'academic' | 'administrative' | 'infrastructure' | 'other';
export type Status = 'Received' | 'In Process' | 'Resolved';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Suggestion {
  _id?: string;
  id?: string;
  user?: string;
  anonymous: boolean;
  category: Category;
  description: string;
  status: Status;
  assignedDepartment?: string | null;
  assignedTo?: string | null;
  media?: {
    type: 'image' | 'video';
    url: string;
    filename: string;
    mimetype: string;
    size: number;
  }[];
  createdAt: string;
  updatedAt: string;
  actionTaken?: string;
}

export interface Department {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  head?: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ===========================
   College Performance & Monitoring Types
=========================== */

export interface CollegePerformance {
  college: {
    id: string;
    name: string;
    type: string;
    location: string;
  };
  kpis: {
    studentTeacherRatio: number;
    infrastructureScore: number;
    landUtilization: number;
    capacityUtilization: number;
    genderBalance: {
      male: number;
      female: number;
      other: number;
    };
    techReadiness: number;
    completionRate: number;
  };
  enrollmentTrends: Array<{
    year: number;
    totalEnrollment: number;
    masterEnrollment: number;
    bachelorEnrollment: number;
    totalAppeared: number;
    totalPassed: number;
    passRate: number;
  }>;
  resourceGaps: {
    criticalInfrastructure: Array<{
      type: string;
      condition: string;
      buildings: number;
    }>;
    technologyGaps: Array<{
      type: string;
      plans: string;
    }>;
    staffingNeeds: {
      currentStaff: number;
      recommendedRatio: number;
      gap: number;
    };
  };
  projectStatus: {
    ongoing: number;
    immediate: number;
    future: number;
  };
}

export interface BudgetAnalysis {
  college: {
    id: string;
    name: string;
    type: string;
  };
  budgetRequirements: {
    criticalInfrastructure: {
      priority: string;
      items: Array<{
        type: string;
        buildings: number;
        estimatedCost: number;
      }>;
      totalEstimated: number;
    };
    technologyUpgrades: {
      priority: string;
      items: Array<{
        type: string;
        plans: string;
        estimatedCost: number;
      }>;
      totalEstimated: number;
    };
    capacityExpansion: {
      priority: string;
      newConstructions: Array<{
        item: string;
        estimatedCost: number;
      }>;
      totalEstimated: number;
    };
    ongoingProjects: {
      totalBudget: number;
      projectCount: number;
    };
  };
  totalBudgetNeed: number;
  roiAnalysis: {
    currentStudentCapacity: number;
    potentialCapacityAfterUpgrade: number;
    investmentPerStudent: number;
    infrastructureEfficiencyGain: number;
    priorityScore: number;
  };
  recommendations: Array<{
    type: string;
    priority: string;
    description: string;
    estimatedCost?: number;
    expectedImpact?: string;
    justification?: string;
  }>;
}

export interface SystemOverview {
  systemKPIs: {
    totalColleges: number;
    totalStudents: number;
    totalStaff: number;
    averageStudentTeacherRatio: number;
    averageInfrastructureScore: number;
    totalLandArea: number;
    averageLandUtilization: number;
    genderDistribution: {
      male: number;
      female: number;
      other: number;
    };
    systemTechReadiness: number;
  };
  performanceDistribution: {
    excellent: number;
    good: number;
    average: number;
    poor: number;
  };
  regionalComparison: Array<{
    _id: string;
    collegeCount: number;
    totalStudents: number;
    avgInfraScore: number;
    totalLandArea: number;
  }>;
  filters: {
    province?: string;
    district?: string;
    campusType?: string;
  };
  generatedAt: string;
}

export interface BudgetAllocation {
  college: {
    id: string;
    name: string;
    type: string;
    location: string;
    students: number;
  };
  metrics: {
    infrastructureScore: number;
    priorityScore: number;
    studentImpact: number;
    criticalInfraCount: number;
    techGaps: number;
    completionRate: number;
  };
  budgetAnalysis: {
    estimatedNeed: number;
    costPerStudent: number;
    roi: number;
  };
  allocation: {
    amount: number;
    percentage: number;
    priority: string;
    coverageRatio: number;
  };
}

export interface BudgetAllocationRecommendations {
  allocations: BudgetAllocation[];
  summary: {
    totalBudget: number;
    totalAllocated: number;
    remainingBudget: number;
    utilizationRate: number;
    collegesFullyFunded: number;
    collegesPartiallyFunded: number;
    collegesUnfunded: number;
    averageAllocation: number;
    totalEstimatedNeed: number;
    fundingGap: number;
  };
  methodology: {
    scoringFactors: Array<{
      factor: string;
      weight: string;
    }>;
  };
  generatedAt: string;
}

export interface ResourceEfficiency {
  resourceEfficiency: {
    landUtilization: {
      highlyEfficient: number;
      moderatelyEfficient: number;
      underutilized: number;
      averageUtilization: number;
    };
    infrastructureHealth: {
      excellent: number;
      good: number;
      fair: number;
      poor: number;
      systemAverage: number;
    };
    capacityEfficiency: Array<{
      college: string;
      students: number;
      capacity: number;
      utilization: number;
      efficiency: string;
    }>;
  };
  technologyAdoption: {
    classroomTech: {
      average: number;
      distribution: {
        high: number;
        medium: number;
        low: number;
      };
    };
    libraryResources: {
      average: number;
      distribution: {
        high: number;
        medium: number;
        low: number;
      };
    };
    labEquipment: {
      average: number;
      distribution: {
        high: number;
        medium: number;
        low: number;
      };
    };
    onlineLearning: {
      average: number;
      distribution: {
        high: number;
        medium: number;
        low: number;
      };
    };
  };
  benchmarks: {
    studentTeacherRatio: {
      target: number;
      current: number;
      status: string;
    };
    landUtilization: {
      target: number;
      current: number;
      status: string;
    };
    infrastructureHealth: {
      target: number;
      current: number;
      status: string;
    };
  };
  recommendations: Array<{
    category: string;
    recommendation: string;
    priority: string;
    impact: string;
  }>;
  totalCollegesAnalyzed: number;
  filters: {
    province?: string;
    campusType?: string;
  };
  generatedAt: string;
}

export interface EnrollmentTrends {
  systemEnrollmentTrends: Array<{
    year: number;
    masterEnrollment: number;
    bachelorEnrollment: number;
    totalEnrollment: number;
    masterAppeared: number;
    bachelorAppeared: number;
    masterPassed: number;
    bachelorPassed: number;
    passRate: number;
    masterPassRate: number;
    bachelorPassRate: number;
  }>;
  enrollmentGrowth: Array<{
    year: number;
    growthRate: number;
    absoluteGrowth: number;
  }>;
  projections: Array<{
    year: number;
    projectedEnrollment: number;
    growthAssumption: number;
  }>;
  performanceAnalysis: {
    averagePassRate: number;
    passRateTrend: string;
    masterVsBachelorTrend: {
      masterShare: number[];
      bachelorShare: number[];
    };
  };
  regionalComparison: Array<{
    _id: string;
    totalCurrentEnrollment: number;
    avgPassRate: number;
    collegeCount: number;
  }> | null;
  summary: {
    totalCurrentEnrollment: number;
    avgAnnualGrowth: number;
    totalCollegesAnalyzed: number;
    dataYearsAvailable: number;
  };
  filters: {
    province?: string;
    timeframe: number;
  };
  generatedAt: string;
}

export interface InfrastructureGaps {
  gaps: {
    criticalConditionBuildings: Array<{
      college: {
        id: string;
        name: string;
        location: string;
        students: number;
      };
      criticalBuildings: Array<{
        type: string;
        condition: string;
        count: number;
        capacity: number;
      }>;
      totalCriticalBuildings: number;
      affectedCapacity: number;
    }>;
    technologyGaps: Array<{
      college: {
        id: string;
        name: string;
        students: number;
      };
      gaps: Array<{
        type: string;
        plans: string;
        category: string;
      }>;
      gapCount: number;
      hasPlans: number;
    }>;
    capacityGaps: Array<{
      college: {
        id: string;
        name: string;
        location: string;
      };
      currentStudents: number;
      totalCapacity: number;
      utilizationRate: number;
      status: string;
      capacityGap: number;
    }>;
  };
  priorityAnalysis: {
    high: {
      count: number;
      estimatedCost: number;
    };
    medium: {
      count: number;
      estimatedCost: number;
    };
    low: {
      count: number;
      estimatedCost: number;
    };
  };
  costEstimation: {
    infrastructure: {
      highPriority: number;
      mediumPriority: number;
      total: number;
    };
    technology: {
      highPriority: number;
      mediumPriority: number;
      total: number;
    };
    capacityExpansion: {
      highPriority: number;
      total: number;
    };
  };
  totalEstimatedCost: number;
  summary: {
    totalCollegesWithGaps: number;
    totalCollegesAnalyzed: number;
    gapPercentage: number;
  };
  filters: {
    priority: string;
    province?: string;
    campusType?: string;
  };
  generatedAt: string;
}

export interface ComparativeAnalysis {
  comparative: Array<{
    college: {
      id: string;
      name: string;
      type: string;
      location: string;
    };
    metrics: any;
    overallScore?: number;
    efficiencyScore?: number;
    growthScore?: number;
    urgencyScore?: number;
    rank: number;
  }>;
  statistics: {
    mean: number;
    median: number;
    min: number;
    max: number;
    standardDeviation: number;
  };
  groupAnalysis: {
    byProvince: { [key: string]: { count: number; avgRank: number } };
    byCampusType: { [key: string]: { count: number; avgRank: number } };
    byPerformanceTier: {
      excellent: number;
      good: number;
      average: number;
      needsImprovement: number;
    };
  };
  insights: Array<{
    type: string;
    description: string;
    college?: string;
    location?: string;
    avgRank?: number;
    collegeCount?: number;
    distribution?: any;
  }>;
  metadata: {
    metric: string;
    totalColleges: number;
    displayedColleges: number;
    filters: {
      province?: string;
      campusType?: string;
      limit: number;
    };
  };
  generatedAt: string;
}

export interface BudgetUtilization {
  college: {
    id: string;
    name: string;
    type: string;
    location: string;
  };
  budgetSummary: {
    totalAllocated: number;
    completed: number;
    inProgress: number;
    planned: number;
    utilizationRate: number;
  };
  projects: {
    total: number;
    completed: number;
    inProgress: number;
    planning: number;
    onHold: number;
  };
  timeline: {
    overdue: number;
    onTrack: number;
  };
}

export interface BudgetMonitoring {
  collegeUtilization: BudgetUtilization[];
  systemSummary: {
    totalSystemBudget: number;
    totalUtilized: number;
    totalInProgress: number;
    totalPlanned: number;
    systemUtilizationRate: number;
    totalProjects: number;
    completedProjects: number;
    overdueProjects: number;
  };
  performanceIndicators: {
    budgetEfficiency: {
      high: number;
      medium: number;
      low: number;
    };
    projectCompletion: {
      excellent: number;
      good: number;
      poor: number;
    };
    timelineAdherence: {
      onTrack: number;
      delayed: number;
      adherenceRate: number;
    };
  };
  trends: Array<{
    month: number;
    projectsStarted: number;
    budgetAllocated: number;
    avgProjectBudget: number;
  }> | null;
  alerts: Array<{
    type: string;
    category: string;
    message: string;
    action: string;
    affectedColleges?: string[];
  }>;
  filters: {
    year?: string;
    province?: string;
    projectStatus?: string;
  };
  generatedAt: string;
}

export interface ProjectMonitoring {
  project: {
    id: string;
    title: string;
    description: string;
    budget: number;
    status: string;
    priority: string;
    startDate: string;
    expectedEndDate: string;
  };
  college: {
    id: string;
    name: string;
    location: string;
  };
  health: {
    isOverdue: boolean;
    daysOverdue: number;
    duration: number;
    healthScore: number;
  };
}

export interface ProjectMonitoringResponse {
  projects: ProjectMonitoring[];
  analytics: {
    totalProjects: number;
    byStatus: {
      Planning: number;
      'In Progress': number;
      Completed: number;
      'On Hold': number;
    };
    byPriority: {
      High: number;
      Medium: number;
      Low: number;
    };
    budget: {
      total: number;
      byStatus: {
        Planning: number;
        'In Progress': number;
        Completed: number;
        'On Hold': number;
      };
    };
    timeline: {
      overdue: number;
      onTrack: number;
      avgDaysOverdue: number;
    };
  };
  riskAssessment: {
    highRisk: ProjectMonitoring[];
    mediumRisk: ProjectMonitoring[];
    lowRisk: ProjectMonitoring[];
    criticalProjects: Array<{
      project: string;
      college: string;
      issue: string;
      budget: number;
    }>;
  };
  performanceMetrics: {
    completionRate: number;
    budgetUtilization: number;
    timelineAdherence: number;
    averageProjectHealth: number;
  };
  recommendations: Array<{
    priority: string;
    category: string;
    action: string;
    description: string;
    expectedImpact: string;
  }>;
  filters: {
    status?: string;
    priority?: string;
    province?: string;
    overdue?: string;
  };
  generatedAt: string;
}

/* ===========================
   Storage Helpers
=========================== */
const API_BASE = import.meta.env.VITE_API_BASE || 'https://feedbackbackend-1.onrender.com';
// const API_BASE = import.meta.env.VITE_API_BASE_LOCAL || 'http://localhost:4000';

function getToken(): string | null {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
}

function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  } catch {}
}

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User | null) {
  try {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  } catch {}
}

export function isAdmin(): boolean {
  const u = getStoredUser();
  return !!u && u.role === 'admin';
}

/* ===========================
   Axios Instance
=========================== */
const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    const msg = err.response?.data?.message || err.message;
    return Promise.reject(new Error(msg));
  }
);

/* ===========================
   Auth Services
=========================== */
export interface LoginResp {
  user: User;
  token: string;
}

// POST /api/auth/login
export async function login(email: string, password: string) {
  const { data } = await api.post<LoginResp>('/api/auth/login', { email, password });
  setToken(data.token);
  setStoredUser(data.user);
  return data;
}

// POST /api/auth/register
export async function register(name: string, email: string, password: string, role?: Role) {
  const { data } = await api.post<LoginResp>('/api/auth/register', { name, email, password, role });
  setToken(data.token);
  setStoredUser(data.user);
  return data;
}

// POST /api/auth/logout
export async function logout() {
  try {
    await api.post('/api/auth/logout');
  } catch {}
  setToken(null);
  setStoredUser(null);
}

/* ===========================
   Department Services
=========================== */

// GET /api/departments (public - only active departments)
export async function getDepartments() {
  const { data } = await api.get<{ departments: Department[] }>('/api/departments');
  return data;
}

/* ===========================
   Suggestion Services
=========================== */

// POST /api/suggestions (multipart/form-data)
export async function createSuggestionWithMedia(form: FormData) {
  const { data } = await api.post<{ suggestion: Suggestion }>('/api/suggestions', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
}

// POST /api/suggestions (JSON body)
export async function createSuggestion(params: {
  category: Category;
  description: string;
  anonymous: boolean;
  assignedDepartment?: string;
}) {
  const { data } = await api.post<{ suggestion: Suggestion }>('/api/suggestions', params);
  return data;
}

// GET /api/suggestions/my
export async function mySuggestions() {
  const { data } = await api.get<{ suggestions: Suggestion[] }>('/api/suggestions/my');
  return data;
}

// GET /api/suggestions/track/:id
export async function trackSuggestion(id: string) {
  const { data } = await api.get<{
    suggestion: { id: string; status: Status; category: Category; createdAt: string; updatedAt: string };
  }>(`/api/suggestions/track/${id}`);
  return data;
}

// GET /api/public/resolved
export async function listResolved(page = 1, limit = 10) {
  const { data } = await api.get<{ page: number; limit: number; total: number; suggestions: Suggestion[] }>(
    '/api/public/resolved',
    { params: { page, limit } }
  );
  return data;
}

/* ===========================
   Admin Department Services
=========================== */

// GET /api/admin/departments
export async function adminListDepartments(params: {
  q?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
} = {}) {
  const { data } = await api.get<{ 
    page: number; 
    limit: number; 
    total: number; 
    departments: Department[] 
  }>('/api/admin/departments', { params });
  return data;
}

// POST /api/admin/departments
export async function adminCreateDepartment(params: {
  name: string;
  description?: string;
  head?: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
}) {
  const { data } = await api.post<{ department: Department }>('/api/admin/departments', params);
  return data;
}

// GET /api/admin/departments/:id
export async function adminGetDepartment(id: string) {
  const { data } = await api.get<{ department: Department }>(`/api/admin/departments/${id}`);
  return data;
}

// PUT /api/admin/departments/:id
export async function adminUpdateDepartment(
  id: string,
  updates: Partial<Pick<Department, 'name' | 'description' | 'head' | 'email' | 'phone' | 'isActive'>>
) {
  const { data } = await api.put<{ department: Department }>(`/api/admin/departments/${id}`, updates);
  return data;
}

// DELETE /api/admin/departments/:id
export async function adminDeleteDepartment(id: string) {
  const { data } = await api.delete<{ message: string; department?: Department }>(`/api/admin/departments/${id}`);
  return data;
}

/* ===========================
   Admin Suggestion Services
=========================== */

// GET /api/admin/suggestions
export async function adminList(params: {
  category?: Category;
  status?: Status;
  assignedDepartment?: string;
  q?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}) {
  const { data } = await api.get<{ page: number; limit: number; total: number; suggestions: Suggestion[] }>(
    '/api/admin/suggestions',
    { params }
  );
  return data;
}

// PATCH /api/admin/suggestions/:id
export async function adminUpdate(
  id: string,
  updates: Partial<Pick<Suggestion, 'status' | 'category' | 'assignedDepartment' | 'assignedTo'>>
) {
  const { data } = await api.patch<{ suggestion: Suggestion }>(`/api/admin/suggestions/${id}`, updates);
  return data;
}

// DELETE /api/admin/suggestions/:id
export async function adminDelete(id: string) {
  const { data } = await api.delete<{ message: string }>(`/api/admin/suggestions/${id}`);
  return data;
}

// GET /api/admin/reports/summary
export async function adminSummary() {
  const { data } = await api.get<{
    byStatus: { _id: Status; count: number }[];
    byCategory: { _id: Category; count: number }[];
    byDepartment: { _id: string; count: number }[];
    monthly: { _id: { year: number; month: number }; count: number }[];
    departmentStats: { total: number; active: number };
  }>('/api/admin/reports/summary');
  return data;
}

/* ===========================
   College Performance & Monitoring Services
=========================== */

// GET /api/colleges/:id/performance
export async function getCollegePerformance(id: string): Promise<CollegePerformance> {
  const { data } = await api.get<CollegePerformance>(`/api/colleges/${id}/performance`);
  return data;
}

// GET /api/colleges/:id/budget-analysis
export async function getCollegeBudgetAnalysis(id: string): Promise<BudgetAnalysis> {
  const { data } = await api.get<BudgetAnalysis>(`/api/colleges/${id}/budget-analysis`);
  return data;
}

// GET /api/colleges/system/overview
export async function getSystemOverview(params?: {
  province?: string;
  district?: string;
  campusType?: string;
}): Promise<SystemOverview> {
  const { data } = await api.get<SystemOverview>('/api/colleges/system/overview', { params });
  return data;
}

// GET /api/colleges/budget/allocation-recommendations
export async function getBudgetAllocationRecommendations(params?: {
  totalBudget?: number;
  priority?: string;
}): Promise<BudgetAllocationRecommendations> {
  const { data } = await api.get<BudgetAllocationRecommendations>('/api/colleges/budget/allocation-recommendations', { 
    params: {
      totalBudget: params?.totalBudget,
      priority: params?.priority
    }
  });
  return data;
}

// GET /api/colleges/system/resource-efficiency
export async function getResourceEfficiency(params?: {
  province?: string;
  campusType?: string;
}): Promise<ResourceEfficiency> {
  const { data } = await api.get<ResourceEfficiency>('/api/colleges/system/resource-efficiency', { params });
  return data;
}

// GET /api/colleges/system/enrollment-trends
export async function getEnrollmentTrends(params?: {
  province?: string;
  timeframe?: number;
}): Promise<EnrollmentTrends> {
  const { data } = await api.get<EnrollmentTrends>('/api/colleges/system/enrollment-trends', { 
    params: {
      province: params?.province,
      timeframe: params?.timeframe
    }
  });
  return data;
}

// GET /api/colleges/system/infrastructure-gaps
export async function getInfrastructureGaps(params?: {
  priority?: string;
  province?: string;
  campusType?: string;
}): Promise<InfrastructureGaps> {
  const { data } = await api.get<InfrastructureGaps>('/api/colleges/system/infrastructure-gaps', { params });
  return data;
}

// GET /api/colleges/system/comparative-analysis
export async function getComparativeAnalysis(params?: {
  metric?: string;
  province?: string;
  campusType?: string;
  limit?: number;
}): Promise<ComparativeAnalysis> {
  const { data } = await api.get<ComparativeAnalysis>('/api/colleges/system/comparative-analysis', { 
    params: {
      metric: params?.metric || 'performance',
      province: params?.province,
      campusType: params?.campusType,
      limit: params?.limit || 20
    }
  });
  return data;
}

// GET /api/colleges/budget/utilization-tracking
export async function getBudgetUtilizationTracking(params?: {
  year?: string;
  province?: string;
  projectStatus?: string;
}): Promise<BudgetMonitoring> {
  const { data } = await api.get<BudgetMonitoring>('/api/colleges/budget/utilization-tracking', { params });
  return data;
}

// GET /api/colleges/projects/monitoring
export async function getProjectMonitoring(params?: {
  status?: string;
  priority?: string;
  province?: string;
  overdue?: string;
}): Promise<ProjectMonitoringResponse> {
  const { data } = await api.get<ProjectMonitoringResponse>('/api/colleges/projects/monitoring', { params });
  return data;
}

/* ===========================
   Extra (Optional for future)
=========================== */

// ⚠️ Not implemented in backend yet, but useful to have:
export async function getSuggestionById(id: string) {
  const { data } = await api.get<{ suggestion: Suggestion }>(`/api/admin/suggestions/${id}`);
  return data;
}
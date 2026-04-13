// Re-export all API services from shared
export { incidentService } from './incidents';
export { sosReportService } from './reports';
export { resourceService } from './resources';

// Default export for convenience
const apiService = {
  incidents: () => ({ /* incidents service */ }),
  reports: () => ({ /* reports service */ }),
  resources: () => ({ /* resources service */ }),
};

export { apiService };

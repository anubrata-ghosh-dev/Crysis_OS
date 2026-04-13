/**
 * API Service - Frontend layer for backend communication
 * Provides functions to call all backend endpoints
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const apiService = {
  // Incidents endpoints
  async getIncidents() {
    try {
      const response = await fetch(`${API_URL}/api/incidents`);
      if (!response.ok) throw new Error('Failed to fetch incidents');
      return await response.json();
    } catch (error) {
      console.error('Error fetching incidents:', error);
      return { success: false, data: [] };
    }
  },

  async getIncident(id: string) {
    try {
      const response = await fetch(`${API_URL}/api/incidents/${id}`);
      if (!response.ok) throw new Error('Failed to fetch incident');
      return await response.json();
    } catch (error) {
      console.error('Error fetching incident:', error);
      return { success: false, data: null };
    }
  },

  async createIncident(incidentData: any) {
    try {
      const response = await fetch(`${API_URL}/api/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incidentData),
      });
      if (!response.ok) throw new Error('Failed to create incident');
      return await response.json();
    } catch (error) {
      console.error('Error creating incident:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  async updateIncident(id: string, updateData: any) {
    try {
      const response = await fetch(`${API_URL}/api/incidents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) throw new Error('Failed to update incident');
      return await response.json();
    } catch (error) {
      console.error('Error updating incident:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  async resolveIncident(id: string) {
    try {
      const response = await fetch(`${API_URL}/api/incidents/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to resolve incident');
      return await response.json();
    } catch (error) {
      console.error('Error resolving incident:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  // Reports endpoints
  async createReport(reportData: any) {
    try {
      const response = await fetch(`${API_URL}/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
      });
      if (!response.ok) throw new Error('Failed to create report');
      return await response.json();
    } catch (error) {
      console.error('Error creating report:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  async getReports() {
    try {
      const response = await fetch(`${API_URL}/api/reports`);
      if (!response.ok) throw new Error('Failed to fetch reports');
      return await response.json();
    } catch (error) {
      console.error('Error fetching reports:', error);
      return { success: false, data: [] };
    }
  },

  // Resources endpoints
  async getResources() {
    try {
      const response = await fetch(`${API_URL}/api/resources`);
      if (!response.ok) throw new Error('Failed to fetch resources');
      return await response.json();
    } catch (error) {
      console.error('Error fetching resources:', error);
      return { success: false, data: { hospitals: [], shelters: [] } };
    }
  },
};

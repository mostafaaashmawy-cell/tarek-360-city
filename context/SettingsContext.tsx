'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { AppSettings, Language, Project } from '@/types';
import { mockSettings, mockProjects, DEFAULT_AI_PROMPT } from '@/lib/mockData';

interface SettingsContextValue {
  settings: AppSettings;
  projects: Project[];
  activeProjectId: string;
  activeProject: Project;
  language: Language;
  isRTL: boolean;
  isLoading: boolean;
  setLanguage: (lang: Language) => void;
  setActiveProjectId: (id: string) => void;
  updateSettings: (partial: Partial<AppSettings>) => Promise<void>;
  createProject: (projectData: Partial<Project>) => Promise<Project>;
  duplicateProject: (projectId: string) => Promise<Project>;
  updateProject: (projectId: string, partial: Partial<Project>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  toggleProjectActive: (projectId: string) => Promise<void>;
  getProjectBySlug: (slug: string) => Project | undefined;
  addMinutes: (
    minutes: number,
    secretCode: string,
    projectId?: string
  ) => Promise<{ success: boolean; error?: string; available_minutes?: number }>;
  deductMinutes: (minutes: number, projectId?: string) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

const LOCAL_STORAGE_PROJECTS_KEY = 'tarek360_projects_v1';
const LOCAL_STORAGE_ACTIVE_PROJ_KEY = 'tarek360_active_proj_v1';
const LOCAL_STORAGE_SETTINGS_KEY = 'tarek360_settings_v1';

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(mockSettings);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [activeProjectId, setActiveProjectIdState] = useState<string>(mockProjects[0].id);
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(false);

  const isRTL = language === 'ar';

  // Synchronize state with central Cloudflare D1 backend (/api/settings)
  const fetchCloudState = useCallback(async () => {
    try {
      const resp = await fetch('/api/settings', { cache: 'no-store' });
      if (resp.ok) {
        const data = await resp.json();
        if (data.settings) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
        }
        if (data.projects && Array.isArray(data.projects) && data.projects.length > 0) {
          setProjects(data.projects);
        }
        if (typeof window !== 'undefined') {
          try {
            if (data.settings) localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(data.settings));
            if (data.projects) localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(data.projects));
          } catch (_) {}
        }
      }
    } catch (e) {
      console.warn('Could not fetch cloud state, using local cache', e);
    }
  }, []);

  // Load from local storage initially and fetch latest cloud state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedSettings = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          if (parsedSettings && typeof parsedSettings === 'object') {
            setSettings((prev) => ({ ...prev, ...parsedSettings }));
          }
        }
        const savedProjects = localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY);
        if (savedProjects) {
          const parsed = JSON.parse(savedProjects);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProjects(parsed);
          }
        }
        const savedActiveId = localStorage.getItem(LOCAL_STORAGE_ACTIVE_PROJ_KEY);
        if (savedActiveId) {
          setActiveProjectIdState(savedActiveId);
        }
      } catch (e) {
        console.error('Failed to load settings/projects from localStorage', e);
      }
    }

    // Fetch live cloud state immediately
    fetchCloudState();

    // Re-fetch whenever window gains focus so multiple open browsers/tabs sync in real-time
    const handleFocus = () => {
      fetchCloudState();
    };
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchCloudState]);

  // Save projects to Cloudflare D1 & localStorage whenever updated
  const persistProjects = useCallback((updatedProjects: Project[], updatedSettings?: AppSettings) => {
    setProjects(updatedProjects);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(updatedProjects));
      } catch (_) {}
    }

    // Push update to Cloudflare D1 backend
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projects: updatedProjects,
        settings: updatedSettings || settings,
      }),
    }).catch((e) => console.warn('Failed to sync projects to cloud', e));
  }, [settings]);

  // Active project helper
  const activeProject =
    projects.find((p) => p.id === activeProjectId) || projects[0] || mockProjects[0];

  // Apply RTL to document
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [language, isRTL]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const setActiveProjectId = useCallback((id: string) => {
    setActiveProjectIdState(id);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_ACTIVE_PROJ_KEY, id);
      } catch (e) {}
    }
  }, []);

  const getProjectBySlug = useCallback(
    (slug: string): Project | undefined => {
      return projects.find((p) => p.slug === slug);
    },
    [projects]
  );

  // ─── CRUD Operations for Multi-Project ─────────────────────────────────────────────
  const createProject = useCallback(
    async (projectData: Partial<Project>): Promise<Project> => {
      const uniqueId = `proj_${Date.now()}`;
      const baseSlug = (projectData.project_name || 'new-project')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const uniqueSlug = `${baseSlug || 'project'}-${Date.now().toString().slice(-4)}`;

      const newProject: Project = {
        id: uniqueId,
        slug: projectData.slug || uniqueSlug,
        is_active: projectData.is_active ?? true,
        company_name: projectData.company_name || activeProject.company_name || 'Tarek Developments',
        company_name_ar: projectData.company_name_ar || activeProject.company_name_ar || 'شركة طارق للتطوير العقاري',
        project_name: projectData.project_name || 'New Project',
        project_name_ar: projectData.project_name_ar || 'مشروع جديد',
        virtual_tour_url:
          projectData.virtual_tour_url ||
          'https://app.seekbeak.com/v/Xw1bK444z5k',
        company_logo_url: projectData.company_logo_url || activeProject.company_logo_url || '/city-scale-logo.png',
        whatsapp_number: projectData.whatsapp_number || '201000000000',
        primary_color: projectData.primary_color || '#6366f1',
        ai_voice: projectData.ai_voice || 'Aoede',
        ai_tone: projectData.ai_tone || 'consultative',
        ai_agent_name: projectData.ai_agent_name || 'Layla',
        ai_prompt: projectData.ai_prompt || DEFAULT_AI_PROMPT,
        available_minutes: projectData.available_minutes ?? 120,
        created_at: new Date().toISOString(),
      };

      const updated = [...projects, newProject];
      persistProjects(updated);
      setActiveProjectId(newProject.id);

      return newProject;
    },
    [projects, activeProject, persistProjects, setActiveProjectId]
  );

  const duplicateProject = useCallback(
    async (projectId: string): Promise<Project> => {
      const source = projects.find((p) => p.id === projectId) || activeProject;
      const uniqueId = `proj_${Date.now()}`;
      const uniqueSlug = `${source.slug}-copy-${Date.now().toString().slice(-4)}`;

      const clonedProject: Project = {
        ...source,
        id: uniqueId,
        slug: uniqueSlug,
        project_name: `${source.project_name} (Copy)`,
        project_name_ar: `${source.project_name_ar} (نسخة)`,
        is_active: true,
        created_at: new Date().toISOString(),
      };

      const updated = [...projects, clonedProject];
      persistProjects(updated);
      setActiveProjectId(clonedProject.id);

      return clonedProject;
    },
    [projects, activeProject, persistProjects, setActiveProjectId]
  );

  const updateProject = useCallback(
    async (projectId: string, partial: Partial<Project>): Promise<void> => {
      const updated = projects.map((p) => {
        if (p.id === projectId) {
          return { ...p, ...partial, updated_at: new Date().toISOString() };
        }
        return p;
      });

      persistProjects(updated);
    },
    [projects, persistProjects]
  );

  const deleteProject = useCallback(
    async (projectId: string): Promise<void> => {
      if (projects.length <= 1) {
        console.warn('Cannot delete the last remaining project.');
        return;
      }
      const updated = projects.filter((p) => p.id !== projectId);
      persistProjects(updated);
      if (activeProjectId === projectId) {
        setActiveProjectId(updated[0].id);
      }
    },
    [projects, activeProjectId, persistProjects, setActiveProjectId]
  );

  const toggleProjectActive = useCallback(
    async (projectId: string): Promise<void> => {
      const project = projects.find((p) => p.id === projectId);
      if (!project) return;
      await updateProject(projectId, { is_active: !project.is_active });
    },
    [projects, updateProject]
  );

  const updateSettings = useCallback(
    async (partial: Partial<AppSettings>) => {
      const updated = { ...settings, ...partial };
      setSettings(updated);

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(updated));
        } catch (_) {}
      }

      // Sync active project if matching
      if (activeProject) {
        await updateProject(activeProject.id, {
          company_name: partial.company_name ?? activeProject.company_name,
          company_name_ar: partial.company_name_ar ?? activeProject.company_name_ar,
          project_name: partial.project_name ?? activeProject.project_name,
          project_name_ar: partial.project_name_ar ?? activeProject.project_name_ar,
          virtual_tour_url:
            partial.virtual_tour_url ?? partial.coohom_url ?? activeProject.virtual_tour_url,
          company_logo_url: partial.company_logo_url ?? activeProject.company_logo_url,
          whatsapp_number: partial.whatsapp_number ?? activeProject.whatsapp_number,
          ai_agent_name: partial.ai_agent_name ?? activeProject.ai_agent_name,
          ai_voice: partial.ai_voice ?? activeProject.ai_voice,
          ai_tone: partial.ai_tone ?? activeProject.ai_tone,
          ai_prompt: partial.ai_prompt ?? activeProject.ai_prompt,
        });
      }

      // Push to Cloudflare D1
      fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: updated, projects }),
      }).catch((e) => console.warn('Failed to sync settings to D1', e));
    },
    [settings, activeProject, updateProject, projects]
  );

  const addMinutes = useCallback(
    async (
      minutes: number,
      secretCode: string
    ): Promise<{ success: boolean; error?: string; available_minutes?: number }> => {
      try {
        const resp = await fetch('/api/add-minutes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ minutes, secretCode }),
        });
        const data = await resp.json();
        if (!resp.ok || !data.success) {
          return { success: false, error: data.error || 'Unauthorized. Invalid secret code.' };
        }

        const newMasterMinutes = Number(((settings.available_minutes ?? 0) + minutes).toFixed(2));

        // Update settings state with new master available minutes
        const updatedSettings: AppSettings = {
          ...settings,
          available_minutes: newMasterMinutes,
        };
        setSettings(updatedSettings);

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(updatedSettings));
          } catch (_) {}
        }

        return { success: true, available_minutes: newMasterMinutes };
      } catch (err: any) {
        return { success: false, error: err.message || 'Network error while adding minutes' };
      }
    },
    [settings]
  );

  const deductMinutes = useCallback(
    async (minutes: number, projectId?: string): Promise<void> => {
      const targetId = projectId || activeProjectId;
      const parsed = Math.max(0, Number(minutes) || 0);
      if (parsed <= 0) return;

      // 1. Deduct from global master available_minutes
      const newGlobalAvailable = Math.max(
        0,
        Number(((settings.available_minutes ?? 0) - parsed).toFixed(2))
      );
      const updatedSettings: AppSettings = {
        ...settings,
        available_minutes: newGlobalAvailable,
      };
      setSettings(updatedSettings);

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(updatedSettings));
        } catch (_) {}
      }

      // 2. Add to the specific project's consumed_minutes
      const updatedProjects = projects.map((p) => {
        if (p.id === targetId) {
          const currentConsumed = p.consumed_minutes ?? 0;
          const nextConsumed = Number((currentConsumed + parsed).toFixed(2));
          return { ...p, consumed_minutes: nextConsumed, updated_at: new Date().toISOString() };
        }
        return p;
      });

      persistProjects(updatedProjects);

      try {
        await fetch('/api/deduct-minutes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ minutes: parsed, projectId: targetId }),
        });
      } catch (_) {}
    },
    [settings, projects, activeProjectId, persistProjects]
  );

  return (
    <SettingsContext.Provider
      value={{
        settings,
        projects,
        activeProjectId,
        activeProject,
        language,
        isRTL,
        isLoading,
        setLanguage,
        setActiveProjectId,
        updateSettings,
        createProject,
        duplicateProject,
        updateProject,
        deleteProject,
        toggleProjectActive,
        getProjectBySlug,
        addMinutes,
        deductMinutes,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}

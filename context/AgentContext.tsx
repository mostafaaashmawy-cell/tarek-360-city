'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
  type ReactNode,
} from 'react';
import type { AgentState, SmartCardData } from '@/types';

// ─── State Shape ─────────────────────────────────────────────────────────────
interface AgentContextState {
  agentState: AgentState;
  smartCardsVisible: boolean;
  smartCards: SmartCardData[];
  isMuted: boolean;
  interactionCount: number;
  isLeadModalOpen: boolean;
  leadCaptured: boolean;
}

// ─── Actions ─────────────────────────────────────────────────────────────────
type AgentAction =
  | { type: 'SET_STATE'; payload: AgentState }
  | { type: 'SHOW_CARDS'; payload: SmartCardData[] }
  | { type: 'HIDE_CARDS' }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'INCREMENT_INTERACTION' }
  | { type: 'SET_LEAD_MODAL'; payload: boolean }
  | { type: 'SET_LEAD_CAPTURED'; payload: boolean }
  | { type: 'RESET' };

// ─── Context Interface ────────────────────────────────────────────────────────
interface AgentContextValue extends AgentContextState {
  setAgentState: (state: AgentState) => void;
  showSmartCards: (cards: SmartCardData[]) => void;
  hideSmartCards: () => void;
  toggleMute: () => void;
  incrementInteractionCount: () => void;
  setIsLeadModalOpen: (open: boolean) => void;
  setLeadCaptured: (captured: boolean) => void;
  reset: () => void;
}

// ─── Reducer ─────────────────────────────────────────────────────────────────
const initialState: AgentContextState = {
  agentState: 'idle',
  smartCardsVisible: false,
  smartCards: [],
  isMuted: false,
  interactionCount: 0,
  isLeadModalOpen: false,
  leadCaptured: false,
};

function agentReducer(
  state: AgentContextState,
  action: AgentAction,
): AgentContextState {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, agentState: action.payload };
    case 'SHOW_CARDS':
      return { ...state, smartCardsVisible: true, smartCards: action.payload };
    case 'HIDE_CARDS':
      return { ...state, smartCardsVisible: false };
    case 'TOGGLE_MUTE':
      return { ...state, isMuted: !state.isMuted };
    case 'INCREMENT_INTERACTION':
      return { ...state, interactionCount: state.interactionCount + 1 };
    case 'SET_LEAD_MODAL':
      return { ...state, isLeadModalOpen: action.payload };
    case 'SET_LEAD_CAPTURED':
      return { ...state, leadCaptured: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AgentContext = createContext<AgentContextValue | undefined>(undefined);

export function AgentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(agentReducer, initialState);

  const setAgentState = useCallback((s: AgentState) => {
    dispatch({ type: 'SET_STATE', payload: s });
  }, []);

  const showSmartCards = useCallback((cards: SmartCardData[]) => {
    dispatch({ type: 'SHOW_CARDS', payload: cards });
  }, []);

  const hideSmartCards = useCallback(() => {
    dispatch({ type: 'HIDE_CARDS' });
  }, []);

  const toggleMute = useCallback(() => {
    dispatch({ type: 'TOGGLE_MUTE' });
  }, []);

  const incrementInteractionCount = useCallback(() => {
    dispatch({ type: 'INCREMENT_INTERACTION' });
  }, []);

  const setIsLeadModalOpen = useCallback((open: boolean) => {
    dispatch({ type: 'SET_LEAD_MODAL', payload: open });
  }, []);

  const setLeadCaptured = useCallback((captured: boolean) => {
    dispatch({ type: 'SET_LEAD_CAPTURED', payload: captured });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return (
    <AgentContext.Provider
      value={{
        ...state,
        setAgentState,
        showSmartCards,
        hideSmartCards,
        toggleMute,
        incrementInteractionCount,
        setIsLeadModalOpen,
        setLeadCaptured,
        reset,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error('useAgent must be used within AgentProvider');
  return ctx;
}

import { create } from 'zustand';

export const useEngineStore = create((set) => ({
  heatmap: {},
  guards: [],
  zones: [],
  routes: [],
  routeHeatmap: {},
  activeEvent: null,
  predictionAlert: null,
  focusedLocation: null,
  
  setHeatmap: (data) => set({ heatmap: data }),
  setGuards: (guards) => set({ guards }),
  setZones: (zones) => set({ zones }),
  setRoutes: (routes) => set({ routes }),
  setRouteHeatmap: (data) => set({ routeHeatmap: data }),
  setActiveEvent: (event) => set({ activeEvent: event }),
  setPredictionAlert: (alert) => set({ predictionAlert: alert }),
  clearPredictionAlert: () => set({ predictionAlert: null }),
  setDispatch: (dispatchData) => set({ dispatchActive: dispatchData }),
  clearDispatch: () => set({ dispatchActive: null }),
  setFocusedLocation: (loc) => set({ focusedLocation: loc }),
}));

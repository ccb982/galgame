import { create } from 'zustand';
import { generateVisitorId } from '../utils/visitorId';

const useGameStore = create((set, get) => ({
  visitorId: localStorage.getItem('visitorId') || generateVisitorId(),
  currentGameId: null,
  currentScene: null,
  variables: {},

  setCurrentGameId: (gameId) => set({ currentGameId: gameId }),
  setCurrentScene: (scene) => set({ currentScene: scene }),
  setVariables: (variables) => set({ variables }),
  updateVariable: (key, value) => set((state) => ({
    variables: { ...state.variables, [key]: value }
  })),

  // 初始化游客 ID
  initVisitorId: () => {
    const visitorId = localStorage.getItem('visitorId');
    if (!visitorId) {
      const newVisitorId = generateVisitorId();
      localStorage.setItem('visitorId', newVisitorId);
      set({ visitorId: newVisitorId });
    }
  }
}));

export { useGameStore };
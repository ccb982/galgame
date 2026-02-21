import { create } from 'zustand';

const useSaveStore = create((set, get) => ({
  saves: [],
  loading: false,

  setSaves: (saves) => set({ saves }),
  setLoading: (loading) => set({ loading }),

  addSave: (save) => set((state) => ({
    saves: [...state.saves, save]
  })),

  removeSave: (saveId) => set((state) => ({
    saves: state.saves.filter(save => save.id !== saveId)
  })),

  updateSave: (updatedSave) => set((state) => ({
    saves: state.saves.map(save => 
      save.id === updatedSave.id ? updatedSave : save
    )
  })),

  clearSaves: () => set({ saves: [] })
}));

export { useSaveStore };
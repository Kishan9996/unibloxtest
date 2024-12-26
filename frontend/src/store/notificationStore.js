import { create } from 'zustand';

const useSnackbarStore = create((set) => ({
  snackbarOpen: false,
  snackbarMessage: '',
  snackbarSeverity: 'success', // 'success', 'error', 'warning', 'info'

  // Method to show the Snackbar
  showSnackbar: (message, severity = 'success') =>
    set({ snackbarOpen: true, snackbarMessage: message, snackbarSeverity: severity }),

  // Method to close the Snackbar
  closeSnackbar: () => set({ snackbarOpen: false }),
}));

export default useSnackbarStore;
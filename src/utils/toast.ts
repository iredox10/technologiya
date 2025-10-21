import toast from 'react-hot-toast';

// Custom toast styles matching your theme
const toastStyles = {
  success: {
    duration: 4000,
    style: {
      background: '#10b981',
      color: '#fff',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '14px',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10b981',
    },
  },
  error: {
    duration: 5000,
    style: {
      background: '#ef4444',
      color: '#fff',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '14px',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#ef4444',
    },
  },
  warning: {
    duration: 4000,
    style: {
      background: '#f59e0b',
      color: '#fff',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '14px',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#f59e0b',
    },
  },
  info: {
    duration: 4000,
    style: {
      background: '#3b82f6',
      color: '#fff',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '14px',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#3b82f6',
    },
  },
};

export const showSuccessToast = (message: string) => {
  toast.success(message, toastStyles.success);
};

export const showErrorToast = (message: string) => {
  toast.error(message, toastStyles.error);
};

export const showWarningToast = (message: string) => {
  toast(message, {
    icon: '⚠️',
    ...toastStyles.warning,
  });
};

export const showInfoToast = (message: string) => {
  toast(message, {
    icon: 'ℹ️',
    ...toastStyles.info,
  });
};

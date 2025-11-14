import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const toastConfig = {
  toast: true,
  position: 'bottom-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  // background: '#ffffff',
  // color: '#2ECC71'
};

export const Alerts = {
  // Alerta de éxito
  success: (message) => {
    MySwal.fire({
      ...toastConfig,
      icon: 'success',
      title: message,
    });
  },

  // Alerta de error
  error: (message) => {
    MySwal.fire({
      ...toastConfig,
      icon: 'error',
      title: message,
      color: '#ff0000'
    });
  },

  // Alerta de información
  info: (message) => {
    MySwal.fire({
      ...toastConfig,
      icon: 'info',
      title: message,
      color: '#00c9ff'
    });
  },

  // Alerta de advertencia
  warning: (message) => {
    MySwal.fire({
      ...toastConfig,
      icon: 'warning',
      title: message,
      color: '#ffd500'
    });
  },

  // Confirmación (personalizable)
  confirm: (options) => {
    return MySwal.fire({
      title: options.title || '¿Estás seguro?',
      text: options.text || '',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: options.confirmText || 'Sí, continuar',
      cancelButtonText: options.cancelText || 'Cancelar',
      background: '#ffffff',
      color: '##1a1a1a'
    });
  },

  // Carga (loading) con método close()
  loading: (message = 'Cargando...') => {
    MySwal.fire({
      title: message,
      allowOutsideClick: false,
      allowEscapeKey: false, // Evitar cerrar con ESC
      showConfirmButton: false, 
      didOpen: () => {
        MySwal.showLoading();
      },
      background: '#1a1a1a',
      color: '#ffffff'
    });
    
    return {
      close: () => MySwal.close()
    };
  }
};

// Cierre manual de alertas
export const closeAlert = () => {
  MySwal.close();
};
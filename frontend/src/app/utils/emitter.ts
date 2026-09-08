import { toast } from "react-toastify";

export const successEmitter = (mesage: string, theme: string) => {
  toast.success(mesage, {
    position: "top-center",
    autoClose: 1200,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme,
  });
};

export const errorEmitter = (message: string, theme: string) => {
  toast.error(message, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme,
  });
};

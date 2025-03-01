import { toast } from "react-toastify";

export class ToastError {
  static serialize(error) {
    if (error) {
      try {
        error.data.errors.forEach((el) => {
          toast.error(el.message);
        });
      } catch (err) {
        toast.error("Unknown error occured.");
      }
    }
  }
}

import { ReactNode } from "react";

const ErrorMessage = ({ children }) => {
  return <p className="text-red-500 text-sm">{children}</p>;
};

export default ErrorMessage;

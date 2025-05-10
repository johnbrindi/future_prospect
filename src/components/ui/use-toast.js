import * as React from "react";
import { motion } from "framer-motion";
import { useToast, toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const ToastItem = ({ id, title, description }) => {
  return (
    <motion.div
      key={id}
      className={cn("toast-item")}
      initial={{ opacity: 0, translateY: -20 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </motion.div>
  );
};

const ToastContainer = () => {
  const { toasts } = useToast();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </div>
  );
};

export { ToastContainer };
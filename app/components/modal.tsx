import { useNavigate } from "@remix-run/react";
import { Portal } from "./portal";

type props = {
  children: React.ReactNode;
  isOpen: boolean;
  ariaLabel?: string;
  className?: string;
};

export function Modal({ children, isOpen, ariaLabel, className }: props) {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    <Portal wrapperId="modal">
      <div
        className="fixed inset-0 overflow-y-auto bg-gray-300 bg-opacity-40 transition-all duration-300"
        aria-labelledby={ariaLabel ?? "modal-title"}
        role="dialog"
        aria-modal="true"
        onClick={() => navigate("/home")}
      ></div>
      <div className="fixed inset-0 pointer-events-none flex justify-center items-center max-h-screen overflow-scroll">
        <div
          className={`${className} p-4 bg-yellow-300 shadow-lg pointer-events-auto max-h-screen md:rounded-xl`}
        >
          {/* This is where the modal content is rendered  */}
          {children}
        </div>
      </div>
    </Portal>
  );
}

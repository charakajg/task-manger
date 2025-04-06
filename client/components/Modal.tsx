import React, { ReactNode } from 'react';

interface ModalProps {
  title: string;
  onClose: () => void;
  onAction: () => void;
  actionLabel: ReactNode;
  children: React.ReactNode;
  actionDisabled?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  title,
  onClose,
  onAction,
  actionLabel,
  children,
  actionDisabled = false,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        {children}

        <div className="modal-buttons">
          <button
            className="btn-dal btn-action"
            onClick={onAction}
            disabled={actionDisabled}>
            {actionLabel}
          </button>
          <button className="btn-dal" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

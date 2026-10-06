import { useEffect, useRef, type ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ isOpen, title, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Native <dialog> gives us focus trapping, Escape handling and the backdrop for free.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog className="modal" ref={dialogRef} aria-labelledby="modal-title" onClose={onClose}>
      <div className="modal__header">
        <h2 id="modal-title">{title}</h2>
        <button className="modal__close" type="button" aria-label="Close" onClick={onClose}>×</button>
      </div>
      {isOpen && <div className="modal__body">{children}</div>}
    </dialog>
  );
}

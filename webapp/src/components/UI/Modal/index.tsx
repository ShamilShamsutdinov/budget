import type { PropsWithChildren } from "react";
import ReactDOM from 'react-dom'

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;

}

export const Modal = ({isOpen, onClose, children}: PropsWithChildren<ModalProps>) => {
   if(!isOpen) return null
   return ReactDOM.createPortal(
     <div className="modal">
        <div className="modal-content">
            <button className="modal-close" onClick={onClose}>
                <i className="fas fa-times"></i>
            </button>
            {children}
        </div>
        <div className="modal-overlay" onClick={onClose}></div>
     </div>,
     document.body
   )
}
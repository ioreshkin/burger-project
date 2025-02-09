import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import styles from './modal.module.css';
import {CloseIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import ModalOverlay from "../modal-overlay/ModalOverlay.tsx";

interface MyComponentProps {
    children: React.ReactNode;
    onClose: () => void;
}

const Modal = ({ children, onClose } : MyComponentProps) => {

    const [modalRoot, setModalRoot] = React.useState<HTMLElement>();

    useEffect(() => {
        const root = document.getElementById('modal-root');
        if (!root) {
            const div = document.createElement('div');
            div.id = 'modal-root';
            document.body.appendChild(div);
            setModalRoot(div);
        } else {
            setModalRoot(root);
        }
    }, [])

    React.useEffect(() => {
        const escapePressHandler = (e: KeyboardEvent) => {
            if (e.key === "Escape" || e.code === "Escape") {
                onClose();
            }
        }
        document.addEventListener("keydown", escapePressHandler);
        return () => {
            document.removeEventListener("keydown", escapePressHandler);
        }
    }, []);

    const handleClick = (e:React.SyntheticEvent<HTMLElement>) => {
        if (!e.currentTarget.id) return;
        if (e.currentTarget.id === 'modal-overlay') {
            onClose();
        }
        e.stopPropagation();
    }

    if (!children || (!children[0] && !children[1])) return null;

    return ReactDOM.createPortal(
        (
            <ModalOverlay onClick={handleClick}>
                <div className={styles.container}>
                    <CloseIcon
                        type="primary" className={`${styles.close} mt-15 mr-10`} onClick={onClose}
                    />
                    {children}
                </div>
            </ModalOverlay>
        ),
        modalRoot
    );
};

export default Modal;
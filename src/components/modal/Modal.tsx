import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import styles from './modal.module.css';
import {CloseIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import ModalOverlay from "../modal-overlay/ModalOverlay.tsx";

interface MyComponentProps {
    modal: string;
    closeModal: () => void;
    overlayClickHandler: (e: React. SyntheticEvent<HTMLElement>) => void;
    children: React.ReactNode;
}

const Modal = ({modal, closeModal, overlayClickHandler, children} : MyComponentProps) => {

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
                closeModal();
            }
        }
        document.addEventListener("keydown", escapePressHandler);
        return () => {
            document.removeEventListener("keydown", escapePressHandler);
        }
    }, []);

    if (modal === '') return null;

    return ReactDOM.createPortal(
        (
            <ModalOverlay onClick={overlayClickHandler}>
                <div className={styles.container}>
                    <CloseIcon
                        type="primary" className={`${styles.close} mt-15 mr-10`} onClick={closeModal}
                    />
                    {children}
                </div>
            </ModalOverlay>
        ),
        modalRoot
    );
};

export default Modal;
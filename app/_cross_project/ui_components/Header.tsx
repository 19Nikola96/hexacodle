"use client";

import {
  Modal,
  ModalAnimation,
} from "@/app/reusable_in_other_projetcs/Modal/Modal";
import { useModal } from "@/app/reusable_in_other_projetcs/Modal/useModal";
import Hamburger from "hamburger-react";

const Header = () => {
  const { isOpen, openModal, closeModal, modalRef } = useModal();

  return (
    <>
      <div className="flex justify-end z-10">
        <Hamburger
          toggled={isOpen}
          onToggle={(toggled) => {
            if (toggled) {
              openModal();
            } else {
              closeModal();
            }
          }}
          rounded
          size={24}
        />
      </div>
      <Modal
        modalRef={modalRef}
        isOpen={isOpen}
        className="h-full w-full rounded-none p-0"
        customModalAnimation={ModalAnimation.menu}
      >
        <div className="flex justify-end z-10">
          <Hamburger
            toggled={isOpen}
            onToggle={(toggled) => {
              if (toggled) {
                openModal();
              } else {
                closeModal();
              }
            }}
            rounded
            size={24}
          />
        </div>
      </Modal>
    </>
  );
};

export default Header;

"use client";

import DarkModeToggle from "@/app/_cross_project/ui_components/DarkModeToggle";
import {
  Modal,
  ModalAnimation,
} from "@/app/reusable_in_other_projetcs/Modal/Modal";
import { useModal } from "@/app/reusable_in_other_projetcs/Modal/useModal";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { AiFillClockCircle } from "react-icons/ai";
import { RiInfinityLine } from "react-icons/ri";
import { Sling as Hamburger } from "hamburger-react";

const Header = () => {
  const { isOpen, openModal, closeModal, modalRef } = useModal({
    blockOutsideClosing: false,
  });
  const pathname = usePathname();
  const isPathnameHome = useMemo(() => pathname === "/", [pathname]);

  return (
    <>
      <div className="flex justify-between z-40 items-center">
        <DarkModeToggle />
        <Link href={isPathnameHome ? "/unlimited" : "/"} className="p-3">
          {isPathnameHome ? (
            <RiInfinityLine
              size={24}
              className="grow-in-animation dark:text-white"
            />
          ) : (
            <AiFillClockCircle
              size={24}
              className="grow-in-animation dark:text-white"
            />
          )}
        </Link>
        <Hamburger
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
        className="h-full w-full rounded-none pt-14 px-8 dark:bg-slate-800"
        customModalAnimation={ModalAnimation.menu}
      >
        <div></div>
      </Modal>
    </>
  );
};

export default Header;

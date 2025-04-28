"use client";

import DarkModeToggle from "@/app/_cross_project/ui_components/DarkModeToggle";
import {
  Modal,
  ModalAnimation,
} from "@/app/reusable_in_other_projetcs/Modal/Modal";
import { useModal } from "@/app/reusable_in_other_projetcs/Modal/useModal";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { AiFillClockCircle } from "react-icons/ai";
import { RiInfinityLine } from "react-icons/ri";
import { Sling as Hamburger } from "hamburger-react";
import { cn } from "@/app/_cross_project/utils";

const Header = () => {
  const { isOpen, openModal, closeModal, modalRef } = useModal({
    blockOutsideClosing: false,
  });
  const [isClicked, setIsClicked] = useState(false);

  const pathname = usePathname();
  const isPathnameHome = useMemo(() => pathname === "/", [pathname]);

  return (
    <>
      <header className="flex justify-between z-40 items-center">
        <DarkModeToggle />
        <Link
          href={isPathnameHome ? "/unlimited" : "/"}
          className={cn("p-3", isClicked ? "clicked-button-animation" : "")}
          onClick={() => {
            setIsClicked(true);
            setTimeout(() => {
              setIsClicked(false);
            }, 200);
          }}
        >
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
      </header>
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

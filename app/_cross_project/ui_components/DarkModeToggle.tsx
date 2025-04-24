import { cn } from "@/app/_cross_project/utils";
import {
  Modal,
  ModalAnimation,
} from "@/app/reusable_in_other_projetcs/Modal/Modal";
import { useModal } from "@/app/reusable_in_other_projetcs/Modal/useModal";
import { useEffect, useState } from "react";
import { BiSolidMoon } from "react-icons/bi";
import { PiSunFill } from "react-icons/pi";

const DarkModeToggle = () => {
  const { isOpen, openModal, closeModal, modalRef } = useModal({
    blockOutsideClosing: true,
  });
  const [isToggled, setIsToggled] = useState(false);

  useEffect(() => {
    if (isToggled) {
      openModal();
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      closeModal();
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [closeModal, isToggled, openModal]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");

      if (storedTheme === "dark") {
        setIsToggled(true);
        document.documentElement.classList.add("dark");
      } else {
        setIsToggled(false);
        document.documentElement.classList.add("light");
      }
    }
  }, []);

  return (
    <>
      <button
        type="button"
        className="cursor-pointer p-2 z-50"
        onClick={() => setIsToggled((prev) => !prev)}
      >
        <div className="transition-all neomorphism rounded-full flex w-10 h-10 justify-center items-start overflow-hidden">
          <div
            className={cn(
              "transition-all duration-300 mt-2 flex flex-col gap-2 ",
              isToggled ? "rotate-180 text-white" : "rotate-0",
            )}
          >
            <PiSunFill size={24} />
            <BiSolidMoon size={24} className="rotate-180" />
          </div>
        </div>
      </button>
      <Modal
        modalRef={modalRef}
        isOpen={isOpen}
        className="h-full w-full rounded-none"
        customModalAnimation={ModalAnimation["dark-mode"]}
        zIndex="-z-10"
      >
        <div></div>
      </Modal>
    </>
  );
};

export default DarkModeToggle;

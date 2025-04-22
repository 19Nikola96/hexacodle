"use client";

import { cn } from "@/app/_cross_project/utils";
import useIsMobile from "@/app/reusable_in_other_projetcs/hooks/useIsMobile";
import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export enum ModalAnimation {
  grow = "grow",
  translate = "translate",
  menu = "menu",
}

type ModalProps = {
  children: ReactNode;
  isOpen: boolean;
  modalRef: React.RefObject<HTMLDivElement>;
  className?: string;
  customModalAnimation?: ModalAnimation;
};

export const OVERLAY_CONTAINER_HTML_ID = "modal_root";

export const Modal = ({
  children,
  isOpen,
  modalRef,
  className,
  customModalAnimation,
  ...props
}: ModalProps) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [animationClass, setAnimationClass] = useState("");
  const [backgroundAnimationClass, setBackgroundAnimationClass] = useState("");
  const isMobile = useIsMobile();

  const defaultModalAnimation = isMobile
    ? ModalAnimation.translate
    : ModalAnimation.grow;

  const modalAnimation = customModalAnimation ?? defaultModalAnimation;

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setBackgroundAnimationClass("background-fade-in-animation");
      setAnimationClass(`${modalAnimation}-in-animation`);
    } else {
      setBackgroundAnimationClass("background-fade-out-animation");
      setAnimationClass(`${modalAnimation}-out-animation`);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isOpen, modalAnimation]);

  if (!isVisible) return null;

  const modalRoot = document.getElementById(OVERLAY_CONTAINER_HTML_ID);

  return modalRoot
    ? createPortal(
        <div
          className={cn(
            "flex h-full w-full items-end justify-center",
            "lg:items-center",
            "fixed left-0 top-0",
            isOpen ? "nonScrollablePage" : "",
            backgroundAnimationClass,
          )}
          {...props}
        >
          <div
            ref={modalRef}
            className={cn(
              "rounded-t-xl bg-[#ededed] p-3 shadow-md",
              "sm:max-w-[80%] sm:rounded-xl",
              animationClass,
              className,
            )}
          >
            {children}
          </div>
        </div>,
        modalRoot,
      )
    : null;
};

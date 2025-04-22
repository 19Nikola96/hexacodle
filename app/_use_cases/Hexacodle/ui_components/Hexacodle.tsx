"use client";

import Header from "@/app/_cross_project/ui_components/Header";
import { useHexacodle } from "@/app/_use_cases/Hexacodle/domain/useHexacodle";
import ColoredSquare from "@/app/_use_cases/Hexacodle/ui_components/ColoredSquare";
import CurrentGuess from "@/app/_use_cases/Hexacodle/ui_components/CurrentGuess";
import EmojiGuesses from "@/app/_use_cases/Hexacodle/ui_components/EmojiGuesses";
import Guesses from "@/app/_use_cases/Hexacodle/ui_components/Guesses";
import KeyBoard from "@/app/_use_cases/Hexacodle/ui_components/KeyBoard";
import { Modal } from "@/app/reusable_in_other_projetcs/Modal/Modal";

const Hexacodle = () => {
  const {
    targetHexColor,
    guessedHexColors,
    currentGuess,
    selectedTile,
    modalRef,
    isOpen,
    isValidateButtonEnable,
    setSelectedTile,
    updateGuess,
    validateGuess,
  } = useHexacodle();

  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="flex flex-col items-center justify-between gap-5 h-full pt-3">
        <div className="flex gap-5">
          <ColoredSquare hexColor={targetHexColor} label="Target" />
          <ColoredSquare guessedHexColors={guessedHexColors} label="Guess" />
        </div>
        <Guesses guessedHexColors={guessedHexColors} />
        <div className="flex flex-col gap-2 items-center justify-center">
          <CurrentGuess
            currentGuess={currentGuess}
            selectedTile={selectedTile}
            setSelectedTile={setSelectedTile}
          />
          <KeyBoard
            updateGuess={updateGuess}
            validateGuess={validateGuess}
            isValidateButtonEnable={isValidateButtonEnable}
          />
        </div>
      </div>
      <Modal isOpen={isOpen} modalRef={modalRef} className="h-2/3 w-full">
        <EmojiGuesses finalGuesses={guessedHexColors} />
      </Modal>
    </div>
  );
};

export default Hexacodle;

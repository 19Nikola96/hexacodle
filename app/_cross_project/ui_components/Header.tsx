"use client";

import Hamburger from "hamburger-react";
import { useState } from "react";

const Header = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="flex justify-end">
      <Hamburger toggled={isOpen} toggle={setOpen} rounded size={20} />
    </div>
  );
};

export default Header;

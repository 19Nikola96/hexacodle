import dynamic from "next/dynamic";

const ColoredSquare = dynamic(() => import("./ColoredSquare"), { ssr: false });

export default ColoredSquare;

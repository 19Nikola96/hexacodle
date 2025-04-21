import { FaCheckCircle } from "react-icons/fa";
import {
  RiArrowDownDoubleLine,
  RiArrowDownSLine,
  RiArrowUpDoubleLine,
  RiArrowUpSLine,
} from "react-icons/ri";

type ClosenessIconProps = {
  closeness: number;
  delay: string;
};

const ClosenessIcon = ({ closeness, delay }: ClosenessIconProps) => {
  return (
    <>
      <>
        {closeness === -2 && (
          <RiArrowDownDoubleLine
            className="bg-red-500 rounded-full grow-in-animation"
            color="white"
            style={{ animationDelay: delay }}
          />
        )}
      </>
      <>
        {closeness === 2 && (
          <RiArrowUpDoubleLine
            className="bg-red-500 rounded-full grow-in-animation"
            color="white"
            style={{ animationDelay: delay }}
          />
        )}
      </>
      <>
        {closeness === -1 && (
          <RiArrowDownSLine
            className="bg-orange-400 rounded-full grow-in-animation"
            color="white"
            style={{ animationDelay: delay }}
          />
        )}
      </>
      <>
        {closeness === 1 && (
          <RiArrowUpSLine
            className="bg-orange-400 rounded-full grow-in-animation"
            color="white"
            style={{ animationDelay: delay }}
          />
        )}
      </>
      <>
        {closeness === 0 && (
          <FaCheckCircle
            color="green"
            className="grow-in-animation"
            style={{ animationDelay: delay }}
          />
        )}
      </>
    </>
  );
};

export default ClosenessIcon;

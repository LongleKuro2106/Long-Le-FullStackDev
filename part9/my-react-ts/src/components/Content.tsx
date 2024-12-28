import Part from "./Part";
import { CoursePart } from "../App";

interface ContentProps {
  courseParts: CoursePart[];
};

const Content = ({ courseParts }: ContentProps) => {
  return (
    <>
      {courseParts.map(part => (
        <Part key={part.name} part={part}/>
      ))}
    </>
  );
};

export default Content;
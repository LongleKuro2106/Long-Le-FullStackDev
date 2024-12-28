import { CoursePart } from "../App";

interface PartProps {
  part: CoursePart;
};

const Part = ({ part }: PartProps) => {
  switch (part.kind) {
    case "basic":
      return (
        <p>
          <strong>{part.name}</strong> {part.exerciseCount} exercises
          <br />
          {part.description && <em>{part.description}</em>}
        </p>
      );
    case "group":
      return (
        <p>
          <strong>{part.name}</strong> {part.exerciseCount} exercises
          <br />
          Group projects: {part.groupProjectCount}
        </p>
      );
    case "background":
      return (
        <p>
          <strong>{part.name}</strong> {part.exerciseCount} exercises
          <br />
          <em>{part.description}</em>
          <br />
          Background material: <a href={part.backgroundMaterial}>{part.backgroundMaterial}</a>
        </p>
      );
    case "special":
      return (
        <p>
          <strong>{part.name}</strong> {part.exerciseCount} exercises
          <br />
          <em>{part.description}</em>
          <br />
          Requirements: {part.requirements.join(", ")}
        </p>
      );
    default:
      return null;
  }
};

export default Part;
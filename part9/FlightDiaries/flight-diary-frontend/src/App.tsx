import { useEffect, useState } from "react";
import { Diaries, NewDiaries } from "./types";
import { getAllDiaries, createDiaries } from "./service/diaryService";
import DiaryForm from "./components/DiaryForm";
import DiaryList from "./components/DiaryList";
import axios from "axios";

interface ValidationError {
  error: Array<{
    code: string;
    message: string;
    path: string[];
    received?: string;
    options?: string[];
  }>;
};

const App = () => {
  const [diaries, setDiaries] = useState<Diaries[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    getAllDiaries().then(data => {
      setDiaries(data);
    });
  }, []);



  const handleAddDiary = async (newDiary: NewDiaries) => {
    try {
      const data = await createDiaries(newDiary);
      setDiaries(diaries.concat(data));
      setErrorMessage(null);
    } catch (error) {
      if (axios.isAxiosError<ValidationError>(error)) {
        const errorResponse = error.response?.data;
         // Check if the error response matches the ValidationError structure
        if (errorResponse && Array.isArray(errorResponse.error)) {
          const detailedErrors = errorResponse.error.map(err => {
            const path = err.path.join('.'); // Join path array for better readability
            const received = err.received ? `: "${err.received}"` : '';
            const options = err.options ? `; Expected one of: ${err.options.join(', ')}` : '';
            return `Error: Incorrect "${path}"${received}${options}`;
          }).join('; '); // Use semicolon for separation
          setErrorMessage(detailedErrors);
        } else {
          setErrorMessage("An unexpected error occurred.");
        }
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <div>

      <DiaryForm onAddDiary={handleAddDiary} />
      {errorMessage && <div className="error">{errorMessage}</div>}
      <DiaryList diaries={diaries} />
    </div>
  );
};

export default App;
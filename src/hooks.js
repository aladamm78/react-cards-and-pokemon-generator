import { useState, useEffect, useCallback } from "react";
import axios from "axios";

// useFlip Hook
function useFlip(initialFlipState = true) {
  const [isFlipped, setIsFlipped] = useState(initialFlipState);

  const flip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  return [isFlipped, flip];
}

// useAxios Hook
function useAxios(keyInLS, baseUrl) {
  const [responses, setResponses] = useLocalStorage(keyInLS);

  const addResponseData = useCallback(
    async (formatter = data => data, restOfUrl = "") => {
      try {
        const { data } = await axios.get(`${baseUrl}${restOfUrl}`);
        const formattedData = formatter(data);
        setResponses(prevData => [...prevData, formattedData]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    [baseUrl, setResponses]
  );

  const clearResponses = useCallback(() => setResponses([]), [setResponses]);

  return [responses, addResponseData, clearResponses];
}

// useLocalStorage Hook
function useLocalStorage(key, initialValue = []) {
  const [value, setValue] = useState(() => {
    const savedValue = localStorage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export { useFlip, useAxios, useLocalStorage };

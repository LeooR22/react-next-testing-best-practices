import {useEffect, useState} from "react";

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export const useGetTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/todos");

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = (await response.json()) as Todo[];

        setTodos(data);
        setError(null);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";

        setError(new Error(errorMessage));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  return {todos, isLoading, error};
};

import {renderHook, waitFor} from "@testing-library/react";

import {useGetTodos} from "@/hooks/use-get-todos";

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const mockTodos: Todo[] = [
  {
    userId: 1,
    id: 1,
    title: "delectus aut autem",
    completed: false,
  },
];

global.fetch = jest.fn();

describe("useGetTodos", () => {
  beforeEach(() => {
    // Reset all mock before each test
    jest.clearAllMocks();
  });

  it("should fetch todos successfully", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTodos,
    });

    const {result} = renderHook(() => useGetTodos());

    // initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.todos).toEqual([]);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // check final state
    expect(result.current.todos).toEqual(mockTodos);
    expect(result.current.error).toBeNull();
    expect(global.fetch).toHaveBeenCalledWith("https://jsonplaceholder.typicode.com/todos");
  });

  it("should handle fetch error", async () => {
    const errorMessage = "Network error";

    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const {result} = renderHook(() => useGetTodos());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.todos).toEqual([]);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Check final state
    expect(result.current.todos).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(errorMessage);
  });

  it("should handle non-ok response", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    const {result} = renderHook(() => useGetTodos());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.todos).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toContain("404");
  });
});

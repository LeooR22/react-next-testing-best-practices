"use client";

import {useState} from "react";

import {Button} from "@/components/ui/button";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h2>{count}</h2>
      <Button onClick={() => setCount(count + 1)}>+</Button>
    </>
  );
}

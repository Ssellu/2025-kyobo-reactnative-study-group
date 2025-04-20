import { useState } from "react";

export default function useCounter(initialCount = 0) {
  const [count, setCount] = useState(initialCount);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(Math.max(count - 1, 0)); // 음수 방지
  const reset = () => setCount(initialCount);

  return { count, increment, decrement, reset };
}

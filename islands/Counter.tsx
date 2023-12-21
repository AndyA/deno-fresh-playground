import { Button } from "../components/Button.tsx";

import type { Signal } from "@preact/signals";

interface CounterProps {
  count: Signal<number>;
}

export default function Counter(props: CounterProps) {
  return (
    <div class="counter">
      <Button onClick={() => props.count.value -= 1}>-1</Button>
      <Button onClick={() => props.count.value += 1}>+1</Button>
      <p>{props.count}</p>
    </div>
  );
}

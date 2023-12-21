import { useSignal } from "@preact/signals";
import Counter from "../islands/Counter.tsx";

export default function Home() {
  const count1 = useSignal(3);
  const count2 = useSignal(999999999);
  return (
    <div>
      <div>
        <h1>Welcome to Fresh</h1>
        <p>
          Try changing this message in the
          <code>./routes/index.tsx</code> file.
        </p>
        <Counter count={count1} />
        <Counter count={count1} />
        <Counter count={count2} />
      </div>
    </div>
  );
}

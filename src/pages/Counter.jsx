import { useEffect, useRef, useState } from "react";

const Counter = () => {
  console.log('Counter')
  const [count, setCount] = useState(0);
  const [prevCount, setPrevCount] = useState(0);
  const prevCountRef = useRef(0);

  useEffect(() => {
    setPrevCount(count-1);
  }, [count]);

  return (
    <div style={{marginTop:"200px",marginBottom:"100px"}}>
      <p>Current Count: {count}</p>
      <p>Previous Count: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>Increase</button>
    </div>
  );
};
export default Counter;
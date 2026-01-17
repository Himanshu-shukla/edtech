
import useRevealOnScroll from "./hooks/useRevealOnScroll";
import HomePage from "./pages/Home";

export default function App() {
  useRevealOnScroll();
  return (
    <>
      <HomePage />
    </>
  );
}

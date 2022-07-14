import Hexasphere from "./hexaspherejs/hexasphere";

export default function App() {
  const hexasphere = new Hexasphere(15, 5, 0.9);

  return <h1>Hello, world!</h1>;
}

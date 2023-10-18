import Header from "./components/header";
import App from "../sia/sia";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <App></App>
      </main>
    </>
  );
}

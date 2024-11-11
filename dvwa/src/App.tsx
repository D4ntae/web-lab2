import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import {Home} from "./pages/Home";
import {Sqli} from "./pages/Sqli";
import {Csrf} from "./pages/Csrf";
import {Dashboard} from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <div className="app flex h-full flex-col ">
        <Navbar />
        <main className="h-full bg-slate-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sqli" element={<Sqli />} />
            <Route path="/csrf" element={<Csrf />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

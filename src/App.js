import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Resume from "./pages/Resume";
import Project from "./pages/Project";
import Certification from "./pages/Certification";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/resume" element={<Resume />} />
      <Route path="/project" element={<Project />} />
      <Route path="/certification" element={<Certification />} />
    </Routes>
  );
}

export default App;


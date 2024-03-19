import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login";
import Map from "./components/map";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/map" element={<Map />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
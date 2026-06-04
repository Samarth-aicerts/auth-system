import {
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Otp from "./pages/otp";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Login />}
      />
      <Route path="/otp" element={<Otp />} />
      <Route
        path="/signup"
        element={<Signup />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />
    </Routes>
  );
}

export default App;
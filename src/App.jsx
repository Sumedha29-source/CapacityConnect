import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import TraineeDashboard from "./pages/TraineeDashboard";
import TraineeProfile from "./pages/TraineeProfile";

import TrainerDashboard from "./pages/TrainerDashboard";
import CreateCourse from "./pages/CreateCourse";

import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/trainee/dashboard"
          element={<TraineeDashboard />}
        />

        <Route
          path="/trainee/profile"
          element={<TraineeProfile />}
        />

        <Route
          path="/trainer/dashboard"
          element={<TrainerDashboard />}
        />

        <Route
          path="/trainer/courses/create"
          element={<CreateCourse />}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
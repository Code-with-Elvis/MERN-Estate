import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import {
  About,
  Home,
  List,
  Listings,
  Profile,
  RootLayout,
  SignIn,
  SignUp,
} from "./pages";
import { PrivateRoute, ProtectedRoute, PublicRoute } from "./middlewares";
import useAuthCheck from "./hooks/useAuthCheck";
import { useAuth } from "./store";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      {/* Public pages */}
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      {/* Public-only routes */}
      <Route element={<PublicRoute />}>
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
      </Route>
      {/* Private (logged-in) routes */}
      <Route element={<PrivateRoute />}>
        <Route path="profile/:id" element={<Profile />} />
        <Route path="listings" element={<Listings />} />
        <Route path="listings/:slug" element={<List />} />
      </Route>
      {/* Protected (admin-only) routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="admin" element={<div>Admin Dashboard</div>} />
      </Route>
    </Route>
  )
);

const App = () => {
  useAuthCheck();
  const loading = useAuth((state) => state.loading);
  const serverError = useAuth((state) => state.serverError);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-black">
        <div className="wave-container">
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
        </div>
      </div>
    );
  }
  if (serverError) {
    return (
      <div className="flex h-screen items-center justify-center text-red-600">
        Server error — please try again later.
      </div>
    );
  }

  return <RouterProvider router={router} />;
};
export default App;

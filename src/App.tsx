import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { StoriesPage } from "./pages/StoriesPage";
import { StoryDetailPage } from "./pages/StoryDetailPage";
import { GalleryPage } from "./pages/GalleryPage";
import { AboutPage } from "./pages/AboutPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { ReaderDashboardPage } from "./pages/ReaderDashboardPage";
import { AuthModal } from "./components/ui/AuthModal";
import { ChangePasswordModal } from "./components/ui/ChangePasswordModal";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="stories" element={<StoriesPage />} />
                <Route path="stories/:slug" element={<StoryDetailPage />} />
                <Route path="gallery" element={<GalleryPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="admin" element={<AdminDashboardPage />} />
                <Route path="panel" element={<ReaderDashboardPage />} />
              </Route>
            </Routes>
            <AuthModal />
            <ChangePasswordModal />
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

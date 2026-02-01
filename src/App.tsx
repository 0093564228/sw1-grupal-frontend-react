import { Routes, Route } from "react-router-dom";
import { UploadPage, AlbumVideosPage, VideoDetailsPage } from "./pages";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AlbumsPage from "./pages/AlbumsPage";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AlbumsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <UploadPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/videos/:jobId"
        element={
          <ProtectedRoute>
            <VideoDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/albums/:albumId"
        element={
          <ProtectedRoute>
            <AlbumVideosPage />
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;

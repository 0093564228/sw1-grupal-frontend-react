import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AlbumVideosPage, UploadPage, VideoDetailsPage } from "./pages";
import AlbumsPage from "./pages/AlbumsPage";
import { LoginPage } from "./pages/LoginPage";

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

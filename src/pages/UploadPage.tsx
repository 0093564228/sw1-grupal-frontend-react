import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HomePage } from "../components/HomePage";
import { LoadingScreen } from "../components/LoadingScreen";
import { API_BASE_URL } from "../services/authService";
import { PlayIcon } from "lucide-react";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { albumId } = location.state || {};

  useEffect(() => {
    if (!albumId) {
      alert("No se ha seleccionado un álbum. Redirigiendo...");
      navigate("/");
    }
  }, [albumId, navigate]);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    // Limpiar job_id anterior
    sessionStorage.removeItem("currentJobId");
    // Guardar nombre original (sin extensión) para usarlo en la descarga del instrumental
    const originalName = selectedFile.name.split(".").slice(0, -1).join(".");
    sessionStorage.setItem("originalFileName", originalName);
  };

  const handleAutoProcess = async (selectedFile: File, language: string) => {
    setLoading(true);

    try {
      console.log("Procesando video automáticamente:", selectedFile.name);
      console.log("Idioma seleccionado:", language);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("language", language);
      if (albumId) {
        formData.append("album_id", String(albumId));
      }

      const response = await fetch(`${API_BASE_URL}/procesar-video/`, {
        method: "POST",
        headers: {
          // No establecer Content-Type manualmente; el navegador lo hace con boundary
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Intentar leer el header X-Job-ID que el backend debe exponer
      const headerJobId = response.headers.get("X-Job-ID");
      if (!headerJobId) {
        // Si no se pudo leer el header, informar al usuario
        alert("No se recibió job_id. Comprueba CORS/expose_headers.");
        console.error(
          'Header X-Job-ID ausente: si usas CORS el backend debe exponerlo con expose_headers=["X-Job-ID"]',
        );
      } else {
        // Guardar jobId en sessionStorage
        sessionStorage.setItem("currentJobId", headerJobId);
      }

      // Obtener el nombre original sin extensión y agregar "_karaoke" para la descarga del video karaoke
      const originalName = selectedFile.name.split(".").slice(0, -1).join(".");
      const downloadName = `${originalName}_karaoke.mp4`;

      const a = document.createElement("a");
      a.href = url;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      a.remove();

      console.log("Video procesado y descargado automáticamente");
    } catch (error: unknown) {
      console.error(
        "Error al procesar el video:",
        error instanceof Error ? error.message : String(error),
      );
      alert("Ocurrió un error al procesar el video.");
    } finally {
      setLoading(false);
    }
  };

  // handleUpload removido: flujo usa handleAutoProcess

  // Descarga instrumental gestionada desde ResultsPage

  return (
    <>
      {!file ? (
        <HomePage
          onFileSelect={handleFileSelect}
          onAutoProcess={handleAutoProcess}
        />
      ) : loading ? (
        <LoadingScreen loading={loading} fileName={file.name} />
      ) : (
        <>
          <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center text-white">
            <h2 className="text-2xl font-bold mb-4">Video procesado exitosamente.</h2>
            <button
              className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 font-bold"
              onClick={() => navigate("/videos/" + encodeURIComponent(sessionStorage.getItem("currentJobId") || ""))}
            >
              Ver video <PlayIcon className="inline" />
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default UploadPage;

import { useState } from "react";

interface HomePageProps {
  onFileSelect: (file: File) => void;
  onAutoProcess: (file: File, language: string) => void;
}

export const HomePage = ({
  onFileSelect,
  onAutoProcess,
}: HomePageProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [language, setLanguage] = useState("auto");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onFileSelect(droppedFile);
      onAutoProcess(droppedFile, language);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
      onAutoProcess(selectedFile, language);
    }
  };

  const handleAreaClick = () => {
    const fileInput = document.getElementById(
      "file-input",
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="pt-12 pb-8">
        <button
          onClick={goBack}
          className="text-gray-300 hover:text-white mb-2 ml-6 flex items-center gap-1"
        >
          &larr; Volver al álbum
        </button>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="text-left">
            <h1 className="text-4xl font-bold text-white mb-1">
              Subir nuevo video
            </h1>
            <p className="text-gray-300 text-lg">
              Sube un nuevo video para separar la voz, la música de
              fondo con un solo clic y generar tu karaoke.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Panel derecho - Área de carga */}
          <div className="bg-gray-800 rounded-lg p-8">
            {/* Selector de modo e Idioma */}
            <div className="flex justify-start items-center mb-6 space-x-4">
              <span className="text-white">Idioma del video:</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-700 text-white rounded-lg px-4 py-2 hover:bg-gray-600 transition-colors focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="auto">Detección Automática 🌐</option>
                <option value="es">Español 🇪🇸</option>
                <option value="en">Inglés 🇺🇸</option>
                <option value="pt">Portugués 🇧🇷</option>
              </select>
            </div>

            {/* Área de carga */}
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
                dragActive
                  ? "border-purple-400 bg-purple-900/20"
                  : "border-purple-500"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleAreaClick}
            >
              <div className="space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <h3 className="text-white text-xl font-medium">
                  Haz clic para subir
                </h3>
                <p className="text-gray-400">
                  o arrastra y suelta un archivo aquí
                </p>
              </div>
              <input
                id="file-input"
                type="file"
                accept="video/avi,video/mp4,audio/mp3,video/x-matroska,.mp3,.mp4,.wav,.aac,.m4a,.wma,.ogg,.flac,.aiff,.m4r,.amr,.oga,.mov,.mkv,.webm,.avi,.m4v,.wmv,.ts,.rmvb,.ape,.opus,.mts"
                className="hidden"
                onChange={handleFileInput}
              />
            </div>

            {/* Límite de duración */}
            <div className="flex items-center justify-center mt-6 space-x-2">
              <span className="text-gray-400">Máximo:</span>
              <div className="bg-gray-700 rounded px-3 py-1">
                <span className="text-white text-sm">60 Mins</span>
              </div>
            </div>

            {/* Formatos soportados */}
            <div className="mt-4 text-center">
              <span className="text-gray-400 text-sm">
                Compatible con:{" "}
              </span>
              <span className="text-white text-sm">
                .MP3, .MP4, .WAV, .AAC, .M4A, .WMA, .OGG, .FLAC, .AIFF,
                .M4R, .AMR, .OGA, .MOV, .MKV, .WEBM, .AVI, .M4V, .WMV,
                .TS, .RMVB, .APE, .OPUS, .MTS
              </span>
            </div>
          </div>

          {/* Panel izquierdo - Ejemplos visuales */}
          <div className="space-y-6">
            {/* Tarjetas de ejemplo */}
            <div className="relative">
              {/* Tarjeta principal - Hombre cantando */}
              <div className="bg-gray-800 rounded-lg p-4 shadow-lg mb-4">
                <div className="w-full h-48 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg mb-3 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">
                      Audio Original
                    </p>
                  </div>
                </div>
              </div>

              {/* Tarjetas de resultado */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                {/* BGM */}
                <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                  <div className="w-full h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mb-3 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L5.617 14H3a1 1 0 01-1-1V7a1 1 0 011-1h2.617l2.766-2.793a1 1 0 011-.131zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-white font-medium mb-2">
                    Audio Instrumental
                  </h3>
                  <div className="flex space-x-1 mb-2">
                    {[...Array(15)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-blue-400 rounded-full"
                        style={{
                          height: `${Math.random() * 20 + 8}px`,
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm">۰۰۰</p>
                </div>

                {/* Vocal */}
                <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                  <div className="w-full h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mb-3 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-white font-medium mb-2">
                    Audio Vocal
                  </h3>
                  <div className="flex space-x-1 mb-2">
                    {[...Array(15)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-emerald-400 rounded-full"
                        style={{
                          height: `${Math.random() * 20 + 8}px`,
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm">۰۰۰</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

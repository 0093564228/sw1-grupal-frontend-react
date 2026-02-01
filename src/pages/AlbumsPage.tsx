import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { albumService } from "../services/albumService";
import type { Album } from "../services/albumService";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../services/authService";

export default function AlbumsPage() {
  const { user, logout } = useAuth();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [editName, setEditName] = useState("");

  const openAlbum = (id: number) => {
    navigate(`/albums/${id}`);
  };

  const loadAlbums = async () => {
    try {
      if (!user?.id) return;
      const data = await albumService.getAlbums(user.id);
      setAlbums(data);
    } finally {
      setLoading(false);
    }
  };

  const createAlbum = async () => {
    if (!name.trim() || !user) return;

    const newAlbum = await albumService.createAlbum({
      name,
      user_id: user.id,
      description: "",
    });

    setAlbums([...albums, newAlbum]);
    setName("");
  };

  const saveEdit = async () => {
    if (!editingAlbum || !editName.trim()) return;

    const updated = await albumService.updateAlbum(editingAlbum.id, {
      name: editName,
    });

    setAlbums(
      albums.map((p) => (p.id === editingAlbum.id ? updated : p))
    );

    setEditingAlbum(null);
  };

  useEffect(() => {
    loadAlbums();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">

      <div className="pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-left w-full sm:w-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">
              Todos tus álbumes
            </h1>
            <p className="text-gray-300 text-base sm:text-lg">
              Elige un álbum para subir videos y generar karaokes.
            </p>
          </div>

          <button
            onClick={logout}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">

        <div className="flex flex-col">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-4 border border-gray-700">
            <h2 className="text-white text-xl font-semibold mb-4">Crear álbum</h2>
            <div className="flex space-x-3">
              <input
                type="text"
                placeholder="Nombre del álbum"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600"
              />
              <button
                onClick={createAlbum}
                className="bg-green-600 hover:bg-green-700 text-white px-4 rounded-lg"
              >
                Crear
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-10 border border-gray-700">
            <h2 className="text-white text-xl font-semibold mb-2">Buscar álbum</h2>
            <input
              type="text"
              placeholder="Filtrar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-gray-300">Cargando álbumes...</p>
        ) : albums.length === 0 ? (
          <p className="text-gray-300 text-lg">No tienes álbumes todavía.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums
              .filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((p) => (
                <div
                  key={p.id}
                  className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 transition"
                >
                  <div onClick={() => openAlbum(p.id)} className="cursor-pointer group">
                    {/* Thumbnail Stack Effect */}
                    <div className="relative w-full aspect-video mb-4">
                      {/* Layer 2 (Bottom) */}
                      <div className="absolute top-0 left-0 w-full h-full bg-gray-700 rounded-lg transform translate-x-3 -translate-y-3 opacity-40 border border-gray-600"></div>
                      {/* Layer 1 (Middle) */}
                      <div className="absolute top-0 left-0 w-full h-full bg-gray-700 rounded-lg transform translate-x-1.5 -translate-y-1.5 opacity-70 border border-gray-600"></div>

                      {/* Main Layer (Top) */}
                      <div className="absolute top-0 left-0 w-full h-full bg-gray-900 rounded-lg overflow-hidden border border-gray-600 z-10 transition-transform group-hover:-translate-y-1">
                        {p.videos && p.videos.length > 0 ? (
                          <img
                            src={`${API_BASE_URL}/descargar/thumbnail/${p.videos[p.videos.length - 1].job_id}`}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://via.placeholder.com/320x180?text=No+Thumbnail";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                            <span className="text-white text-4xl font-bold opacity-30 select-none">
                              {p.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                          {/* Optional: Play icon or similar on hover */}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-white text-xl font-bold truncate mb-1 group-hover:text-blue-400 transition-colors">
                      {p.name}
                    </h3>

                    <div className="flex justify-between items-center text-sm">
                      <p className="text-gray-400">
                        {p.videos?.length || 0} {p.videos?.length === 1 ? 'video' : 'videos'}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {new Date(p.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={() => openAlbum(p.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium shadow transition"
                    >
                      Abrir
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="text-center pb-8">
        <h2 className="text-white text-2xl font-bold mb-2">Elige un álbum para continuar</h2>
        <svg
          className="w-6 h-6 text-white mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {editingAlbum && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 border border-gray-600">
            <h2 className="text-white text-xl mb-4">Editar Álbum</h2>

            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600"
            />

            <div className="flex justify-end mt-4 gap-3">
              <button
                onClick={() => setEditingAlbum(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>

              <button
                onClick={saveEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { albumService } from "../services/albumService";
import type { Album } from "../services/albumService";
import { useNavigate } from "react-router-dom";

export default function AlbumsPage() {
  const { user, logout } = useAuth();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [editName, setEditName] = useState("");

  const openAlbum = (id: number) => {
    navigate("/upload", { state: { albumId: id } });
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
    });

    setAlbums([...albums, newAlbum]);
    setName("");
  };

  const deleteAlbum = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este álbum?")) return;

    await albumService.deleteAlbum(id);
    setAlbums(albums.filter((p) => p.id !== id));
  };

  const startEditing = (album: Album) => {
    setEditingAlbum(album);
    setEditName(album.name);
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
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="text-left">
            <h1 className="text-4xl font-bold text-white mb-1">
              Tus Álbumes
            </h1>
            <p className="text-gray-300 text-lg">
              Gestiona tus álbumes antes de procesar archivos.
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-10 border border-gray-700">
          <h2 className="text-white text-xl font-semibold mb-4">Crear Álbum</h2>

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

        {loading ? (
          <p className="text-gray-300">Cargando álbumes...</p>
        ) : albums.length === 0 ? (
          <p className="text-gray-300 text-lg">No tienes álbumes todavía.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.map((p) => (
              <div
                key={p.id}
                className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 transition"
              >
                <div onClick={() => openAlbum(p.id)} className="cursor-pointer">
                  <div className="w-full h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">
                      {p.name}
                    </span>
                  </div>

                  <p className="text-gray-300 text-sm text-center">
                    Creado: {new Date(p.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => startEditing(p)}
                    className="w-1/2 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteAlbum(p.id)}
                    className="w-1/2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
                  >
                    Eliminar
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

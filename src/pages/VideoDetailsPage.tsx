import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { albumService } from "../services/albumService";
import type { Video, Album } from "../services/albumService";
import { useAuth } from "../context/AuthContext";
import { ResultsPage } from "../components/ResultsPage";

export default function VideoDetailsPage() {
    const { videoId } = useParams<{ videoId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [video, setVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState(true);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [showMoveModal, setShowMoveModal] = useState(false);
    const [selectedAlbumId, setSelectedAlbumId] = useState<number | "">("");

    useEffect(() => {
        if (videoId) {
            loadVideo(parseInt(videoId));
        }
        if (user?.id) {
            loadAlbums(user.id);
        }
    }, [videoId, user]);

    const loadVideo = async (id: number) => {
        try {
            setLoading(true);
            const data = await albumService.getVideo(id);
            setVideo(data);
        } catch (error) {
            console.error("Error loading video:", error);
            navigate("/"); // Redirect on error
        } finally {
            setLoading(false);
        }
    };

    const loadAlbums = async (userId: number) => {
        try {
            const data = await albumService.getAlbums(userId);
            setAlbums(data);
        } catch (error) {
            console.error("Error loading albums:", error);
        }
    };

    const handleMove = async () => {
        if (!video || !selectedAlbumId) return;

        try {
            await albumService.moveVideo(video.id, Number(selectedAlbumId));
            alert("Video movido exitosamente!");
            setShowMoveModal(false);
            // Opcional: navegar al nuevo álbum o quedarse aquí
            // navigate(`/albums/${selectedAlbumId}`); 
        } catch (error) {
            console.error("Error moving video:", error);
            alert("Error al mover el video.");
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center text-white">
                Cargando video...
            </div>
        );
    }

    if (!video) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-8 pb-12">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header Navigation */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-300 hover:text-white flex items-center gap-1"
                    >
                        &larr; Volver al álbum
                    </button>

                    <button
                        onClick={() => setShowMoveModal(true)}
                        className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
                    >
                        Mover a otro álbum
                    </button>
                </div>

                {/* Results Page Component Reuse */}
                {/* ResultsPage espera props específicas que adaptamos desde nuestro objeto video */}
                {/* ResultsPage espera props específicas que adaptamos desde nuestro objeto video */}
                <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
                    <ResultsPage
                        originalVideoUrl={null} // No tenemos URL local, el componente usa job_id para downloads/preview
                        jobId={video.job_id || null}
                        originalFileName={video.name}
                    />
                </div>

            </div>

            {/* Move Album Modal */}
            {showMoveModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-96 border border-gray-600">
                        <h3 className="text-white text-xl font-bold mb-4">Mover Video</h3>
                        <p className="text-gray-300 mb-4">Selecciona el álbum destino:</p>

                        <select
                            className="w-full p-2 mb-6 bg-gray-700 text-white rounded border border-gray-600"
                            value={selectedAlbumId}
                            onChange={(e) => setSelectedAlbumId(Number(e.target.value))}
                        >
                            <option value="">-- Seleccionar Álbum --</option>
                            {albums
                                .filter(a => a.videos?.every(v => v.id !== video.id)) // Filtrar álbum actual si ya lo tuviéramos en contexto (opcional)
                                .map(album => (
                                    <option key={album.id} value={album.id}>
                                        {album.name}
                                    </option>
                                ))}
                        </select>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowMoveModal(false)}
                                className="text-gray-400 hover:text-white px-3 py-1"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleMove}
                                disabled={!selectedAlbumId}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
                            >
                                Mover
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

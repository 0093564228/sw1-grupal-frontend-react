import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { albumService } from "../services/albumService";
import type { Album, Video } from "../services/albumService";
import { API_BASE_URL } from "../services/authService";

export default function AlbumVideosPage() {
    const { albumId } = useParams<{ albumId: string }>();
    const navigate = useNavigate();
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [album, setAlbum] = useState<Album | null>(null);

    // Helper function to format duration (seconds -> mm:ss)
    const formatDuration = (seconds?: number) => {
        if (!seconds) return "00:00";
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        if (albumId) {
            loadVideos(parseInt(albumId));
        }
    }, [albumId]);

    const loadVideos = async (id: number) => {
        try {
            setLoading(true);
            const dataAlbum: Album = await albumService.getAlbum(id);
            setAlbum(dataAlbum);
            const dataVideos = await albumService.getAlbumVideos(id);
            setVideos(dataVideos);
        } catch (error) {
            console.error("Error loading videos:", error);
        } finally {
            setLoading(false);
        }
    };

    const goToUpload = () => {
        if (albumId) {
            navigate("/upload", { state: { albumId: parseInt(albumId) } });
        }
    };

    const goBack = () => {
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-12 pb-12">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                    <div>
                        <button
                            onClick={goBack}
                            className="text-gray-300 hover:text-white mb-2 flex items-center gap-1"
                        >
                            &larr; Volver a Álbumes
                        </button>
                        <h1 className="text-3xl sm:text-4xl font-bold text-white break-all">
                            Álbum {album?.name}
                        </h1>
                    </div>

                    <button
                        onClick={goToUpload}
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition"
                    >
                        Subir nuevo video
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <p className="text-gray-300 text-lg">Cargando videos...</p>
                ) : videos.length === 0 ? (
                    <div className="text-center py-20 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700">
                        <p className="text-gray-300 text-xl mb-4">Este álbum está vacío.</p>
                        <button
                            onClick={goToUpload}
                            className="text-blue-400 hover:text-blue-300 underline"
                        >
                            ¡Sube tu primer video aquí!
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {videos.map((video) => (
                            <div
                                key={video.id}
                                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:border-gray-500 transition group cursor-pointer"
                                onClick={() => navigate(`/videos/${video.id}`)}
                            >
                                {/* Thumbnail */}
                                <div className="relative aspect-video bg-gray-900">
                                    {video.job_id ? (
                                        <img
                                            src={`${API_BASE_URL}/descargar/thumbnail/${video.job_id}`}
                                            alt={video.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/320x180?text=No+Thumbnail";
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                                            Sin vista previa
                                        </div>
                                    )}

                                    {/* Duration Badge */}
                                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                                        {formatDuration(video.duration_in_seconds)}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <h3 className="text-white font-semibold text-lg truncate mb-1" title={video.name}>
                                        {video.name}
                                    </h3>
                                    <p className="text-gray-400 text-sm">
                                        Creado: {new Date(video.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

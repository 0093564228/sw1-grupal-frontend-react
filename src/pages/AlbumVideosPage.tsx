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
    const [searchTerm, setSearchTerm] = useState("");

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

    const handleUpdateVideo = async (job_id: string, newName: string) => {
        try {
            const updatedVideo = await albumService.updateVideo(job_id, newName);
            setVideos(videos.map(v => v.job_id === job_id ? updatedVideo : v));
        } catch (error) {
            console.error("Error updating video:", error);
            alert("Error al actualizar el video");
        }
    };

    const handleDeleteVideo = async (job_id: string) => {
        try {
            await albumService.deleteVideo(job_id);
            setVideos(videos.filter(v => v.job_id !== job_id));
        } catch (error) {
            console.error("Error deleting video:", error);
            alert("Error al eliminar el video");
        }
    };

    const handleEditAlbum = async () => {
        if (!album) return;
        const newName = prompt("Nuevo nombre para el álbum:", album.name);
        if (newName && newName !== album.name) {
            try {
                const updated = await albumService.updateAlbum(album.id, { name: newName });
                setAlbum(updated);
            } catch (error) {
                console.error("Error updating album:", error);
                alert("Error al actualizar el álbum");
            }
        }
    };

    const handleDeleteAlbum = async () => {
        if (!album) return;
        if (confirm(`¿Estás seguro de eliminar el álbum "${album.name}" y todos sus videos? Esta acción no se puede deshacer.`)) {
            try {
                await albumService.deleteAlbum(album.id);
                navigate("/");
            } catch (error) {
                console.error("Error deleting album:", error);
                alert("Error al eliminar el álbum");
            }
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
                <button
                    onClick={goBack}
                    className="text-gray-300 hover:text-white mb-2 flex items-center gap-1"
                >
                    &larr; Volver a todos los álbumes
                </button>
                <div className="h-1"></div>
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-6">
                    <div className="flex items-start gap-6">
                        {/* Album Thumbnail with Stack Effect */}
                        <div className="relative w-28 sm:w-28 aspect-video flex-shrink-0 hidden sm:block">
                            {/* Layer 2 (Bottom) */}
                            <div className="absolute top-0 left-0 w-full h-full bg-gray-700 rounded-lg transform translate-x-3 -translate-y-3 opacity-40 border border-gray-600"></div>
                            {/* Layer 1 (Middle) */}
                            <div className="absolute top-0 left-0 w-full h-full bg-gray-700 rounded-lg transform translate-x-1.5 -translate-y-1.5 opacity-70 border border-gray-600"></div>

                            {/* Main Layer (Top) */}
                            <div className="absolute top-0 left-0 w-full h-full bg-gray-900 rounded-lg overflow-hidden border border-gray-600 z-10">
                                {videos && videos.length > 0 ? (
                                    <img
                                        src={`${API_BASE_URL}/descargar/thumbnail/${videos[videos.length - 1].job_id}`}
                                        alt={album?.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/320x180?text=No+Thumbnail";
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                        <span className="text-white text-3xl font-bold opacity-30 select-none">
                                            {album?.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl sm:text-4xl font-bold text-white break-all">
                                    {album?.name}
                                </h1>
                                <button
                                    onClick={handleEditAlbum}
                                    className="text-gray-400 hover:text-blue-400 transition"
                                    title="Editar nombre del álbum"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={handleDeleteAlbum}
                                    className="text-gray-400 hover:text-red-500 transition"
                                    title="Eliminar álbum"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-gray-400 text-sm mt-1">
                                {videos.length} {videos.length === 1 ? 'video' : 'videos'} • Creado el {album ? new Date(album.created_at).toLocaleDateString() : ''}
                            </p>
                        </div>
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
                    <div>
                        {/* Search Bar */}
                        <div className="mb-6">
                            <input
                                type="text"
                                placeholder="Buscar videos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-1/2 lg:w-1/3 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {videos
                                .filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map((video) => (
                                    <div
                                        key={video.job_id}
                                        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:border-gray-500 transition group relative"
                                    >
                                        {/* Thumbnail Container - Clickable to navigate */}
                                        <div
                                            className="relative aspect-video bg-gray-900 cursor-pointer"
                                            onClick={() => navigate(`/videos/${encodeURIComponent(video.job_id)}`)}
                                        >
                                            {video.job_id ? (
                                                <img
                                                    src={`${API_BASE_URL}/descargar/thumbnail/${encodeURIComponent(video.job_id)}`}
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

                                        {/* Info & Actions */}
                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3
                                                    className="text-white font-semibold text-lg truncate flex-1 mr-2 cursor-pointer hover:text-blue-400"
                                                    title={video.name}
                                                    onClick={() => navigate(`/videos/${encodeURIComponent(video.job_id)}`)}
                                                >
                                                    {video.name}
                                                </h3>

                                                <div className="flex space-x-1">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const newName = prompt("Nuevo nombre para el video:", video.name);
                                                            if (newName && newName !== video.name) {
                                                                handleUpdateVideo(video.job_id, newName);
                                                            }
                                                        }}
                                                        className="text-gray-400 hover:text-blue-400 p-1"
                                                        title="Editar nombre"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (window.confirm(`¿Estás seguro de eliminar el video "${video.name}"? Esta acción no se puede deshacer.`)) {
                                                                handleDeleteVideo(video.job_id);
                                                            }
                                                        }}
                                                        className="text-gray-400 hover:text-red-500 p-1"
                                                        title="Eliminar video"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 000-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                                Creado: {new Date(video.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

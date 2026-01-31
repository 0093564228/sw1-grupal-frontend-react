import { apiClient } from "./authService";

export interface Video {
    id: number;
    name: string;
    job_id?: string;
    duration_in_seconds?: number;
    format: string;
    created_at: string;
}

export interface Album {
    id: number;
    name: string;
    description?: string;
    created_at: string;
    videos?: Video[];
}

export const albumService = {
    async getAlbum(id: number): Promise<Album> {
        const res = await apiClient.get(`/albums/${id}`);
        return res.data;
    },

    async getAlbums(userId: number): Promise<Album[]> {
        const res = await apiClient.get(`/albums?userId=${userId}`);
        return res.data;
    },

    async createAlbum(payload: { name: string; user_id: number }): Promise<Album> {
        const res = await apiClient.post("/albums", payload);
        return res.data;
    },
    async updateAlbum(
        id: number,
        payload: { name?: string; description?: string }
    ): Promise<Album> {
        const res = await apiClient.put(`/albums/${id}`, payload);
        return res.data;
    },

    async deleteAlbum(id: number): Promise<void> {
        await apiClient.delete(`/albums/${id}`);
    },

    async getAlbumVideos(albumId: number): Promise<Video[]> {
        const res = await apiClient.get(`/albums/${albumId}/videos`);
        return res.data;
    },

    async getVideo(videoId: number): Promise<Video> {
        const res = await apiClient.get(`/videos/${videoId}`);
        return res.data;
    },

    async moveVideo(videoId: number, targetAlbumId: number): Promise<Video> {
        const formData = new FormData();
        formData.append("target_album_id", String(targetAlbumId));
        const res = await apiClient.put(`/videos/${videoId}/album`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return res.data;
    }
};

import { apiClient } from "./authService";

export interface Video {
    id: number;
    name: string;
    job_id: string;
    duration_in_seconds: number;
    format: string;
    created_at: string;
    album_id: number;
}

export interface Album {
    id: number;
    name: string;
    description?: string;
    created_at: string;
    videos: Video[];
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

    async createAlbum(payload: { name: string; user_id: number, description: string }): Promise<Album> {
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

    async getVideo(jobId: string): Promise<Video> {
        const res = await apiClient.get(`/videos/${encodeURIComponent(jobId)}`);
        return res.data;
    },

    async moveVideo(jobId: string, targetAlbumId: number): Promise<Video> {
        const formData = new FormData();
        formData.append("target_album_id", String(targetAlbumId));
        const res = await apiClient.put(`/videos/${encodeURIComponent(jobId)}/album`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return res.data;
    },

    async updateVideo(jobId: string, name: string): Promise<Video> {
        const res = await apiClient.put(`/videos/${encodeURIComponent(jobId)}`, { name });
        return res.data;
    },

    async deleteVideo(jobId: string): Promise<void> {
        await apiClient.delete(`/videos/${encodeURIComponent(jobId)}`);
    }
};

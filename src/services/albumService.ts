import { apiClient } from "./authService";

export interface Media {
    id: number;
    name: string;
    path: string;
    format: string;
    type: string;
    job_id?: string;
    created_at: string;
}

export interface Album {
    id: number;
    name: string;
    description?: string;
    created_at: string;
    media?: Media[];
}

export const albumService = {
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
    }
};

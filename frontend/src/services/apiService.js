import axios from 'axios';

const API_URL = 'http://localhost:8080';

// Helper to create an authenticated Axios instance
const createAuthenticatedAxios = (credentials) => {
    return axios.create({
        baseURL: API_URL,
        auth: {
            username: credentials.username,
            password: credentials.password
        }
    });
};

export const getNote = async (credentials) => {
    const instance = createAuthenticatedAxios(credentials);
    // Use the authenticated instance to make the request
    try {
        const response = await instance.get(`${API_URL}/notes`, {
        });
        if (Array.isArray(response.data)) {
            // If the response is an array, return it directly
            return response.data;
        }
        else{
            console.warn('GET /notes did not return an array:', response.data);
            return [];
        }
    } 
    catch (error) {
        console.error('Error fetching notes:', error);
        throw error;
    }
};

export const postNote = async (noteContent, credentials) => {
    const instance = createAuthenticatedAxios(credentials);
    try {
        const payload = { 
            title: noteContent.title || 'Untitled',
            content: noteContent.content || 'Empty',
            createdAt: noteContent.createdAt || new Date().toLocaleString(),
            category: noteContent.category || 'Empty'};
        if (noteContent.id) {
            // Update existing note
            const response = await instance.put(`${API_URL}/notes/${noteContent.id}`, payload);
            return response.data;
        }
        else {
            // Create new note
            const response = await instance.post(`${API_URL}/notes`, payload);
            return response.data;
        }
    } 
    catch (error) {
        console.error('Error saving note:', error);
        throw error;
    }
};

export const delNote = async (noteId, credentials) => {
    const instance = createAuthenticatedAxios(credentials);
    try {
        console.log('Deleting note with ID:', noteId);
        await instance.delete(`${API_URL}/notes/${noteId}`);
    }
    catch (error) {
        console.error('Error deleting notee:', error);
        throw error;
    }
}

export const getCategory = async (credentials) => {
    const instance = createAuthenticatedAxios(credentials);
    // Use the authenticated instance to make the request
    try {
        const response = await instance.get(`${API_URL}/category`, {
        });
        if (Array.isArray(response.data)) {
            // If the response is an array, return it directly
            return response.data;
        }
        else{
            console.warn('GET /hello did not return an array:', response.data);
            return [];
        }
    } 
    catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};
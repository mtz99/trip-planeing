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

export const getMessages = async (credentials) => {
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
            console.warn('GET /hello did not return an array:', response.data);
            return [];
        }
    } 
    catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
};

export const saveMessage = async (messageContent, credentials) => {
    const instance = createAuthenticatedAxios(credentials);
    try {
        const payload = { 
            title: messageContent.title || 'Untitled',
            content: messageContent.content || 'Empty',
            createdAt: messageContent.createdAt || new Date().toLocaleString(),
            category: messageContent.category || 'Empty'};
        if (messageContent.id) {
            // Update existing message
            const response = await instance.put(`${API_URL}/notes/${messageContent.id}`, payload);
            return response.data;
        }
        else {
            // Create new message
            const response = await instance.post(`${API_URL}/notes`, payload);
            return response.data;
        }
    } 
    catch (error) {
        console.error('Error saving message:', error);
        throw error;
    }
};

export const delMessage = async (messageId, credentials) => {
    const instance = createAuthenticatedAxios(credentials);
    try {
        console.log('Deleting message with ID:', messageId);
        await instance.delete(`${API_URL}/notes/${messageId}`);
    }
    catch (error) {
        console.error('Error deleting message:', error);
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

export const saveCategory = async (categoryContent, credentials) => {
    const instance = createAuthenticatedAxios(credentials);
    try {
        const payload = { content: categoryContent || '' };
        const response = await instance.post(`${API_URL}/category`, payload);
        return response.data;
    } 
    catch (error) {
        console.error('Error saving category:', error);
        throw error;
    }
};
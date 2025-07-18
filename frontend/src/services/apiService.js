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
        const response = await instance.get(`${API_URL}/hello`, {
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
        const payload = { content: messageContent };
        const response = await instance.post(`${API_URL}/hello`, payload);
        return response.data;
    } 
    catch (error) {
        console.error('Error saving message:', error);
        throw error;
    }
};
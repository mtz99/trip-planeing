import React, { useState, useEffect } from 'react';
import { getMessages, saveMessage } from '../services/apiService';

const MessageComponent = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const credentials = { username: 'testuser', password: 'password' }; // Replace with actual credentials
            const response = await fetch('http://localhost:8080/hello', {
                method: 'GET', // Or 'POST', 'PUT', etc.
                headers: {
                'Authorization': `Basic ${credentials}`, // <-- THIS IS THE KEY LINE
                'Content-Type': 'application/json' // If you're sending a body
                }
            });

            if (!response.ok) {
                // Handle non-2xx responses like 401 Unauthorized, 403 Forbidden
                console.error(`HTTP error! Status: ${response.status}`);
                const errorText = await response.text(); // Get raw response for debugging
                console.error('Error Response Body:', errorText);
                setMessages([]); // Ensure messages is an array to prevent .map error
                return;
            }

            const data = await getMessages();
            setMessages(data);
        } catch (error) {
            console.error('Failed to fetch messages', error);
        }
    };

    const handleSaveMessage = async () => {
        try {
            await saveMessage(newMessage);
            fetchMessages();
            setNewMessage('');
        } catch (error) {
            console.error('Failed to save message', error);
        }
    };

    return (
        <div>
            <h1>Messages</h1>
            <ul>
                {messages.map((message) => (
                    <li key={message.id}>{message.content}</li>
                ))}
            </ul>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Enter new message"
            />
            <button onClick={handleSaveMessage}>Save Message</button>
        </div>
    );
};

export default MessageComponent;
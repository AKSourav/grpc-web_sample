import React, { useState } from 'react';
import { StreamingServiceClient } from './proto/streaming_grpc_web_pb';
import { StreamRequest } from './proto/streaming_pb';

const client = new StreamingServiceClient('http://localhost:8000');

function App() {
    const [messages, setMessages] = useState([]);
    const [outmessage, setOutmessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create and configure the request message
        const request = new StreamRequest();
        request.setMessage(outmessage); // Adjust this according to your proto definition

        // Initiate the streaming call
        const stream = client.streamData(request);

        stream.on('data', (response) => {
            setMessages(prevMessages => [...prevMessages, response.getMessage()]);
        });

        stream.on('error', (err) => {
            console.error('Stream error:', err);
        });

        stream.on('end', () => {
            console.log('Stream ended');
        });
    };

    return (
        <div className="App">
            <h1>Enter Message to Server:</h1>
            <input 
                type='text' 
                value={outmessage} 
                onChange={(e) => setOutmessage(e.target.value)}
            />
            <button onClick={handleSubmit}>Send</button>
            <h1>Messages from Server:</h1>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>{message}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;

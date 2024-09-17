import React, { useState, useEffect, useContext } from 'react';
import { db, collection, addDoc, onSnapshot } from '../../FirebaseConfigs';
import { MyUserContext } from '../../configs/Contexts';
import './Chat.css';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const user = useContext(MyUserContext);

    useEffect(() => {
        if (user) {
            const messagesCollection = collection(db, 'messages');
            const unsubscribe = onSnapshot(messagesCollection, (snapshot) => {
                const messagesList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setMessages(messagesList);
            });

            return () => unsubscribe();
        }
    }, [user]);

    const handleSendMessage = async () => {
        if (newMessage.trim() && user) {
            const isAdmin = user.id === 1; // Admin chính có ID là 1
            const receiver = isAdmin ? 'all' : 1; // Admin chính gửi tin nhắn đến tất cả người dùng, admin khác gửi tin nhắn đến admin chính

            try {
                await addDoc(collection(db, 'messages'), {
                    text: newMessage,
                    sender: user.id, // ID của người gửi
                    receiver: receiver, // ID của người nhận
                    createdAt: new Date()
                });
                setNewMessage('');
            } catch (error) {
                console.error('Error adding document: ', error);
            }
        }
    };

    return (
        <div className="chat-container">
            <div className="messages-container">
                {messages.filter(msg =>
                    // Admin chính (ID 1) nhận tất cả tin nhắn từ người dùng khác
                    (user.id === 1 && msg.receiver === 'all') ||
                    // Người dùng khác (ID khác 1) chỉ nhận tin nhắn từ và đến admin chính (ID 1)
                    (user.id !== 1 && ((msg.sender === user.id && msg.receiver === 1) || 
                     (msg.sender === 1 && msg.receiver === user.id)))
                ).map(msg => (
                    <div key={msg.id} className={`message ${msg.sender === user.id ? 'sent' : 'received'}`}>
                        <p>{msg.text}</p>
                        <small>{new Date(msg.createdAt.toDate()).toLocaleTimeString()}</small>
                    </div>
                ))}
            </div>
            <div className="message-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;

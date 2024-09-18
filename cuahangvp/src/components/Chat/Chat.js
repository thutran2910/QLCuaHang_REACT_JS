import React, { useState, useContext, useEffect } from 'react';
import { db, Timestamp } from '../../Firebase';
import { collection, addDoc, query, onSnapshot } from 'firebase/firestore';
import { MyUserContext } from '../../configs/Contexts';
import SendIcon from '@mui/icons-material/Send';
import './Chat.css';

const formatTimestamp = (timestamp) => {
    const date = timestamp.toDate();
    const weekdays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
    const dayOfWeek = weekdays[date.getDay() - 1];
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${dayOfWeek}, ${day}/${month}/${year} ${hours}:${minutes}`;
};

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const user = useContext(MyUserContext);

    useEffect(() => {
        const q = query(collection(db, 'messages'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messagesArray = [];
            querySnapshot.forEach((doc) => {
                messagesArray.push({ id: doc.id, ...doc.data() });
            });
            setMessages(messagesArray);
        });

        return () => unsubscribe();
    }, []);

    const handleSendMessage = async () => {
        if (newMessage.trim() !== '') {
            if (user) {
                try {
                    await addDoc(collection(db, 'messages'), {
                        text: newMessage,
                        user: user.name || `${user.username}`,
                        createdAt: Timestamp.fromDate(new Date()),
                    });
                    setNewMessage('');
                } catch (error) {
                    console.error('Error sending message:', error);
                }
            } else {
                console.error('User is not authenticated');
            }
        }
    };

    if (!user) {
        return <div>Vui lòng đăng nhập để tham gia trò chuyện...</div>;
    }

    return (
        <div className="chat-container">
            <div className="chat">
                <div className="messages-container">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`message ${message.user === user.name ? 'own-message' : 'other-message'}`}
                        >
                            <div>
                                <strong>{message.user}:</strong> 
                                <span className="message-text">{message.text}</span>
                                <div className="message-time">
                                    {formatTimestamp(message.createdAt)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="input-container">
                    <input
                        className="input-text"
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Nhập tin nhắn..."
                    />
                    <button onClick={handleSendMessage}><SendIcon /></button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
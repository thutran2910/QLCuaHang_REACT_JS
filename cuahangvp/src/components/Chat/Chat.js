import React, { useState, useContext, useEffect } from 'react';
import { db, Timestamp } from '../../Firebase';
import { collection, addDoc, query, onSnapshot, getDocs } from 'firebase/firestore';
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
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [users, setUsers] = useState({});
    const user = useContext(MyUserContext);

    useEffect(() => {
        const fetchUsers = async () => {
            const usersCollection = await getDocs(collection(db, 'users'));
            const usersData = {};
            usersCollection.forEach(doc => {
                usersData[doc.id] = doc.data().username; // Giả sử bạn có trường username
            });
            setUsers(usersData);
        };

        fetchUsers();
    }, []);

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
                        senderId: user.id,
                        recipientId: user.id === 1 ? selectedUserId : 1,
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

    const uniqueUsers = Array.from(new Set(messages.map(msg => msg.senderId)))
        .filter(id => id !== 1)
        .map(id => {
            return { id, name: users[id] || `User ${id}` }; // Lấy tên từ state users
        });

    const filteredMessages = selectedUserId
        ? messages.filter(msg =>
            (msg.senderId === selectedUserId && msg.recipientId === 1) ||
            (msg.senderId === 1 && msg.recipientId === selectedUserId)
        ).sort((a, b) => a.createdAt.seconds - b.createdAt.seconds)
        : messages.filter(msg =>
            (msg.senderId === 1 && msg.recipientId === user.id) ||
            (msg.senderId === user.id && msg.recipientId === 1)
        ).sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);

    return (
        <div className="chat-container">
            {user.id === 1 && (
                <div className="user-selector">
                    <h5>Khách hàng của bạn</h5>
                    {uniqueUsers.map((u) => (
                        <button 
                            key={u.id} 
                            onClick={() => setSelectedUserId(u.id)} 
                            className={u.id === selectedUserId ? 'selected' : ''}
                        >
                            {u.name}
                        </button>
                    ))}
                </div>
            )}
            <div className="chat">
                <div className="messages-container">
                    {filteredMessages.map((message) => (
                        <div
                            key={message.id}
                            className={`message ${message.senderId === user.id ? 'own-message' : 'other-message'}`}
                        >
                            <div>
                                <strong>{message.senderId === user.id ? 'You' : users[message.senderId] || `User ${message.senderId}`}:</strong>
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
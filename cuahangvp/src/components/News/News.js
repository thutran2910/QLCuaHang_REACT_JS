import React, { useState, useEffect } from 'react';
import { authApi } from '../../configs/API';
import './News.css'; // Thêm CSS tùy chỉnh của bạn

const News = () => {
    const [news, setNews] = useState([]);
    const [expandedIds, setExpandedIds] = useState(new Set());

    useEffect(() => {
        // Fetch data from API
        const fetchNews = async () => {
            try {
                const response = await authApi().get('/electronicnews/');
                setNews(response.data);
            } catch (error) {
                console.error("There was an error fetching the news!", error);
            }
        };
        fetchNews();
    }, []);

    const handleToggleContent = (id) => {
        setExpandedIds(prevIds => {
            const newIds = new Set(prevIds);
            if (newIds.has(id)) {
                newIds.delete(id);
            } else {
                newIds.add(id);
            }
            return newIds;
        });
    };

    return (
        <div className="news-container">
            {news.map(item => (
                <div key={item.id} className="news-item">
                    <div 
                        className="news-title-container" 
                        onClick={() => handleToggleContent(item.id)}
                    >
                        <h2 className="news-title">{item.title}</h2>
                        <p className="news-date">
                            {new Date(item.published_at).toLocaleDateString()}
                        </p>
                    </div>
                    <div 
                        className={`news-content ${expandedIds.has(item.id) ? 'expanded' : ''}`}
                    >
                        {item.content}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default News;

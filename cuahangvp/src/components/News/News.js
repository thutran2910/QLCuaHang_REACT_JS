import React, { useState, useEffect } from 'react';
import { authApi } from '../../configs/API';
import './News.css';

const News = () => {
    const [news, setNews] = useState([]);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        // Fetch data from API
        const fetchNews = async () => {
            try {
                const response = await authApi().get('/electronicnews/');
                setNews(response.data);
                if (response.data.length > 0) {
                    setExpandedId(response.data[0].id); // Set the first item as expanded by default
                }
            } catch (error) {
                console.error("There was an error fetching the news!", error);
            }
        };
        fetchNews();
    }, []);

    const handleToggleContent = (id) => {
        if (expandedId === id) {
            setExpandedId(null); // Collapse if clicking the same item
        } else {
            setExpandedId(id);
        }
    };

    return (
        <div className="news-container">
            <div className="news-titles">
                {news.map(item => (
                    <div 
                        key={item.id}
                        className={`news-title ${expandedId === item.id ? 'active' : ''}`}
                        onClick={() => handleToggleContent(item.id)}
                    >
                        {item.title}
                    </div>
                ))}
            </div>
            <div className="news-content-container">
                {news.map(item => (
                    expandedId === item.id && (
                        <div key={item.id}>
                            <div className="news-content-title">
                                {item.title}
                            </div>
                            <div 
                                className={`news-content ${expandedId === item.id ? 'expanded' : ''}`}
                            >
                                {item.content}
                                
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default News;

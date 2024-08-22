import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function EventListPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // State for search input
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('/api/event/getEvents', {
                    params: { search: searchTerm } // Pass searchTerm as a query parameter
                });
                console.log('Response data:', response.data); // Log response data

                // Ensure the response data is in the expected format
                if (response.data && Array.isArray(response.data.events)) {
                    setEvents(response.data.events);
                } else {
                    console.warn('Unexpected response structure:', response.data);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching events:', error);
                setError('Failed to fetch events');
                setLoading(false);
            }
        };

        fetchEvents();
    }, [searchTerm]); // Fetch events when searchTerm changes

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value); // Update searchTerm state
    };

    const handleMoreInfo = (id) => {
        navigate(`/events/${id}`);
    };

    return (
        <div>
            <h1>Our Events</h1>
            <hr />
            <div className="event-list">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <input
                        type="text"
                        placeholder="Search ..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{
                            padding: '8px',
                            marginRight: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                    />
                </div>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    events.length > 0 ? (
                        events.map((event) => (
                            <div className="event" key={event.eventId}>
                                <img src={event.baseImage} alt={event.eventName} />
                                <div className="event-details">
                                    <h2>{event.eventName}</h2>
                                    <p>Type: {event.eventType}</p>
                                    <p>Price: Rs {event.price}</p>
                                    <div className="event-icons">
                                        {(Array.isArray(event.facilities) ? event.facilities : []).map((icon, index) => (
                                            <span key={index}>{icon}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="event-price">
                                    <p>From</p>
                                    <p>Rs: {event.price}</p>
                                    <button onClick={() => handleMoreInfo(event.eventId)}>More Info</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No events available.</p>
                    )
                )}
            </div>
        </div>
    );
}

export default EventListPage;

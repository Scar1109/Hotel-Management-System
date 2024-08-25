import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RoomListPage() {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  // Fetch rooms on component mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('/api/room/getRooms');
        setRooms(response.data.rooms);
        setFilteredRooms(response.data.rooms); // Initially, show all rooms
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  // Update filtered rooms when search term changes
  useEffect(() => {
    const tempList = rooms.filter((room) =>
      (room.roomType && room.roomType.toLowerCase().includes(searchTerm.toLowerCase())) ||  // Filter by room type
      (room.roomNumber && room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())) || // Filter by room number
      (room.facilities && room.facilities.toLowerCase().includes(searchTerm.toLowerCase())) // Filter by facilities
    );
    setFilteredRooms(tempList);
  }, [searchTerm, rooms]);  

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleMoreInfo = (id) => {
    navigate(`/rooms/${id}`);
  };

  return (
    <div>
      <h1>Our Rooms</h1>
      <hr />
      <div className="room-list">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search rooms"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ marginBottom: '1.5rem', width:"300px"}}
          />
        </div>
        {filteredRooms
          .filter((room) => room.status === 'Activate') // Filter rooms by status
          .map((room) => (
            <div className="room" key={room._id}>
              <img src={room.imageUrl} alt={room.roomType} />
              <div className="room-details">
                <h2>{room.roomType}</h2>
                <p>Size: {room.size} Person</p>
                <p>Beds: {room.bedType}</p>
                <div className="room-icons">
                  {(Array.isArray(room.facilities) ? room.facilities : []).map((icon, index) => (
                    <span key={index}>{icon}</span>
                  ))}
                </div>
              </div>
              <div className="room-price">
                <p>From</p>
                <p>Rs: {room.price}</p>
                <button onClick={() => handleMoreInfo(room._id)}>More Info</button>
              </div>
            </div>
        ))}
      </div>
    </div>
  );
}

export default RoomListPage;
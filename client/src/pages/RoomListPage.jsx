import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RoomListPage() {
        const [rooms, setRooms] = useState([]);
        const [filteredRooms, setFilteredRooms] = useState([]);
        const [searchTerm, setSearchTerm] = useState("");
        const [bestSelling, setBestSelling] = useState([]);
        const [userRecommendations, setUserRecommendations] = useState([]);
        const navigate = useNavigate(); // Hook for navigation

        // Fetch suggestions on component mount
        useEffect(() => {
                const fetchSuggestions = async () => {
                        try {
                                // Fetch best-selling rooms
                                const bestSellingResponse = await axios.get(
                                        "/api/room/getBestSelling"
                                );
                                setBestSelling(bestSellingResponse.data.rooms);

                                // Fetch user-specific recommendations
                                const currentUser = JSON.parse(
                                        localStorage.getItem("currentUser")
                                );
                                if (currentUser) {
                                        const userId = currentUser._id;
                                        const userRecommendationsResponse =
                                                await axios.get(
                                                        `/api/room/getRecommendations?userId=${userId}`
                                                );
                                        setUserRecommendations(
                                                userRecommendationsResponse.data
                                                        .recommendations
                                        );
                                }
                        } catch (error) {
                                console.error(
                                        "Error fetching suggestions:",
                                        error
                                );
                        }
                };

                fetchSuggestions();
        }, []);

        // Fetch rooms on component mount
        useEffect(() => {
                const fetchRooms = async () => {
                        try {
                                const response = await axios.get(
                                        "/api/room/getRooms"
                                );
                                setRooms(response.data.rooms);
                                setFilteredRooms(response.data.rooms); // Initially, show all rooms
                        } catch (error) {
                                console.error("Error fetching rooms:", error);
                        }
                };

                fetchRooms();
        }, []);

        // Filter rooms based on search term
        useEffect(() => {
                const tempList = rooms.filter(
                        (room) =>
                                (room.roomType &&
                                        room.roomType
                                                .toLowerCase()
                                                .includes(
                                                        searchTerm.toLowerCase()
                                                )) || // Filter by room type
                                (room.roomNumber &&
                                        room.roomNumber
                                                .toLowerCase()
                                                .includes(
                                                        searchTerm.toLowerCase()
                                                )) || // Filter by room number
                                (room.facilities &&
                                        room.facilities
                                                .toLowerCase()
                                                .includes(
                                                        searchTerm.toLowerCase()
                                                )) // Filter by facilities
                );
                setFilteredRooms(tempList);
        }, [searchTerm, rooms]);

        // Handle search input change
        const handleSearchChange = (e) => {
                setSearchTerm(e.target.value);
        };

        // Retrieve the current user from localStorage
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        const handleMoreInfo = async (roomId) => {
                try {
                        if (!currentUser || !currentUser.userID) {
                                console.error(
                                        "No userId found in localStorage"
                                );
                                alert("Please log in to continue.");
                                return;
                        }

                        const userId = currentUser._id; // Fetch the userId from currentUser

                        // Send request to save user suggestion
                        const response = await axios.post(
                                "/api/room/saveSuggestion",
                                {
                                        userId,
                                        roomId,
                                }
                        );

                        if (response.status === 201) {
                                console.log("Suggestion saved successfully");
                                navigate(`/rooms/${roomId}`);
                        } else {
                                console.error("Failed to save suggestion");
                                alert("Failed to save room suggestion.");
                        }
                } catch (error) {
                        console.error("Error saving user suggestion:", error);
                        alert(
                                "An error occurred while saving your suggestion."
                        );
                }
        };

        // Filter and display only rooms that match with at least 2 attributes (price, facilities, roomType)
        // and have a status of 'Activate'
        const getSimilarRooms = () => {
                return rooms.filter((room) => {
                        // Only include rooms with status 'Activate'
                        if (room.status !== "Activate") {
                                return false;
                        }

                        return userRecommendations.some((recommendation) => {
                                let matchCount = 0;

                                // Check if the price is similar (within a 20% range)
                                if (
                                        Math.abs(
                                                room.price -
                                                        recommendation.price
                                        ) /
                                                recommendation.price <=
                                        0.2
                                ) {
                                        matchCount++;
                                }

                                // Check if roomType is the same
                                if (room.roomType === recommendation.roomType) {
                                        matchCount++;
                                }

                                // Check if at least one facility overlaps
                                if (
                                        room.facilities &&
                                        recommendation.facilities
                                ) {
                                        // Convert facilities to arrays (if not already arrays)
                                        const roomFacilities = Array.isArray(
                                                room.facilities
                                        )
                                                ? room.facilities
                                                : room.facilities
                                                          .split(",")
                                                          .map((f) => f.trim());

                                        const recommendationFacilities =
                                                Array.isArray(
                                                        recommendation.facilities
                                                )
                                                        ? recommendation.facilities
                                                        : recommendation.facilities
                                                                  .split(",")
                                                                  .map((f) =>
                                                                          f.trim()
                                                                  );

                                        // Check if there is any common facility between the two rooms
                                        const hasCommonFacilities =
                                                roomFacilities.some(
                                                        (facility) =>
                                                                recommendationFacilities.includes(
                                                                        facility
                                                                )
                                                );

                                        if (hasCommonFacilities) {
                                                matchCount++;
                                        }
                                }

                                // Only return rooms that match at least two attributes
                                return matchCount >= 2;
                        });
                });
        };

        // SuggestionCard component
        const SuggestionCard = ({ room }) => (
                <div
                        style={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "10px",
                                margin: "10px",
                                width: "200px",
                                textAlign: "center",
                        }}
                >
                        <img
                                src={room.imageUrl}
                                alt={room.roomType}
                                style={{
                                        width: "100%",
                                        height: "120px",
                                        objectFit: "cover",
                                        borderRadius: "4px",
                                }}
                        />
                        <h3 style={{ margin: "10px 0" }}>{room.roomType}</h3>
                        <p>Rs: {room.price}</p>
                        <button
                                onClick={() => handleMoreInfo(room._id)}
                                style={{
                                        backgroundColor: "#219652",
                                        color: "white",
                                        border: "none",
                                        padding: "5px 10px",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                }}
                        >
                                More Info
                        </button>
                </div>
        );

        const similarRooms = getSimilarRooms(); // Get similar rooms

        return (
                <div className="room-list">
                        <h1 style={{ marginLeft: 30 }}>Our Rooms</h1>
                        <hr />
                        <div>
                                <div className="search-bar">
                                        <input
                                                type="text"
                                                placeholder="Search rooms"
                                                value={searchTerm}
                                                onChange={handleSearchChange}
                                                style={{
                                                        marginBottom: "1.5rem",
                                                        width: "300px",
                                                }}
                                        />
                                </div>
                        </div>
                        <div style={{ margin: "20px 0", alignSelf: "center" }}>
                                <h2 style={{ marginBottom: "15px" }}>
                                        Suggestions for You
                                </h2>
                                <div
                                        style={{
                                                display: "flex",
                                                overflowX: "auto",
                                                padding: "10px 0",
                                        }}
                                >
                                        <div>
                                                <h3
                                                        style={{
                                                                margin: "10px 0",
                                                        }}
                                                >
                                                        Best Selling Rooms
                                                </h3>
                                                <div
                                                        style={{
                                                                display: "flex",
                                                                gap: "10px",
                                                        }}
                                                >
                                                        {bestSelling
                                                                .slice(0, 3)
                                                                .map((room) => (
                                                                        <SuggestionCard
                                                                                key={
                                                                                        room._id
                                                                                }
                                                                                room={
                                                                                        room
                                                                                }
                                                                        />
                                                                ))}
                                                </div>
                                        </div>
                                        {/* Only show 'Recommended for You' if there are similar rooms */}
                                        {similarRooms.length > 0 && (
                                                <div
                                                        style={{
                                                                marginLeft: "20px",
                                                        }}
                                                >
                                                        <h3
                                                                style={{
                                                                        margin: "10px 0",
                                                                }}
                                                        >
                                                                Recommended for
                                                                You
                                                        </h3>
                                                        <div
                                                                style={{
                                                                        display: "flex",
                                                                        gap: "10px",
                                                                }}
                                                        >
                                                                {similarRooms
                                                                        .slice(
                                                                                0,
                                                                                3
                                                                        )
                                                                        .map(
                                                                                (
                                                                                        room
                                                                                ) => (
                                                                                        <SuggestionCard
                                                                                                key={
                                                                                                        room._id
                                                                                                }
                                                                                                room={
                                                                                                        room
                                                                                                }
                                                                                        />
                                                                                )
                                                                        )}
                                                        </div>
                                                </div>
                                        )}
                                </div>
                                {filteredRooms
                                        .filter(
                                                (room) =>
                                                        room.status ===
                                                        "Activate"
                                        ) // Filter rooms by status
                                        .map((room) => (
                                                <div
                                                        className="room"
                                                        key={room._id}
                                                >
                                                        <img
                                                                src={
                                                                        room.imageUrl
                                                                }
                                                                alt={
                                                                        room.roomType
                                                                }
                                                        />
                                                        <div className="room-details">
                                                                <h2>
                                                                        {
                                                                                room.roomType
                                                                        }
                                                                </h2>
                                                                <p>
                                                                        Size:{" "}
                                                                        {
                                                                                room.size
                                                                        }{" "}
                                                                        Person
                                                                </p>
                                                                <p>
                                                                        Beds:{" "}
                                                                        {
                                                                                room.bedType
                                                                        }
                                                                </p>
                                                                <div className="room-icons">
                                                                        {(Array.isArray(
                                                                                room.facilities
                                                                        )
                                                                                ? room.facilities
                                                                                : []
                                                                        ).map(
                                                                                (
                                                                                        icon,
                                                                                        index
                                                                                ) => (
                                                                                        <span
                                                                                                key={
                                                                                                        index
                                                                                                }
                                                                                        >
                                                                                                {
                                                                                                        icon
                                                                                                }
                                                                                        </span>
                                                                                )
                                                                        )}
                                                                </div>
                                                        </div>
                                                        <div className="room-price">
                                                                <p>From</p>
                                                                <p>
                                                                        Rs:{" "}
                                                                        {
                                                                                room.price
                                                                        }
                                                                </p>
                                                                <button
                                                                        onClick={() =>
                                                                                handleMoreInfo(
                                                                                        room._id
                                                                                )
                                                                        }
                                                                >
                                                                        More
                                                                        Info
                                                                </button>
                                                        </div>
                                                </div>
                                        ))}
                        </div>
                </div>
        );
}

export default RoomListPage;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";

function ParkingPage() {
    const [selectedDate, setSelectedDate] = useState("");
    const [availability, setAvailability] = useState([]);
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");
    const [bookingDuration, setBookingDuration] = useState("Full day");
    const [user, setUser] = useState(null);
    const [price, setPrice] = useState(0);

    useEffect(() => {
        if (selectedDate) {
            fetchAvailability();
        }
    }, [selectedDate]);

    useEffect(() => {
        const fetchUserByID = async () => {
            // Retrieve user from localStorage
            const userJSON = localStorage.getItem("currentUser");

            // Check if user exists in localStorage
            if (!userJSON) {
                console.error("User not found in localStorage.");
                return;
            }

            // Parse user JSON
            const user = JSON.parse(userJSON);
            setUser(user);
            console.log(user);

            // Check if user has a valid userID
            if (!user || !user.userID) {
                console.error("Invalid user object or userID not found.");
                return;
            }

        };

        fetchUserByID();
    }, []);

    const calculatePrice = () => {
        if (!selectedSlot) return;

        let basePrice = 0;

        if (selectedSlot.startsWith("B")) {
            basePrice = 50; // Example base price for bikes
        } else if (selectedSlot.startsWith("C")) {
            basePrice = 100; // Example base price for cars
        }

        switch (bookingDuration) {
            case "Full day":
                setPrice(basePrice);
                break;
            case "12 hours":
                setPrice(basePrice * 0.75);
                break;
            case "6 hours":
                setPrice(basePrice * 0.5);
                break;
            default:
                setPrice(basePrice);
        }
    };

    useEffect(() => {
        calculatePrice();
    }, [selectedSlot, bookingDuration]);

    const fetchAvailability = async () => {
        try {
            const response = await axios.get(`/api/parking/availability`, {
                params: { date: selectedDate, userID: user.userID },
            });
            setAvailability(response.data);
        } catch (error) {
            message.error("Failed to fetch availability.");
        }
    };

    const handleBookNow = async () => {
        if (!vehicleNumber || !selectedSlot || !selectedDate) {
            message.error("Please fill all the fields.");
            return;
        }
        console.log(user);

        try {
            await axios.post("/api/parking/book", {
                vehicleNumber,
                parkingSlot: selectedSlot,
                date: selectedDate,
                duration: bookingDuration,
                userID: user.userID,
                Price : price
            });
            message.success("Parking slot booked successfully.");
            fetchAvailability(); // Refresh availability after booking
        } catch (error) {
            message.error("Failed to book the parking slot.");
        }
    };

    return (
        <div className="parking-page1244">
            <div className="date-picker-container1244">
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="date-picker1244"
                    placeholder="Select date"
                />
            </div>
            {!selectedDate && (
                <div className="no-date-selected1244">
                    Please select a date to view availability.
                </div>
            )}
            {selectedDate && (
                <div className="availability-grid1244">
                    {Array.from({ length: 5 }).map((_, rowIndex) => (
                        <div className="row1244" key={rowIndex}>
                            {Array.from({ length: 10 }).map((_, colIndex) => {
                                let slotId;
                                if (rowIndex < 2) {
                                    // Bikes: B1, B2, ... B20
                                    slotId = `B${colIndex + 1 + rowIndex * 10}`;
                                } else {
                                    // Cars: C21, C22, ... C50
                                    slotId = `C${colIndex + 1 + (rowIndex - 2) * 10}`;
                                }
                                const isAvailable = availability.includes(slotId);
                                return (
                                    <div
                                        className={`cell1244 ${
                                            isAvailable ? "available1244" : "booked1244"
                                        }`}
                                        key={colIndex}
                                    >
                                        {slotId}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            )}
            <div className="booking-form1244">
                <input
                    type="text"
                    className="vehicle-number-input1244"
                    placeholder="Vehicle Number"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                />
                <select
                    className="slot-select1244"
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                >
                    <option value="" disabled>Select the slot</option>
                    {availability.map((slot) => (
                        <option value={slot} key={slot}>
                            {slot}
                        </option>
                    ))}
                </select>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="date-picker1244"
                    placeholder="Select date"
                />
                <select
                    className="duration-select1244"
                    value={bookingDuration}
                    onChange={(e) => setBookingDuration(e.target.value)}
                >
                    <option value="Full day">Full day</option>
                    <option value="12 hours">12 hours</option>
                    <option value="6 hours">6 hours</option>
                </select>
                <div className="price-display1244">
                    <strong>Price: </strong>LKR {price}
                </div>
                <button
                    className="book-now-btn1244"
                    onClick={handleBookNow}
                    style={{ backgroundColor: "#27ae61", color: "#fff" }}
                >
                    Book Now
                </button>
            </div>
        </div>
    );
}

export default ParkingPage;

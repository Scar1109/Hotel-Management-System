import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card } from "antd";
import moment from "moment"; // Import moment for date formatting

function RoomBookings() {
    const [bookings, setBookings] = useState([]);
    const [packages, setPackages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;

    // Fetch bookings data
    const getBookings = async () => {
        try {
            const response = await axios.get("/api/room/getBookings");
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));
            const filteredBookings = response.data.bookings.filter(
                (booking) => booking.userID === currentUser.userID
            );
            setBookings(filteredBookings);
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch packages
    const fetchPackages = async () => {
        try {
            const response = await axios.get("/api/package/getPackages");
            setPackages(response.data.packages);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    // Create an array of all booking-package pairs
    const bookingPackagePairs = bookings.flatMap((booking) =>
        booking.packages.map((packageName) => {
            const matchedPackage = packages.find(
                (pkg) => pkg.packageName === packageName
            );
            return {
                booking,
                package: matchedPackage || { packageName, notFound: true },
            };
        })
    );

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = bookingPackagePairs.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Fetch bookings when the component mounts
    useEffect(() => {
        getBookings();
    }, []);

    return (
        <div className="bookings-container">
            <h2>Your Package Bookings</h2>
            {currentItems.length === 0 ? (
                <p>No bookings found</p>
            ) : (
                <>
                    <div className="booking-cards">
                        {currentItems.map(({ booking, package: pkg }, index) => (
                            <Card
                                key={`${booking._id}-${pkg.packageName}-${index}`}
                                title={`Booking ID: ${booking.bookingID}`}
                                bordered={true}
                                style={{ marginBottom: 16 }}
                            >
                                <h3>Package Name: {pkg.packageName}</h3>
                                {pkg.notFound ? (
                                    <p>Package details not found</p>
                                ) : (
                                    <>
                                        <p>Package ID: {pkg.packageId}</p>
                                        <p>Description: {pkg.description}</p>
                                    </>
                                )}
                                <p>Guest Name: {booking.guestName}</p>
                                <h5>Package Price:{pkg.price}</h5>
                            </Card>
                        ))}
                    </div>
                    <div className="pagination">
                        <Button
                            type="default"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <span>Page {currentPage}</span>
                        <Button
                            type="default"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={indexOfLastItem >= bookingPackagePairs.length}
                        >
                            Next
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}

export default RoomBookings;

import React, { useState, useEffect, useCallback } from "react";
import { Table, message, DatePicker, Modal, Button, Input } from "antd";
import moment from "moment";
import axios from "axios";

function ParkingBookings() {
    const [bookings, setBookings] = useState([]);
    const [editingBooking, setEditingBooking] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [selectedParkingId, setSelectedParkingId] = useState(null);
    const [user, setUser] = useState(null);
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [bookingDate, setBookingDate] = useState(null);

    const fetchUserByID = useCallback(() => {
        const userJSON = localStorage.getItem("currentUser");
        if (!userJSON) {
            console.error("User not found in localStorage.");
            return;
        }
        const user = JSON.parse(userJSON);
        setUser(user);
    }, []);

    useEffect(() => {
        fetchUserByID();
    }, [fetchUserByID]);

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user]);

    const fetchBookings = async () => {
        if (!user || !user.userID) return;

        try {
            const response = await axios.post("/api/parking/getUserParking", {
                userID: user.userID,
            });
            setBookings(response.data);
        } catch (error) {
            message.error("Failed to fetch bookings.");
        }
    };

    const showDeleteModal = (parkingId) => {
        setSelectedParkingId(parkingId);
        setIsDeleteModalVisible(true);
    };

    const handleDelete = async () => {
        try {
            await axios.post("/api/parking/delete", {
                parkingId: selectedParkingId,
            });
            message.success("Booking deleted successfully.");
            fetchBookings(); // Refresh the bookings list
            setIsDeleteModalVisible(false); // Close delete modal
        } catch (error) {
            message.error("Failed to delete booking.");
        }
    };

    const handleEdit = (record) => {
        setEditingBooking(record);
        setVehicleNumber(record.vehicleNumber);
        setBookingDate(moment(record.bookingDate, "YYYY-MM-DD"));
        setIsModalVisible(true);
    };

    const handleUpdate = async () => {
        try {
            await axios.post("/api/parking/update", {
                parkingId: editingBooking.parkingId,
                vehicleNumber,
                bookingDate: bookingDate.format("YYYY-MM-DD"),
            });
            message.success("Booking updated successfully.");
            setIsModalVisible(false);
            fetchBookings(); // Refresh the bookings list
        } catch (error) {
            message.error("Failed to update booking.");
        }
    };

    const handleDateChange = (date) => {
        setBookingDate(date);
    };

    const columns = [
        {
            title: "Vehicle Number",
            dataIndex: "vehicleNumber",
            key: "vehicleNumber",
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
        },
        {
            title: "Booking Date",
            dataIndex: "bookingDate",
            key: "bookingDate",
        },
        {
            title: "Package Type",
            dataIndex: "packageType",
            key: "packageType",
        },
        {
            title: "Parking ID",
            dataIndex: "parkingId",
            key: "parkingId",
        },
        {
            title: "Actions",
            key: "actions",
            render: (text, record) => (
                <div className="actions-container2345">
                    <Button
                        onClick={() => handleEdit(record)}
                        className="edit-button2345"
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => showDeleteModal(record.parkingId)}
                        className="delete-button2345"
                    >
                        Cancel
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <Table
                columns={columns}
                dataSource={bookings}
                rowKey="parkingId"
                pagination={false}
            />

            <Modal
                title="Edit Booking"
                visible={isModalVisible}
                onOk={handleUpdate}
                onCancel={() => setIsModalVisible(false)}
                okText="Update"
                cancelText="Cancel"
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                    }}
                >
                    <div>
                        <label>Vehicle Number:</label>
                        <Input
                            value={vehicleNumber}
                            onChange={(e) => setVehicleNumber(e.target.value)}
                        />
                    </div>
                    <div className="date-picker-21313">
                        <label>Booking Date:</label>
                        <DatePicker
                            value={bookingDate}
                            onChange={handleDateChange}
                        />
                    </div>
                    <hr />
                    <div>
                        <label>Parking ID:</label>
                        <Input value={editingBooking?.parkingId} disabled />
                    </div>
                    <div>
                        <label>Package Type:</label>
                        <Input value={editingBooking?.packageType} disabled />
                    </div>
                    <div>
                        <label>Price:</label>
                        <Input value={editingBooking?.price} disabled />
                    </div>
                </div>
            </Modal>

            <Modal
                title="Confirm Delete"
                visible={isDeleteModalVisible}
                onOk={handleDelete}
                onCancel={() => setIsDeleteModalVisible(false)}
                okText="Yes, Delete"
                cancelText="Cancel"
            >
                <p>Are you sure you want to delete this booking?</p>
            </Modal>
        </div>
    );
}

export default ParkingBookings;

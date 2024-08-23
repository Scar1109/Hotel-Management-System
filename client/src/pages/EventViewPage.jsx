import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Modal, Form, Input, Button, message,DatePicker } from "antd";
import moment from "moment";

function EventViewPage() {
    const { id } = useParams(); // ID from the URL params
    const [event, setEvent] = useState(null); // Event state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true); // Add loading state
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`/api/event/getEvent/${id}`);
                console.log("Fetched Event Data:", response.data); // Debugging: Log the fetched event data
                setEvent(response.data.event);
            } catch (error) {
                console.error("Error fetching event:", error);
                message.error("Failed to load event data.");
            } finally {
                setLoading(false); // Set loading to false once the request completes
            }
        };

        fetchEvent(); // Fetch event data when the component mounts
    }, [id]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            
            const reservationData = {
                eventId: event.eventId,
                guestName: values.name,
                guestEmail: values.email,
                guestPhone: values.phone,
                eventDate: values.eventDate.format('YYYY-MM-DD'), // Use the selected date from the form
                totalAmount: event.price,
                userID: currentUser.userID // Include userID in the reservation
            };
    
            console.log("Reservation Data:", reservationData); // Debugging: Log the reservation data
    
            await axios.post(`/api/event/reserveEvent/${event.eventId}`, reservationData);
    
            setIsModalOpen(false);
            form.resetFields();
            message.success("Reservation successful!");
        } catch (error) {
            console.error("Failed to reserve:", error);
            message.error("Reservation failed. Please try again.");
        }
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    if (loading) return <p>Loading...</p>; // Show loading state if event data is not yet loaded
    if (!event && !loading) return <p>Event with ID {id} not found.</p>; // Handle case where event is null or not found


    return (
        <div className="event-details-page">
            <div className="event-image">
                <img
                    src={event.baseImage || "https://via.placeholder.com/650"}
                    alt={event.eventName || "Event Image"}
                />
            </div>
            <div className="event-info">
                <h1>{event.eventName}</h1>
                <p>{event.description}</p>
                <h3>Event Type: {event.eventType}</h3>
                {/* <h3>Event Date: {moment(event.eventDate).format("MMMM Do YYYY")}</h3> */}
                <h3>Price: Rs {event.price}</h3>

                <button className="reserve-button" onClick={showModal}>
                    Reserve
                </button>

                <Modal
                    title="Reserve Event"
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="cancel" onClick={handleCancel} className="custom-cancel-button">
                            Cancel
                        </Button>,
                        <Button key="submit" type="primary" onClick={handleOk} className="custom-submit-button">
                            Reserve
                        </Button>,
                    ]}
                    className="custom-event-reservation-modal"
                >
                    <Form form={form} layout="vertical">
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                { required: true, message: "Please enter your name" },
                                { min: 2, message: "Name must be at least 2 characters" },
                                { max: 50, message: "Name must be at most 50 characters" }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: "Please enter your email" },
                                { type: "email", message: "Please enter a valid email" }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Phone Number"
                            name="phone"
                            rules={[
                                { required: true, message: "Please enter your phone number" },
                                {
                                    validator: (_, value) => {
                                        if (!value) {
                                            return Promise.reject(new Error('Please enter your phone number'));
                                        }
                                        if (!/^[0-9]+$/.test(value)) {
                                            return Promise.reject(new Error('Phone number must contain only digits'));
                                        }
                                        if (value.length !== 10) {
                                            return Promise.reject(new Error('Phone number must be exactly 10 digits long'));
                                        }
                                        return Promise.resolve();
                                    }
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Event Date"
                            name="eventDate"
                            rules={[
                                { required: true, message: "Please select an event date" },
                                {
                                    validator: (_, value) => {
                                        if (!value) {
                                            return Promise.reject(new Error('Please select an event date'));
                                        }
                                        if (value.isBefore(moment().startOf('day'))) {
                                            return Promise.reject(new Error('Event date must be a future date'));
                                        }
                                        return Promise.resolve();
                                    }
                                }
                            ]}
                        >
                            <DatePicker format="YYYY-MM-DD" />
                        </Form.Item>

                        <p className="total-cost">Total Cost: Rs {event.price}</p>
                    </Form>
                </Modal>
            </div>
        </div>
    );
}

export default EventViewPage;

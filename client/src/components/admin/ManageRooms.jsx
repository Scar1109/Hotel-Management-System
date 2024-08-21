import React, { useState, useEffect } from "react";
import { Space, Table, Tag, Modal, Input, message, Form, Select } from "antd";
import { Icon } from "@iconify/react";
import axios from "axios";

function ManageRooms() {
    // State declarations for modals and data
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [editingRoom, setEditingRoom] = useState(null);

    const [form] = Form.useForm(); // Form instance for add room
    const [updateForm] = Form.useForm(); // Form instance for update room

    // Show and hide modals
    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };
    const showUpdateModal = (room) => {
        setEditingRoom(room);
        setIsUpdateModalOpen(true);
        updateForm.setFieldsValue(room);
    };
    const handleUpdateCancel = () => {
        setIsUpdateModalOpen(false);
        updateForm.resetFields();
        setEditingRoom(null);
    };

    // Fetch rooms from the API
    const fetchRooms = async () => {
        try {
            const response = await axios.get("/api/room/getRooms");
            setRooms(response.data.rooms);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    // Add new room
    const addRoom = async () => {
        try {
            const values = await form.validateFields();
            await axios.post("/api/room/addRoom", values);
            setIsModalOpen(false);
            message.success("Room added successfully");
            fetchRooms();
            form.resetFields();
        } catch (err) {
            console.log(err);
            message.error("Failed to add room");
        }
    };

    // Update room
    const handleUpdate = async () => {
        try {
            const values = await updateForm.validateFields();
            await axios.put(`/api/room/updateRoom/${editingRoom._id}`, values);
            setIsUpdateModalOpen(false);
            message.success("Room updated successfully");
            fetchRooms();
            updateForm.resetFields();
        } catch (err) {
            console.log(err);
            message.error("Failed to update room");
        }
    };

    // Delete room
    const deleteRoom = async (id) => {
        try {
            await axios.delete(`/api/room/deleteRoom/${id}`);
            message.success("Room deleted successfully");
            fetchRooms(); // Refresh the list of rooms after deletion
        } catch (err) {
            console.log(err);
            message.error("Failed to delete room");
        }
    };

    // Table columns for Ant Design Table component
    const columns = [
        {
            title: "Room no",
            dataIndex: "roomNumber",
            key: "roomNumber",
            render: (text) => <a>{text}</a>,
        },
        {
            title: "Room Type",
            dataIndex: "roomType",
            key: "roomType",
        },
        {
            title: "Facilities",
            dataIndex: "facilities",
            key: "facilities",
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
        },
        {
            title: "Status",
            key: "status",
            dataIndex: "status",
            render: (status) => (
                <Tag color={status === "Suspended" ? "volcano" : "green"}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Icon
                        onClick={() => showUpdateModal(record)}
                        icon="akar-icons:edit"
                        width="24"
                        height="24"
                    />
                    <Icon
                        onClick={() => deleteRoom(record._id)}
                        icon="material-symbols:delete"
                        width="24"
                        height="24"
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className="manage_room">
            <div className="manage_room_content">
                <div className="manage_room_header">
                    <h1>Manage Rooms</h1>
                    <button className="add_new_room" onClick={showModal}>
                        Add Room
                    </button>
                    <Modal
                        title="Add Room"
                        open={isModalOpen}
                        onOk={addRoom}
                        onCancel={handleCancel}
                    >
                        <Form form={form} layout="vertical">
                            <Form.Item
                                label="Image URL"
                                name="imageUrl"
                                rules={[{ required: true, message: "Please enter the image URL" }]}
                            >
                                <Input placeholder="Paste image URL" />
                            </Form.Item>
                            <Form.Item
                                label="Room Number"
                                name="roomNumber"
                                rules={[{ required: true, message: "Please enter the room number" }]}
                            >
                                <Input placeholder="Enter room number" />
                            </Form.Item>
                            <Form.Item
                                label="Room Type"
                                name="roomType"
                                rules={[{ required: true, message: "Please enter the room type" }]}
                            >
                                <Input placeholder="Enter room type" />
                            </Form.Item>
                            <Form.Item
                                label="Room Facilities"
                                name="facilities"
                                rules={[{ required: true, message: "Please enter the room facilities" }]}
                            >
                                <Input placeholder="Enter room facilities" />
                            </Form.Item>
                            <Form.Item
                                label="Room Price"
                                name="price"
                                rules={[
                                    { required: true, message: "Please enter the room price" },
                                    { type: "number", message: "Price must be a number", transform: (value) => Number(value) },
                                ]}
                            >
                                <Input placeholder="Enter room price" />
                            </Form.Item>
                            <Form.Item
                                label="Room Status"
                                name="status"
                                rules={[{ required: true, message: "Please select the room status" }]}
                            >
                                <Select
                                    style={{ width: 470 }}
                                    options={[
                                        { value: "Activate", label: "Activate" },
                                        { value: "Suspended", label: "Suspended" },
                                    ]}
                                />
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
                <div className="manageroom_table">
                    <Table columns={columns} dataSource={rooms} />
                </div>
                <Modal
                    title="Update Room"
                    open={isUpdateModalOpen}
                    onOk={handleUpdate}
                    onCancel={handleUpdateCancel}
                >
                    <Form form={updateForm} layout="vertical">
                        <Form.Item
                            label="Image URL"
                            name="imageUrl"
                            rules={[{ required: true, message: "Please enter the image URL" }]}
                        >
                            <Input placeholder="Paste image URL" />
                        </Form.Item>
                        <Form.Item
                            label="Room Number"
                            name="roomNumber"
                            rules={[{ required: true, message: "Please enter the room number" }]}
                        >
                            <Input placeholder="Enter room number" />
                        </Form.Item>
                        <Form.Item
                            label="Room Type"
                            name="roomType"
                            rules={[{ required: true, message: "Please enter the room type" }]}
                        >
                            <Input placeholder="Enter room type" />
                        </Form.Item>
                        <Form.Item
                            label="Room Facilities"
                            name="facilities"
                            rules={[{ required: true, message: "Please enter the room facilities" }]}
                        >
                            <Input placeholder="Enter room facilities" />
                        </Form.Item>
                        <Form.Item
                            label="Room Price"
                            name="price"
                            rules={[
                                { required: true, message: "Please enter the room price" },
                                { type: "number", message: "Price must be a number", transform: (value) => Number(value) },
                            ]}
                        >
                            <Input placeholder="Enter room price" />
                        </Form.Item>
                        <Form.Item
                            label="Room Status"
                            name="status"
                            rules={[{ required: true, message: "Please select the room status" }]}
                        >
                            <Select
                                style={{ width: 470 }}
                                options={[
                                    { value: "Activate", label: "Activate" },
                                    { value: "Suspended", label: "Suspended" },
                                ]}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
}

export default ManageRooms;

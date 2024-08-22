import React, { useState, useEffect } from "react";
import {
      Space,
      Table,
      Tag,
      Modal,
      Input,
      message,
      Form,
      Select,
      InputNumber,
} from "antd";
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

      const OPTIONS = [
            "WiFi",
            "Air Conditioning",
            "Swimming Pool",
            "Gym",
            "Spa",
            "Restaurant",
      ];
      const [selectedItems, setSelectedItems] = useState([]);

      const filteredOptions = OPTIONS.filter(
            (option) => !selectedItems.includes(option)
      );

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
            setSelectedItems(room.amenities || []); // Set initial selected amenities
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
                  const roomData = { ...values, amenities: selectedItems }; // Include amenities
                  console.log("Submitting Room Data:", roomData); // Debugging line
                  await axios.post("/api/room/addRoom", roomData);
                  setIsModalOpen(false);
                  message.success("Room added successfully");
                  fetchRooms();
                  form.resetFields();
            } catch (err) {
                  console.log(err);
                  message.error(
                        err.response?.data?.message || "Failed to add room"
                  );
            }
      };

      // Update room
      const handleUpdate = async () => {
            try {
                  const values = await updateForm.validateFields();
                  await axios.put(`/api/room/updateRoom/${editingRoom._id}`, {
                        ...values,
                        amenities: selectedItems,
                  });
                  setIsUpdateModalOpen(false);
                  message.success("Room updated successfully");
                  fetchRooms();
                  updateForm.resetFields();
            } catch (err) {
                  console.log(err);
                  message.error(
                        err.response?.data?.message || "Failed to update room"
                  );
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
                        <Tag
                              color={
                                    status === "Suspended" ? "volcano" : "green"
                              }
                        >
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
                              <button
                                    className="add_new_room"
                                    onClick={showModal}
                              >
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
                                          >
                                                <Input placeholder="Paste image URL" />
                                          </Form.Item>
                                          <Form.Item
                                                label="Room Number"
                                                name="roomNumber"
                                                rules={[
                                                      {
                                                            required: true,
                                                            message: "Please enter the room number",
                                                      },
                                                ]}
                                          >
                                                <Input placeholder="Enter room number" />
                                          </Form.Item>
                                          <Form.Item
                                                label="Room Type"
                                                name="roomType"
                                                rules={[
                                                      {
                                                            required: true,
                                                            message: "Please enter the room type",
                                                      },
                                                ]}
                                          >
                                                <Input placeholder="Enter room type" />
                                          </Form.Item>
                                          <Form.Item
                                                label="Room Facilities"
                                                name="facilities"
                                                rules={[
                                                      {
                                                            required: true,
                                                            message: "Please enter the room facilities",
                                                      },
                                                ]}
                                          >
                                                <Input placeholder="Enter room facilities" />
                                          </Form.Item>
                                          <Form.Item
                                                label="Bed Type"
                                                name="bedType"
                                                rules={[
                                                      {
                                                            required: true,
                                                            message: "Please enter the bed type",
                                                      },
                                                ]}
                                          >
                                                <Input placeholder="Enter bed type" />
                                          </Form.Item>
                                          <Form.Item
                                                label="Number of Person"
                                                name="size"
                                                rules={[
                                                      {
                                                            required: true,
                                                            message: "Please enter the number of person",
                                                      },
                                                      {
                                                            type: "number",
                                                            message: "Price must be a number",
                                                            transform: (
                                                                  value
                                                            ) => Number(value),
                                                      },
                                                ]}
                                          >
                                                <Input placeholder="Enter the number of person" />
                                          </Form.Item>
                                          <Form.Item
                                                label="View information"
                                                name="viewInformation"
                                          >
                                                <Input placeholder="Enter View Information" />
                                          </Form.Item>
                                          <Form.Item
                                                label="Room Price"
                                                name="price"
                                                rules={[
                                                      {
                                                            required: true,
                                                            message: "Please enter the room price",
                                                      },
                                                      {
                                                            type: "number",
                                                            message: "Price must be a number",
                                                            transform: (
                                                                  value
                                                            ) => Number(value),
                                                      },
                                                ]}
                                          >
                                                <InputNumber
                                                      placeholder="Enter room price"
                                                      style={{ width: "100%" }}
                                                />
                                          </Form.Item>
                                          <Form.Item
                                                label="Room Amenities"
                                                name="amenities"
                                                rules={[
                                                      {
                                                            required: true,
                                                            message: "Please select the Room Amenities",
                                                      },
                                                ]}
                                          >
                                                <Select
                                                      mode="multiple"
                                                      placeholder="Select Room Amenities"
                                                      value={selectedItems}
                                                      onChange={
                                                            setSelectedItems
                                                      }
                                                      style={{ width: "100%" }}
                                                      options={filteredOptions.map(
                                                            (item) => ({
                                                                  value: item,
                                                                  label: item,
                                                            })
                                                      )}
                                                />
                                          </Form.Item>
                                          <Form.Item
                                                label="Room Status"
                                                name="status"
                                                rules={[
                                                      {
                                                            required: true,
                                                            message: "Please select the room status",
                                                      },
                                                ]}
                                          >
                                                <Select
                                                      style={{ width: "100%" }}
                                                      options={[
                                                            {
                                                                  value: "Activate",
                                                                  label: "Activate",
                                                            },
                                                            {
                                                                  value: "Suspended",
                                                                  label: "Suspended",
                                                            },
                                                      ]}
                                                />
                                          </Form.Item>
                                    </Form>
                              </Modal>
                        </div>
                        <div className="manageroom_table">
                              <Table
                                    columns={columns}
                                    dataSource={[...rooms].reverse()} // Create a shallow copy and reverse
                                    pagination={{ pageSize: 6 }} // Display 6 rows per page
                              />
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
                                    >
                                          <Input placeholder="Paste image URL" />
                                    </Form.Item>
                                    <Form.Item
                                          label="Room Number"
                                          name="roomNumber"
                                          rules={[
                                                {
                                                      required: true,
                                                      message: "Please enter the room number",
                                                },
                                          ]}
                                    >
                                          <Input placeholder="Enter room number" />
                                    </Form.Item>
                                    <Form.Item
                                          label="Room Type"
                                          name="roomType"
                                          rules={[
                                                {
                                                      required: true,
                                                      message: "Please enter the room type",
                                                },
                                          ]}
                                    >
                                          <Input placeholder="Enter room type" />
                                    </Form.Item>
                                    <Form.Item
                                          label="Room Facilities"
                                          name="facilities"
                                          rules={[
                                                {
                                                      required: true,
                                                      message: "Please enter the room facilities",
                                                },
                                          ]}
                                    >
                                          <Input placeholder="Enter room facilities" />
                                    </Form.Item>
                                    <Form.Item
                                          label="Bed Type"
                                          name="bedType"
                                          rules={[
                                                {
                                                      required: true,
                                                      message: "Please enter the bed type",
                                                },
                                          ]}
                                    >
                                          <Input placeholder="Enter bed type" />
                                    </Form.Item>
                                    <Form.Item
                                                label="Number of Person"
                                                name="size"
                                                rules={[
                                                      {
                                                            required: true,
                                                            message: "Please enter the number of person",
                                                      },
                                                      {
                                                            type: "number",
                                                            message: "Price must be a number",
                                                            transform: (
                                                                  value
                                                            ) => Number(value),
                                                      },
                                                ]}
                                          >
                                                <Input placeholder="Enter the number of person" />
                                          </Form.Item>
                                    <Form.Item
                                          label="View information"
                                          name="viewInformation"
                                    >
                                          <Input placeholder="Enter View Information" />
                                    </Form.Item>
                                    <Form.Item
                                          label="Room Price"
                                          name="price"
                                          rules={[
                                                {
                                                      required: true,
                                                      message: "Please enter the room price",
                                                },
                                                {
                                                      type: "number",
                                                      message: "Price must be a number",
                                                      transform: (value) =>
                                                            Number(value),
                                                },
                                          ]}
                                    >
                                          <InputNumber
                                                placeholder="Enter room price"
                                                style={{ width: "100%" }}
                                          />
                                    </Form.Item>
                                    <Form.Item
                                          label="Room Amenities"
                                          name="amenities"
                                          rules={[
                                                {
                                                      required: true,
                                                      message: "Please select the Room Amenities",
                                                },
                                          ]}
                                    >
                                          <Select
                                                mode="multiple"
                                                placeholder="Select Room Amenities"
                                                value={selectedItems}
                                                onChange={setSelectedItems}
                                                style={{ width: "100%" }}
                                                options={filteredOptions.map(
                                                      (item) => ({
                                                            value: item,
                                                            label: item,
                                                      })
                                                )}
                                          />
                                    </Form.Item>
                                    <Form.Item
                                          label="Room Status"
                                          name="status"
                                          rules={[
                                                {
                                                      required: true,
                                                      message: "Please select the room status",
                                                },
                                          ]}
                                    >
                                          <Select
                                                style={{ width: "100%" }}
                                                options={[
                                                      {
                                                            value: "Activate",
                                                            label: "Activate",
                                                      },
                                                      {
                                                            value: "Suspended",
                                                            label: "Suspended",
                                                      },
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

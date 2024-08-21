import React, { useState, useEffect } from "react";
import { Space, Table, Tag, Modal, Input } from "antd";
import { Icon } from "@iconify/react";
import axios from "axios";

function ManageRooms() {
      // Add Room Modal
      const [isModalOpen, setIsModalOpen] = useState(false);
      const showModal = () => {
            setIsModalOpen(true);
      };
      const handleOk = () => {
            setIsModalOpen(false);
      };
      const handleCancel = () => {
            setIsModalOpen(false);
      };

      // Update Room Modal
      const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
      const showUpdateModal = () => {
            setIsUpdateModalOpen(true);
      };
      const handleUpdate = () => {
            setIsUpdateModalOpen(false);
      };

      //add new room
      const [newRoomData, setNewRoomData] = useState();
      const AddRoom = async () => {
            try {
                  console.log("new room data", newRoomData);
                  const response = await axios.post(
                        "/api/room/addRoom",
                        newRoomData
                  );
                  setIsModalOpen(false);
                  fetchRooms();
            } catch (err) {
                  console.log(err);
            }
      };

      const handleInputChange = (e) => {
            setNewRoomData({
                  ...newRoomData,
                  [e.target.name]: e.target.value,
            });
      };

      //Fetch Room Data
      const [rooms, setRooms] = useState([]);
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

      // Room Details Table Columns
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
                                onClick={showUpdateModal}
                                icon="akar-icons:edit"
                                width="24"
                                height="24"
                          />
                          <Icon
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
                                    onOk={AddRoom}
                                    onCancel={handleCancel}
                              >
                                    <div className="room_model">
                                          Image URL:
                                          <Input
                                                name="imageUrl"
                                                placeholder="Paste image URL"
                                                onChange={handleInputChange}
                                          />
                                          Room Number:
                                          <Input
                                                name="roomNumber"
                                                placeholder="Enter room number"
                                                onChange={handleInputChange}
                                          />
                                          Room Type:
                                          <Input
                                                name="roomType"
                                                placeholder="Enter room type"
                                                onChange={handleInputChange}
                                          />
                                          Room Facilities:
                                          <Input
                                                name="facilities"
                                                placeholder="Enter room facilities"
                                                onChange={handleInputChange}
                                          />
                                          Room Price:
                                          <Input
                                                name="price"
                                                placeholder="Enter room price"
                                                onChange={handleInputChange}
                                          />
                                          Room Status:
                                          <Input
                                                name="status"
                                                placeholder="Enter room status"
                                                onChange={handleInputChange}
                                          />
                                    </div>
                              </Modal>
                        </div>
                        <div className="manageroom_table">
                              <Table columns={columns} dataSource={rooms} />
                        </div>
                        <Modal
                              title="Update Room"
                              open={isUpdateModalOpen}
                              onOk={handleUpdate}
                              onCancel={handleCancel}
                        >
                              <p>Some contents...</p>
                        </Modal>
                  </div>
            </div>
      );
}

export default ManageRooms;

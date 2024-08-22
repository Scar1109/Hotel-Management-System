import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, message, DatePicker } from "antd";
import moment from "moment";

const LeaveDetails = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const empID = user.userID;

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/employee/getLeave/${empID}`
            );
            setLeaves(response.data.leaves);
        } catch (error) {
            message.error("Failed to retrieve leaves");
        } finally {
            setLoading(false);
        }
    };

    const handleAddLeave = async () => {
        if (!fromDate || !toDate) {
            message.error("Please select both From Date and To Date");
            return;
        }

        // Convert the dates to 'YYYY-MM-DD' format using moment
        const formattedFromDate = moment(fromDate).format('YYYY-MM-DD');
        const formattedToDate = moment(toDate).format('YYYY-MM-DD');

        try {
            const response = await axios.post(
                "http://localhost:5000/api/employee/addLeave",
                {
                    empID,
                    fromDate: formattedFromDate,
                    toDate: formattedToDate,
                }
            );
            setLeaves(response.data.leaves);
            message.success("Leave added successfully");
            closeModal();
        } catch (error) {
            message.error("Failed to add leave");
        }
    };

    const openModal = () => {
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setFromDate(null);
        setToDate(null);
    };

    const columns = [
        { title: "Leave ID", dataIndex: "leaveID", key: "leaveID" },
        { title: "From Date", dataIndex: "fromDate", key: "fromDate" },
        { title: "To Date", dataIndex: "toDate", key: "toDate" },
        { title: "Status", dataIndex: "status", key: "status" },
    ];

    return (
        <div id="leave-request-container-1234">
            <div className="leave-header-container-1234">
                <h1>Leave Details</h1>
                <button id="custom-add-button-1234" onClick={openModal}>
                    Add
                </button>
            </div>

            {isModalVisible && (
                <div id="custom-modal-1234">
                    <div id="custom-modal-content-1234">
                        <h2>Request Leave</h2>
                        <div className="custom-model-date-container-1234">
                            <DatePicker
                                placeholder="From Date"
                                onChange={(date, dateString) =>
                                    setFromDate(dateString)
                                }
                            />
                            <DatePicker
                                placeholder="To Date"
                                onChange={(date, dateString) =>
                                    setToDate(dateString)
                                }
                            />
                        </div>
                        <div id="custom-modal-actions-1234">
                            <button
                                id="custom-modal-button-submit-1234"
                                onClick={handleAddLeave}
                            >
                                Submit
                            </button>
                            <button
                                id="custom-modal-button-cancel-1234"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="center">
                    <p>Loading...</p>
                </div>
            ) : leaves.length === 0 ? (
                <div className="center">
                    <p>No any leaves found. Click "add" button to request</p>
                </div>
            ) : (
                <Table
                    dataSource={leaves}
                    columns={columns}
                    rowKey="_id"
                    pagination={false}
                />
            )}
        </div>
    );
};

export default LeaveDetails;

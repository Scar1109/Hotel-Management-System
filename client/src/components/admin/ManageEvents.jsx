import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Pagination, message } from 'antd';
import axios from 'axios';
import { Icon } from '@iconify/react';
import { DatePicker } from 'antd';
import moment from 'moment';

const { confirm } = Modal;

const ManageEvents = () => {
    const [events, setEvents] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [searchText, setSearchText] = useState("");

    const [form] = Form.useForm();

    useEffect(() => {
        fetchEvents();
    }, [pagination.current, searchText]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/Event/getEvents', {
                params: {
                    page: pagination.current,
                    limit: pagination.pageSize,
                    search: searchText,
                }
            });
            setEvents(data.events);
            setPagination({ ...pagination, total: data.totalPages * pagination.pageSize });
        } catch (error) {
            message.error("Error fetching events");
        } finally {
            setLoading(false);
        }
    };

    const handleAddNewEvent = () => {
        setIsEditMode(false);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEditEvent = (record) => {
        setIsEditMode(true);
        setSelectedEvent(record);
        form.setFieldsValue({
            ...record,
            eventDate: moment(record.eventDate)  // Convert the date to a moment object
        });
        setIsModalVisible(true);
    };

    const showDeleteConfirm = (eventId) => {
        confirm({
            title: 'Are you sure you want to delete this event?',
            content: 'This action cannot be undone',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await axios.post('/api/Event/deleteEvent', { eventId });
                    message.success('Event deleted successfully');
                    fetchEvents();
                } catch (error) {
                    message.error('Error deleting event');
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedEvent(null);
    };

    const handleSubmit = async (values) => {
        try {
            if (isEditMode) {
                await axios.post('/api/Event/updateEvent', { ...values, eventId: selectedEvent.eventId });
                message.success('Event updated successfully');
            } else {
                await axios.post('/api/Event/addEvent', values);
                message.success('Event added successfully');
            }
            setIsModalVisible(false);
            fetchEvents();
        } catch (error) {
            message.error(isEditMode ? 'Error updating event' : 'Error adding event');
        }
    };

    const columns = [
        { title: 'Event ID', dataIndex: 'eventId', key: 'eventId' },
        { title: 'Event Name', dataIndex: 'eventName', key: 'eventName' },
        { title: 'Event Type', dataIndex: 'eventType', key: 'eventType' },
        { title: 'Price', dataIndex: 'price', key: 'price' },
        { title: 'Date', dataIndex: 'eventDate', key: 'eventDate', render: text => new Date(text).toLocaleDateString() },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div className="action-buttons-manageEvent">
                    <Icon
                        onClick={() => handleEditEvent(record)}
                        icon="akar-icons:edit"
                        width="24"
                        height="24"
                        style={{ cursor: 'pointer', marginRight: '10px' }}
                    />
                    <Icon
                        onClick={() => showDeleteConfirm(record.eventId)}
                        icon="material-symbols:delete"
                        width="24"
                        height="24"
                        style={{ cursor: 'pointer', color: 'red' }}
                    />
                </div>
            ),
        },
    ];

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    return (
        <div className="sg_eventManage_table_bg">
            <div className="manage-events">
                <div className="search-add-container">
                    <Input placeholder="Search events" value={searchText} onChange={handleSearch} className="search-bar-eventmanage" />
                    <Button type="primary" onClick={handleAddNewEvent} className="add-event-button" style={{ backgroundColor: '#25b05f' }}>Add Event</Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={events}
                    pagination={false}
                    loading={loading}
                    rowKey="eventId"
                />
                <Pagination
                    {...pagination}
                    onChange={(page) => setPagination({ ...pagination, current: page })}
                    className="pagination-eventMange"
                />
                <Modal
                    title={isEditMode ? "Edit Event" : "Add New Event"}
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    onOk={() => form.submit()}
                >
                    <Form
                        form={form}
                        onFinish={handleSubmit}
                        layout="vertical"
                    >
                        <Form.Item label="Event Name" name="eventName" rules={[{ required: true, message: 'Please input the event name!' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Event Type" name="eventType" rules={[{ required: true, message: 'Please input the event type!' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please input the price!' }]}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please input the description!' }]}>
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item
                            label="Event Date"
                            name="eventDate"
                            rules={[
                                { required: true, message: 'Please select the event date!' },
                                {
                                    validator: (_, value) => {
                                        if (!value || value.isAfter(moment())) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The event date must be in the future!'));
                                    }
                                }
                            ]}
                        >
                            <DatePicker format="YYYY-MM-DD" />
                        </Form.Item>
                        <Form.Item label="Image Link" name="baseImage" rules={[{ required: true, message: 'Please input the image link!' }]}>
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
}

export default ManageEvents;

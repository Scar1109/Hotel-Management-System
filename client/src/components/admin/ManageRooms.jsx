import React from "react";
import { Space, Table, Tag } from "antd";

const columns = [
      {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text) => <a>{text}</a>,
      },
      {
            title: "Age",
            dataIndex: "age",
            key: "age",
      },
      {
            title: "Address",
            dataIndex: "address",
            key: "address",
      },
      {
            title: "Tags",
            key: "tags",
            dataIndex: "tags",
            render: (_, { tags }) => (
                  <>
                        {tags.map((tag) => {
                              let color =
                                    tag === "Suspended" ? "volcano" : "green";

                              return (
                                    <Tag color={color} key={tag}>
                                          {tag.toUpperCase()}
                                    </Tag>
                              );
                        })}
                  </>
            ),
      },
      {
            title: "Action",
            key: "action",
            render: (_, record) => (
                  <Space size="middle">
                        <a>Invite {record.name}</a>
                        <a>Delete</a>
                  </Space>
            ),
      },
];
const data = [
      {
            key: "1",
            name: "John Brown",
            age: 32,
            address: "New York No. 1 Lake Park",
            tags: ["Activate"],
      },
      {
            key: "2",
            name: "Jim Green",
            age: 42,
            address: "London No. 1 Lake Park",
            tags: ["Activate"],
      },
      {
            key: "3",
            name: "Joe Black",
            age: 32,
            address: "Sydney No. 1 Lake Park",
            tags: ["Suspended"],
      },
];

function ManageRooms() {
      return (
            <div className="manage_room">
                  <div className="manage_room_content">
                        <div className="manage_room_header">
                              <h1>Manage Rooms</h1>
                              <button className="add_new_room">Add Room</button>
                        </div>
                        <div className="manageroom_table">
                              <Table columns={columns} dataSource={data} />
                        </div>
                  </div>
            </div>
      );
}

export default ManageRooms;

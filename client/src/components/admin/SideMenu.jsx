import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from '@iconify/react';
import Logo from "../../assets/Logo/logo.png";

import { Menu, ConfigProvider } from "antd";

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}

const items = [
    getItem("Dashboard", "/admin", <Icon icon="material-symbols:dashboard-outline" />),
    getItem("Events", "/admin/manage-events", <Icon icon="ic:outline-inventory" />),
    getItem("Foods", "/admin/manage-foods", <Icon icon="mdi:food" />),
    getItem("Orders", "/admin/manage-orders", <Icon icon="mdi:cart-outline" />),
    getItem("Packages", "/admin/manage-packages", <Icon icon="ri:news-line" />),
    getItem("Parking", "/admin/manage-parkings", <Icon icon="mdi:parking" />),
    getItem("Rooms", "/admin/manage-rooms", <Icon icon="cil:room" />),
];

// submenu keys of first level
const rootSubmenuKeys = ["sub1", "sub2", "sub3", "sub4", "sub5", "sub6", "sub7"];

function SideMenu() {
    const location = useLocation();
    const navigate = useNavigate();
    const [openKeys, setOpenKeys] = useState(["/admin"]);
    const [selectedKeys, setSelectedKeys] = useState("/admin");

    useEffect(() => {
        const pathName = location.pathname;
        setSelectedKeys(pathName);
    }, [location.pathname]);

    const onOpenChange = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
        if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };
    return (
        <div className="Admin_SideMenu">
            <img src={Logo} alt="logo" className="admin_sidebar_logo" />
            <ConfigProvider
                theme={{
                    components: {
                        Menu: {
                            iconSize: "20px",
                            itemHeight: "40px",
                            subMenuItemBg : "#ffffff",
                        },
                    },
                }}
            >
                <Menu
                    mode="inline"
                    openKeys={openKeys}
                    selectedKeys={[selectedKeys]}
                    onOpenChange={onOpenChange}
                    onClick={(item) => {
                        navigate(item.key);
                    }}
                    style={{
                        width: 256,
                        textAlign: "left",
                    }}
                    items={items}
                />
            </ConfigProvider>
        </div>
    );
}

export default SideMenu;

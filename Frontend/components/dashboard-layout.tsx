"use client"

import type React from "react"

import { Layout, Menu, Button, Typography, Avatar, Dropdown } from "antd"
import {
  AppstoreOutlined,
  ShoppingOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

const { Header, Sider, Content } = Layout
const { Title } = Typography

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  const menuItems = [
    {
      key: "/dashboard/categories",
      icon: <AppstoreOutlined />,
      label: "Categorías",
      onClick: () => router.push("/dashboard/categories"),
    },
    {
      key: "/dashboard/products",
      icon: <ShoppingOutlined />,
      label: "Productos",
      onClick: () => router.push("/dashboard/products"),
    },
  ]

  const userMenuItems = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Cerrar Sesión",
      onClick: handleLogout,
    },
  ]

  return (
    <Layout className="min-h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed} className="bg-white shadow-md">
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <Title level={4} className="m-0 text-blue-600">
            {collapsed ? "A" : "Admin"}
          </Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          className="border-r-0"
          style={{ height: "calc(100vh - 64px)" }}
        />
      </Sider>
      <Layout>
        <Header className="flex items-center justify-between bg-white px-6 shadow-sm">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg"
          />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div className="flex cursor-pointer items-center gap-2">
              <Avatar icon={<UserOutlined />} className="bg-blue-600" />
              <span className="text-sm text-gray-700">{user?.email || "Usuario"}</span>
            </div>
          </Dropdown>
        </Header>
        <Content className="m-6 rounded-lg bg-white p-6 shadow-sm">{children}</Content>
      </Layout>
    </Layout>
  )
}

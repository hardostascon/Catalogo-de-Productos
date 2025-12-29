"use client"

import { Button, Form, Input, Card, Typography, message } from "antd"
import { MailOutlined, LockOutlined } from "@ant-design/icons"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"

const { Title, Text } = Typography

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleLogin = async (values: { Email: string; Password: string }) => {
    setIsLoading(true)

    try {
      await login(values.Email, values.Password)
      message.success("Inicio de sesión exitoso")
    } catch (error: unknown) {
      message.error(error instanceof Error ? error.message : "Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="mb-6 text-center">
          <Title level={2} className="mb-2">
            Iniciar Sesión
          </Title>
          <Text type="secondary">Ingresa tus credenciales para continuar</Text>
        </div>

        <Form name="login" onFinish={handleLogin} layout="vertical" size="large">
          <Form.Item
            name="Email"
            rules={[
              { required: true, message: "Por favor ingresa tu email" },
              { type: "email", message: "Email inválido" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item name="Password" rules={[{ required: true, message: "Por favor ingresa tu contraseña" }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Contraseña" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading} className="w-full">
              Iniciar Sesión
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

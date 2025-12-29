"use client"

import { useState, useEffect } from "react"
import { Table, Button, Modal, Form, Input, Space, Typography, message, Popconfirm } from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons"
import { apiClient } from "@/lib/api-client"
import type { ColumnsType, TablePaginationConfig } from "antd/es/table"
import type { SorterResult, FilterValue } from "antd/es/table/interface"

const { Title } = Typography
const { TextArea, Search } = Input

interface Category {
  id: string
  Nombre: string
  Descripcion: string | null
  FechaCreacion: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [form] = Form.useForm()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [sortField, setSortField] = useState<string>('FechaCreacion')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [searchText, setSearchText] = useState('')

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await apiClient.getCategories({
        page: pagination.current,
        pageSize: pagination.pageSize,
        sortField,
        sortOrder,
        search: searchText
      })
      
      const categoriesWithId = response.data.map(cat => ({
        ...cat,
        id: cat.IdCategoria || cat.id
      }))
      
      setCategories(categoriesWithId)
      setPagination(prev => ({ ...prev, total: response.total }))
    } catch (error) {
      message.error("Error al cargar categorías")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [pagination.current, pagination.pageSize, sortField, sortOrder, searchText])

  const handleCreate = () => {
    setEditingCategory(null)
    form.resetFields()
    setModalOpen(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    form.setFieldsValue({
      Nombre: category.Nombre,
      Descripcion: category.Descripcion,
    })
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
     console.log("ID a eliminar:", id) 
    try {
      await apiClient.deleteCategory(id)
      message.success("Categoría eliminada exitosamente")
      fetchCategories()
    } catch (error) {
      message.error("Error al eliminar categoría")
      console.error(error)
    }
  }

  const handleSubmit = async (values: { Nombre: string; Descripcion?: string }) => {
    try {
      if (editingCategory) {
        await apiClient.updateCategory(editingCategory.id, values)
        message.success("Categoría actualizada exitosamente")
      } else {
        await apiClient.createCategory(values)
        message.success("Categoría creada exitosamente")
      }

      setModalOpen(false)
      form.resetFields()
      fetchCategories()
    } catch (error) {
      message.error(editingCategory ? "Error al actualizar categoría" : "Error al crear categoría")
      console.error(error)
    }
  }

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<Category> | SorterResult<Category>[]
  ) => {
    setPagination({
      current: newPagination.current || 1,
      pageSize: newPagination.pageSize || 10,
      total: pagination.total
    })

    if (!Array.isArray(sorter) && sorter.field) {
      setSortField(sorter.field as string)
      setSortOrder(sorter.order === 'ascend' ? 'asc' : sorter.order === 'descend' ? 'desc' : 'desc')
    }
  }

  const handleSearch = (value: string) => {
    setSearchText(value)
    setPagination(prev => ({ ...prev, current: 1 }))
  }

  const columns: ColumnsType<Category> = [
    {
      title: "Nombre",
      dataIndex: "Nombre",
      key: "Nombre",
      width: "30%",
      sorter: true,
    },
    {
      title: "Descripción",
      dataIndex: "Descripcion",
      key: "Descripcion",
      width: "40%",
      render: (text) => text || "-",
    },
    {
      title: "Fecha Creación",
      dataIndex: "FechaCreacion",
      key: "FechaCreacion",
      width: "15%",
      sorter: true,
    },
    {
      title: "Acciones",
      key: "actions",
      width: "15%",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} size="small">
            Editar
          </Button>
          <Popconfirm
            title="¿Estás seguro de eliminar esta categoría?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger size="small">
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Title level={2} className="m-0">
          Categorías
        </Title>
        <Space>
          <Search
            placeholder="Buscar categorías..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} size="large">
            Nueva Categoría
          </Button>
        </Space>
      </div>

      <Table 
        columns={columns} 
        dataSource={categories} 
        loading={loading} 
        rowKey="id" 
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} categorías`,
          pageSizeOptions: ['5', '10', '20', '50']
        }}
        onChange={handleTableChange}
      />

      <Modal
        title={editingCategory ? "Editar Categoría" : "Nueva Categoría"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
          <Form.Item
            name="Nombre"
            label="Nombre"
            rules={[
              { required: true, message: "Por favor ingresa el nombre" },
              { max: 100, message: "El nombre no puede exceder 100 caracteres" },
            ]}
          >
            <Input placeholder="Ingresa el nombre de la categoría" />
          </Form.Item>

          <Form.Item
            name="Descripcion"
            label="Descripción"
            rules={[{ max: 500, message: "La descripción no puede exceder 500 caracteres" }]}
          >
            <TextArea rows={4} placeholder="Ingresa una descripción (opcional)" />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button type="primary" htmlType="submit">
                {editingCategory ? "Actualizar" : "Crear"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

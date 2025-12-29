"use client"

import { useState, useEffect } from "react"
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Typography,
  message,
  Popconfirm,
  Upload,
  Alert,
  Drawer,
} from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, DownloadOutlined, SearchOutlined, FilterOutlined } from "@ant-design/icons"
import { apiClient } from "@/lib/api-client"
import type { ColumnsType, TablePaginationConfig } from "antd/es/table"
import type { UploadFile } from "antd/es/upload"
import type { SorterResult, FilterValue } from "antd/es/table/interface"

const { Title } = Typography
const { TextArea, Search } = Input

interface Product {
  id: string
  Nombre: string
  Descripcion: string | null
  Precio: number
  Stock: number
  IdCategoria: string | null
  FechaCreacion: string
  category?: {
    CategoriaNombre: string
  }
}

interface Category {
  IdCategoria: string
  Nombre: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [csvModalOpen, setCsvModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [sortField, setSortField] = useState<string>('FechaCreacion')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [searchText, setSearchText] = useState('')
  const [searchDrawerOpen, setSearchDrawerOpen] = useState(false)
  const [searchForm] = Form.useForm()
  const [advancedFilters, setAdvancedFilters] = useState<{
    nombre?: string
    idCategoria?: string
    precioMin?: number
    precioMax?: number
  }>({})

  /*const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await apiClient.getProducts({
        page: pagination.current,
        pageSize: pagination.pageSize,
        sortField,
        sortOrder,
        search: searchText,
        ...advancedFilters
      })
      
      const ProductosWithId = response.data.map(producto => ({
        ...producto,
        id: producto.IdProducto || producto.id,
        category: producto.CategoriaNombre ? { 
          CategoriaNombre: producto.CategoriaNombre 
        } : undefined
      }))
      
      setProducts(ProductosWithId)
      setPagination(prev => ({ ...prev, total: response.total }))
    } catch (error) {
      message.error("Error al cargar productos")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }*/

    const fetchProducts = async () => {
  setLoading(true)
  try {
    const response = await apiClient.getProducts({
      page: pagination.current,   // sigue válido
      pageSize: pagination.pageSize,
      sortField,
      sortOrder,
      search: searchText,
      ...advancedFilters
    })

    const productosModificados = response.data.map(producto => ({
      ...producto,
      id: producto.IdProducto ?? producto.id,
      category: producto.CategoriaNombre 
        ? { name: producto.CategoriaNombre } 
        : undefined
    }))

    setProducts(productosModificados)

    setPagination(prev => ({
      ...prev,
      total: response.pagination.totalRecords,
      current: response.pagination.currentPage,
      pageSize: response.pagination.limit
    }))
  } catch (error) {
    message.error("Error al cargar productos")
    console.error(error)
  } finally {
    setLoading(false)
  }
}
 

  const fetchCategories = async () => {
    try {
      const response = await apiClient.getCategories()
      setCategories(response.data || [])
    } catch (error) {
      console.error("Error al cargar categorías:", error)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [pagination.current, pagination.pageSize, sortField, sortOrder, searchText, advancedFilters])

  const handleCreate = () => {
    setEditingProduct(null)
    form.resetFields()
    setModalOpen(true)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    form.setFieldsValue({
      Nombre: product.Nombre,
      Descripcion: product.Descripcion,
      Precio: product.Precio,
      Stock: product.Stock,
      IdCategoria: product.IdCategoria,
    })
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await apiClient.deleteProduct(id)
      message.success("Producto eliminado exitosamente")
      fetchProducts()
    } catch (error) {
      message.error("Error al eliminar producto")
      console.error(error)
    }
  }

  const handleSubmit = async (values: {
    Nombre: string
    Descripcion?: string
    Precio: number
    Stock: number
    IdCategoria?: string
  }) => {
    try {
      if (editingProduct) {
        console.log("Updating product ID:", editingProduct.id, "with values:", values);
        await apiClient.updateProduct(editingProduct.id, values)
        message.success("Producto actualizado exitosamente")
      } else {
        const response =  await apiClient.createProduct(values)
        console.log('Create response:', response) 
        message.success("Producto creado exitosamente")
      }

      setModalOpen(false)
      form.resetFields()
      fetchProducts()
    } catch (error) {
      message.error(editingProduct ? "Error al actualizar producto" : "Error al crear producto")
      console.error(error)
    }
  }

  const handleCSVUpload = async () => {
    if (fileList.length === 0) {
      message.error("Por favor selecciona un archivo CSV")
      return
    }

    const file = fileList[0].originFileObj
    if (!file) return

    try {
      const text = await file.text()
      const lines = text.split("\n").filter((line) => line.trim())

      if (lines.length < 2) {
        message.error("El archivo CSV debe contener al menos un encabezado y una fila de datos")
        return
      }

      const headers = lines[0].split(";").map((h) => h.trim().toLowerCase())
      console.log("Headers:", headers)

      const requiredHeaders = ["nombre", "descripcion", "precio", "stock", "idcategoria"]
      const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h))
       console.log("Missing Headers:", missingHeaders);
      if (missingHeaders.length > 0) {
        message.error(`Faltan columnas requeridas: ${missingHeaders.join(", ")}`)
        return
      }

      const products = []
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(";").map((v) => v.trim())
        const product: Record<string, unknown> = {}

        headers.forEach((header, index) => {
          const value = values[index]
          if (header === "nombre") product.Nombre = value
          else if (header === "descripcion") product.Descripcion = value || null
          else if (header === "precio") product.Precio = Number.parseFloat(value)
          else if (header === "stock") product.Stock = Number.parseInt(value)
          else if (header === "idcategoria") product.IdCategoria = value || null
        })

        if (product.Nombre && !Number.isNaN(product.Precio) && !Number.isNaN(product.Stock)) {
          products.push(product)
        }
      }

      if (products.length === 0) {
        message.error("No se encontraron productos válidos en el archivo CSV")
        return
      }
      const formData = new FormData();
      formData.append("file", file); // archivo original
      formData.append("products", JSON.stringify(products));
      await apiClient.bulkCreateProducts(formData);
      message.success(`${products.length} productos importados exitosamente`);
      setCsvModalOpen(false);
      setFileList([]);
      fetchProducts();
    } catch (error) {
      message.error("Error al importar productos desde CSV")
      console.error(error)
    }
  }

  const handleDownloadTemplate = () => {
    const csvContent = "Nombre,Descripcion,Precio,Stock,IdCategoria\nProducto Ejemplo,Descripción ejemplo,99.99,10,1\n"
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "plantilla_productos.csv"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<Product> | SorterResult<Product>[]
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

  const handleAdvancedSearch = (values: any) => {
    const filters: any = {}
    
    if (values.nombre) filters.nombre = values.nombre
    if (values.idCategoria) filters.idCategoria = values.idCategoria
    if (values.precioMin !== undefined && values.precioMin !== null) filters.precioMin = values.precioMin
    if (values.precioMax !== undefined && values.precioMax !== null) filters.precioMax = values.precioMax
    
    setAdvancedFilters(filters)
    setPagination(prev => ({ ...prev, current: 1 }))
    setSearchDrawerOpen(false)
    message.success('Filtros aplicados')
  }

  const handleClearFilters = () => {
    searchForm.resetFields()
    setAdvancedFilters({})
    setPagination(prev => ({ ...prev, current: 1 }))
    setSearchDrawerOpen(false)
    message.info('Filtros limpiados')
  }

  const columns: ColumnsType<Product> = [
    {
      title: "Nombre",
      dataIndex: "Nombre",
      key: "Nombre",
      width: "15%",
      sorter: true,
    },
    {
      title: "Descripción",
      dataIndex: "Descripcion",
      key: "Descripcion",
      width: "20%",
      render: (text) => text || "-",
    },
    {
      title: "Precio",
      dataIndex: "Precio",
      key: "Precio",
      width: "10%",
      sorter: true,
      render: (Precio) => `$${Number(Precio).toFixed(2)}`,
    },
    {
      title: "Stock",
      dataIndex: "Stock",
      key: "Stock",
      width: "8%",
      sorter: true,
    },
    {
      title: "Fecha Creación",
      dataIndex: "FechaCreacion",
      key: "FechaCreacion",
      width: "12%",
      sorter: true,
    },
    {
      title: "Estado",
      dataIndex: "Estado",
      key: "Estado",
      width: "8%",
      render: (Estado) => (Estado ? "Inactivo" : "Activo")},
    {
      title: "Categoría",
      key: "category",
      width: "12%",
      render: (_, record) => record.category?.CategoriaNombre || "-",
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
            title="¿Estás seguro de eliminar este producto?"
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
          Productos
        </Title>
        <Space>
          <Search
            placeholder="Buscar productos..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
          <Button 
            icon={<FilterOutlined />} 
            onClick={() => setSearchDrawerOpen(true)} 
            size="large"
          >
            Búsqueda Avanzada
          </Button>
          <Button icon={<UploadOutlined />} onClick={() => setCsvModalOpen(true)} size="large">
            Importar CSV
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} size="large">
            Nuevo Producto
          </Button>
        </Space>
      </div>

      <Table 
        columns={columns} 
        dataSource={products} 
        loading={loading} 
        rowKey="id" 
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} productos`,
          pageSizeOptions: ['5', '10', '20', '50', '100']
        }}
        onChange={handleTableChange}
      />

      <Modal
        title={editingProduct ? "Editar Producto" : "Nuevo Producto"}
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
            <Input placeholder="Ingresa el nombre del producto" />
          </Form.Item>

          <Form.Item
            name="Descripcion"
            label="Descripción"
            rules={[{ max: 500, message: "La descripción no puede exceder 500 caracteres" }]}
          >
            <TextArea rows={3} placeholder="Ingresa una descripción (opcional)" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="Precio"
              label="Precio"
              rules={[
                { required: true, message: "Por favor ingresa el precio" },
                { type: "number", min: 0.01, message: "El precio debe ser mayor a 0" },
              ]}
            >
              <InputNumber placeholder="0.00" className="w-full" prefix="$" min={0.01} step={0.01} />
            </Form.Item>

            <Form.Item
              name="Stock"
              label="Stock"
              rules={[
                { required: true, message: "Por favor ingresa el stock" },
                { type: "number", min: 0, message: "El stock debe ser mayor o igual a 0" },
              ]}
            >
              <InputNumber placeholder="0" className="w-full" min={0} />
            </Form.Item>
          </div>

          <Form.Item name="IdCategoria" label="Categoría">
            <Select placeholder="Selecciona una categoría (opcional)" allowClear>
              {categories.map((cat) => (
                <Select.Option key={cat.IdCategoria} value={cat.IdCategoria}>
                  {cat.Nombre}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button type="primary" htmlType="submit">
                {editingProduct ? "Actualizar" : "Crear"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Importar Productos desde CSV"
        open={csvModalOpen}
        onCancel={() => {
          setCsvModalOpen(false)
          setFileList([])
        }}
        footer={null}
        width={600}
      >
        <div className="space-y-4">
          <Alert
            message="Formato del CSV"
            description="El archivo debe contener las columnas: nombre, descripcion, precio, stock, idcategoria"
            type="info"
            showIcon
          />

          <Button icon={<DownloadOutlined />} onClick={handleDownloadTemplate} block>
            Descargar Plantilla CSV
          </Button>

          <Upload
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={() => false}
            accept=".csv"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />} block>
              Seleccionar Archivo CSV
            </Button>
          </Upload>

          <Space className="w-full justify-end">
            <Button
              onClick={() => {
                setCsvModalOpen(false)
                setFileList([])
              }}
            >
              Cancelar
            </Button>
            <Button type="primary" onClick={handleCSVUpload}>
              Importar
            </Button>
          </Space>
        </div>
      </Modal>

      <Drawer
        title="Búsqueda Avanzada"
        placement="right"
        onClose={() => setSearchDrawerOpen(false)}
        open={searchDrawerOpen}
        width={400}
      >
        <Form
          form={searchForm}
          layout="vertical"
          onFinish={handleAdvancedSearch}
        >
          <Form.Item
            name="nombre"
            label="Nombre del Producto"
          >
            <Input placeholder="Buscar por nombre..." allowClear />
          </Form.Item>

          <Form.Item
            name="idCategoria"
            label="Categoría"
          >
            <Select placeholder="Selecciona una categoría" allowClear>
              {categories.map((cat) => (
                <Select.Option key={cat.IdCategoria} value={cat.IdCategoria}>
                  {cat.Nombre}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div className="mb-4">
            <Typography.Text strong>Rango de Precio</Typography.Text>
          </div>

          <Form.Item
            name="precioMin"
            label="Precio Mínimo"
          >
            <InputNumber
              placeholder="0.00"
              className="w-full"
              prefix="$"
              min={0}
              step={0.01}
            />
          </Form.Item>

          <Form.Item
            name="precioMax"
            label="Precio Máximo"
          >
            <InputNumber
              placeholder="0.00"
              className="w-full"
              prefix="$"
              min={0}
              step={0.01}
            />
          </Form.Item>

          <Form.Item>
            <Space className="w-full justify-end">
              <Button onClick={handleClearFilters}>
                Limpiar
              </Button>
              <Button type="primary" htmlType="submit">
                Aplicar Filtros
              </Button>
            </Space>
          </Form.Item>
        </Form>

        {Object.keys(advancedFilters).length > 0 && (
          <Alert
            message="Filtros Activos"
            description={
              <div>
                {advancedFilters.nombre && <div>Nombre: {advancedFilters.nombre}</div>}
                {advancedFilters.idCategoria && (
                  <div>
                    Categoría: {categories.find(c => c.IdCategoria === advancedFilters.idCategoria)?.Nombre}
                  </div>
                )}
                {advancedFilters.precioMin !== undefined && (
                  <div>Precio Mín: ${advancedFilters.precioMin}</div>
                )}
                {advancedFilters.precioMax !== undefined && (
                  <div>Precio Máx: ${advancedFilters.precioMax}</div>
                )}
              </div>
            }
            type="info"
            showIcon
            closable
            onClose={handleClearFilters}
          />
        )}
      </Drawer>
    </div>
  )
}

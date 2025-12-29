const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3899/api"

class ApiClient {
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem("auth_token")
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        if (response.status === 401) {
          // Token inválido o expirado
          localStorage.removeItem("auth_token")
          localStorage.removeItem("user_email")
          window.location.href = "/login"
          throw new Error("Sesión expirada")
        }

        const error = await response.json().catch(() => ({ message: "Error en la petición" }))
        throw new Error(error.message || `Error: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  // Autenticación
  async login(Email: string, Password: string): Promise<{ token: string; user: { Email: string } }> {
    const data = await this.request<{ token: string; user: { Email: string } }>("/user/login", {
      method: "POST",
      body: JSON.stringify({ Email, Password }),
    })

    if (data.token) {
      localStorage.setItem("auth_token", data.token)
      localStorage.setItem("user_email", data.user.Email)
    }

    return data
  }

  async getCurrentUser(): Promise<{ email: string } | null> {
    const token = localStorage.getItem("auth_token")
    if (!token) return null

    try {
      const user = await this.request<{ email: string }>("/auth/me")
      return user
    } catch {
      return null
    }
  }

  logout() {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_email")
  }

  // Categorías
  async getCategories(params?: {
    page?: number
    pageSize?: number
    sortField?: string
    sortOrder?: 'asc' | 'desc'
    search?: string
  }): Promise<{ data: any[]; total: number }> {
    const queryParams = new URLSearchParams()
    
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
    if (params?.sortField) queryParams.append('sortField', params.sortField)
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder)
    if (params?.search) queryParams.append('search', params.search)
    
    const queryString = queryParams.toString()
    const endpoint = queryString ? `/categorias?${queryString}` : '/categorias'
    
    const response = await this.request<{status: string, data: any[], total: number}>(endpoint)
    return { data: response.data || [], total: response.total || 0 }
  }

  async createCategory(data: { name: string; description?: string }): Promise<any> {
    return this.request("/categorias", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateCategory(id: string, data: { name: string; description?: string }): Promise<any> {
    return this.request(`/categorias/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteCategory(id: string): Promise<void> {
    return this.request(`/categorias/${id}`, {
      method: "DELETE",
    })
  }

  // Productos
  async getProducts(params?: {
    page?: number
    pageSize?: number
    sortField?: string
    sortOrder?: 'asc' | 'desc'
    search?: string
    nombre?: string
    idCategoria?: string
    precioMin?: number
    precioMax?: number
  }): Promise<{ data: any[];  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }; }> {
    const queryParams = new URLSearchParams()
    
    
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
    if (params?.sortField) queryParams.append('sortField', params.sortField)
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder)
    if (params?.search) queryParams.append('search', params.search)
    if (params?.nombre) queryParams.append('nombre', params.nombre)
    if (params?.idCategoria) queryParams.append('idCategoria', params.idCategoria)
    if (params?.precioMin !== undefined) queryParams.append('precioMin', params.precioMin.toString())
    if (params?.precioMax !== undefined) queryParams.append('precioMax', params.precioMax.toString())
    
    const queryString = queryParams.toString()
    const endpoint = queryString ? `/productos?${queryString}` : '/productos'
    
    //const response = await this.request<{status: string, data: any[], total: number}>(endpoint)
    const response = await this.request<{
    status: number;
    data: any[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalRecords: number;
      limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }>(endpoint);

   // return { data: response.data || [], total: response.total || 0  }
    return {
    data: response.data ?? [],
    pagination: response.pagination
  };

  }

  async createProduct(data: {
    Nombre: string
    Descripcion?: string
    Precio: number
    Stock: number
    IdCategoria?: string
  }): Promise<any> {
     const payload = {
    Nombre: data.Nombre,
    Descripcion: data.Descripcion || null,
    Precio: data.Precio,
    Stock: data.Stock,
    IdCategoria: data.IdCategoria || null,
  }
  
  return this.request("/productos", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  
  }

  async updateProduct(
    id: string,
    data: {
      name: string
      description?: string
      price: number
      stock: number
      category_id?: string
    },
  ): Promise<any> {
    return this.request(`/productos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteProduct(id: string): Promise<void> {
    return this.request(`/productos/${id}`, {
      method: "DELETE",
    })
  }

  /*async bulkCreateProducts(formData: FormData): Promise<any> {
    return this.request("/productos/productosMasivo", {
      method: "POST",
      body: formData,
    })
  }*/
 async bulkCreateProducts(formData: FormData): Promise<any> {
  const url = `${API_BASE_URL}/productos/productosMasivo`
  
  const config: RequestInit = {
    method: "POST",
    headers: {
      // NO incluir Content-Type aquí, el navegador lo establecerá automáticamente
      ...this.getAuthHeader(),
    },
    body: formData, // Enviar FormData directamente
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("user_email")
        window.location.href = "/login"
        throw new Error("Sesión expirada")
      }

      const error = await response.json().catch(() => ({ message: "Error en la petición" }))
      throw new Error(error.message || `Error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("API Error:", error)
    throw error
  }
}
}

export const apiClient = new ApiClient()

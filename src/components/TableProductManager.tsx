
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TableColumn {
  id: string;
  name: string;
  type: "text" | "number" | "date";
  required: boolean;
}

interface CustomTable {
  id: string;
  name: string;
  description: string;
  columns: TableColumn[];
  createdAt: string;
}

interface TableProduct {
  id: string;
  tableId: string;
  data: Record<string, any>;
  createdAt: string;
}

interface TableProductManagerProps {
  table: CustomTable;
  onClose: () => void;
}

const TableProductManager = ({ table, onClose }: TableProductManagerProps) => {
  const { toast } = useToast();
  const [products, setProducts] = useState<TableProduct[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<TableProduct | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    // Simular dados iniciais baseados no tipo de tabela
    if (table.name === "Publicações CCB") {
      setProducts([
        {
          id: "1",
          tableId: table.id,
          data: { Nome: "Hinário 5", Quantidade: 45, "Data de Entrada": "2024-01-15", Localização: "Estante A-1" },
          createdAt: "2024-01-15"
        },
        {
          id: "2",
          tableId: table.id,
          data: { Nome: "Revista O Mensageiro", Quantidade: 120, "Data de Entrada": "2024-01-14", Localização: "Estante A-2" },
          createdAt: "2024-01-14"
        }
      ]);
    } else if (table.name === "Material de Escritório") {
      setProducts([
        {
          id: "1",
          tableId: table.id,
          data: { Item: "Canetas Azuis", Quantidade: 15, Fornecedor: "Bic", "Preço Unitário": 2.50 },
          createdAt: "2024-01-13"
        }
      ]);
    } else if (table.name === "Cozinha") {
      setProducts([
        {
          id: "1",
          tableId: table.id,
          data: { Nome: "Arroz", Quantidade: 10, "Data de Entrada": "2024-01-10", Localização: "Despensa A" },
          createdAt: "2024-01-10"
        },
        {
          id: "2",
          tableId: table.id,
          data: { Nome: "Feijão", Quantidade: 8, "Data de Entrada": "2024-01-12", Localização: "Despensa A" },
          createdAt: "2024-01-12"
        }
      ]);
    }
  }, [table]);

  const initializeFormData = (product?: TableProduct) => {
    const data: Record<string, any> = {};
    table.columns.forEach(column => {
      data[column.name] = product?.data[column.name] || (column.type === 'number' ? 0 : '');
    });
    setFormData(data);
  };

  const handleAddProduct = () => {
    const requiredFields = table.columns.filter(col => col.required);
    const missingFields = requiredFields.filter(field => !formData[field.name] || formData[field.name] === '');
    
    if (missingFields.length > 0) {
      toast({
        title: "Erro",
        description: `Campos obrigatórios não preenchidos: ${missingFields.map(f => f.name).join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    const newProduct: TableProduct = {
      id: Date.now().toString(),
      tableId: table.id,
      data: { ...formData },
      createdAt: new Date().toISOString().split('T')[0],
    };

    setProducts([...products, newProduct]);
    setFormData({});
    setIsAddModalOpen(false);
    
    toast({
      title: "Sucesso",
      description: "Item adicionado com sucesso!",
    });
  };

  const handleEditProduct = (product: TableProduct) => {
    const requiredFields = table.columns.filter(col => col.required);
    const missingFields = requiredFields.filter(field => !formData[field.name] || formData[field.name] === '');
    
    if (missingFields.length > 0) {
      toast({
        title: "Erro",
        description: `Campos obrigatórios não preenchidos: ${missingFields.map(f => f.name).join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    const updatedProducts = products.map(p => 
      p.id === product.id 
        ? { ...p, data: { ...formData } }
        : p
    );

    setProducts(updatedProducts);
    setEditingProduct(null);
    setFormData({});
    
    toast({
      title: "Sucesso",
      description: "Item atualizado com sucesso!",
    });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast({
      title: "Item removido",
      description: "O item foi removido com sucesso",
    });
  };

  const handleQuantityChange = (productId: string, columnName: string, change: number) => {
    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        const currentValue = product.data[columnName] || 0;
        const newValue = Math.max(0, currentValue + change);
        return {
          ...product,
          data: {
            ...product.data,
            [columnName]: newValue
          }
        };
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{table.name}</h2>
          <p className="text-gray-600">{table.description}</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gray-800 hover:bg-gray-900"
                onClick={() => initializeFormData()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Item</DialogTitle>
                <DialogDescription>
                  Preencha as informações do item para {table.name}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {table.columns.map((column) => (
                  <div key={column.id}>
                    <Label htmlFor={column.id}>
                      {column.name} {column.required && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      id={column.id}
                      type={column.type === 'number' ? 'number' : column.type === 'date' ? 'date' : 'text'}
                      value={formData[column.name] || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        [column.name]: column.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
                      })}
                      className="mt-1"
                    />
                  </div>
                ))}
                
                <div className="flex justify-end space-x-3">
                  <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="button" onClick={handleAddProduct} className="bg-gray-800 hover:bg-gray-900">
                    Adicionar Item
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={onClose}>
            Voltar
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Itens da Tabela
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {table.columns.map((column) => (
                  <TableHead key={column.id}>{column.name}</TableHead>
                ))}
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  {table.columns.map((column) => (
                    <TableCell key={column.id}>
                      {column.type === 'number' && column.name.toLowerCase().includes('quantidade') ? (
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(product.id, column.name, -1)}
                            className="w-8 h-8 p-0 text-red-600 hover:text-red-800"
                          >
                            -
                          </Button>
                          <span className="min-w-[3rem] text-center font-medium">
                            {product.data[column.name] || 0}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(product.id, column.name, 1)}
                            className="w-8 h-8 p-0 text-green-600 hover:text-green-800"
                          >
                            +
                          </Button>
                        </div>
                      ) : (
                        product.data[column.name] || '-'
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex space-x-1">
                      <Dialog open={editingProduct?.id === product.id} onOpenChange={(open) => {
                        if (open) {
                          setEditingProduct(product);
                          initializeFormData(product);
                        } else {
                          setEditingProduct(null);
                          setFormData({});
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Item</DialogTitle>
                            <DialogDescription>
                              Modifique as informações do item
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            {table.columns.map((column) => (
                              <div key={column.id}>
                                <Label htmlFor={`edit-${column.id}`}>
                                  {column.name} {column.required && <span className="text-red-500">*</span>}
                                </Label>
                                <Input
                                  id={`edit-${column.id}`}
                                  type={column.type === 'number' ? 'number' : column.type === 'date' ? 'date' : 'text'}
                                  value={formData[column.name] || ''}
                                  onChange={(e) => setFormData({
                                    ...formData,
                                    [column.name]: column.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
                                  })}
                                  className="mt-1"
                                />
                              </div>
                            ))}
                            
                            <div className="flex justify-end space-x-3">
                              <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>
                                Cancelar
                              </Button>
                              <Button type="button" onClick={() => handleEditProduct(product)} className="bg-gray-800 hover:bg-gray-900">
                                Salvar Alterações
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {products.length === 0 && (
            <div className="text-center py-8">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum item encontrado</h3>
              <p className="text-gray-600 mb-4">Comece adicionando o primeiro item da tabela</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TableProductManager;

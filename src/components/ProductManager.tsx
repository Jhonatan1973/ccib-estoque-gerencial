
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Package, Edit, Trash2, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProductEditor from "./ProductEditor";

interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  location: string;
  lastUpdated: string;
  minStock: number;
  customFields: Record<string, any>;
}

const ProductManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Hinário 5",
      category: "Publicações CCB",
      quantity: 45,
      location: "Estante A-1",
      lastUpdated: "2024-01-15",
      minStock: 20,
      customFields: { editora: "CCB", ano: "2023" }
    },
    {
      id: "2",
      name: "Revista O Mensageiro",
      category: "Publicações CCB",
      quantity: 120,
      location: "Estante A-2",
      lastUpdated: "2024-01-14",
      minStock: 50,
      customFields: { edicao: "Janeiro 2024", paginas: 32 }
    },
    {
      id: "3",
      name: "Canetas Azuis",
      category: "Material de Escritório",
      quantity: 15,
      location: "Gaveta B-1",
      lastUpdated: "2024-01-13",
      minStock: 25,
      customFields: { marca: "Bic", cor: "Azul" }
    },
    {
      id: "4",
      name: "Folhetos Evangelísticos",
      category: "Publicações CCB",
      quantity: 200,
      location: "Estante C-1",
      lastUpdated: "2024-01-12",
      minStock: 100,
      customFields: { tema: "Salvação", tiragem: "500" }
    }
  ]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    quantity: 0,
    location: "",
    minStock: 0,
  });

  const categories = [...new Set(products.map(p => p.category))];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addProduct = () => {
    if (!newProduct.name.trim() || !newProduct.category.trim()) {
      toast({
        title: "Erro",
        description: "Nome e categoria são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const product: Product = {
      id: Date.now().toString(),
      ...newProduct,
      lastUpdated: new Date().toISOString().split('T')[0],
      customFields: {},
    };

    setProducts([...products, product]);
    setIsAddModalOpen(false);
    setNewProduct({
      name: "",
      category: "",
      quantity: 0,
      location: "",
      minStock: 0,
    });

    toast({
      title: "Sucesso",
      description: "Produto adicionado com sucesso!",
    });
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast({
      title: "Produto removido",
      description: "O produto foi removido com sucesso",
    });
  };

  const getLowStockBadge = (product: Product) => {
    if (product.quantity <= product.minStock) {
      return <Badge variant="destructive" className="ml-2">Estoque Baixo</Badge>;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gerenciar Produtos</h2>
          <p className="text-gray-600">Adicione e gerencie produtos do seu estoque</p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gray-800 hover:bg-gray-900">
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Produto</DialogTitle>
              <DialogDescription>
                Preencha as informações do produto
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="productName">Nome do Produto</Label>
                <Input
                  id="productName"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="Ex: Hinário 4"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="productCategory">Categoria</Label>
                <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Publicações CCB">Publicações CCB</SelectItem>
                    <SelectItem value="Material de Escritório">Material de Escritório</SelectItem>
                    <SelectItem value="Cozinha">Cozinha</SelectItem>
                    <SelectItem value="Instrumentos">Instrumentos</SelectItem>
                    <SelectItem value="Limpeza">Material de Limpeza</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({...newProduct, quantity: parseInt(e.target.value) || 0})}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="minStock">Estoque Mínimo</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={newProduct.minStock}
                    onChange={(e) => setNewProduct({...newProduct, minStock: parseInt(e.target.value) || 0})}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={newProduct.location}
                  onChange={(e) => setNewProduct({...newProduct, location: e.target.value})}
                  placeholder="Ex: Estante A-1"
                  className="mt-1"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="button" onClick={addProduct} className="bg-gray-800 hover:bg-gray-900">
                  Adicionar Produto
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg text-gray-900 flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    {product.name}
                    {getLowStockBadge(product)}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {product.category}
                  </CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-600 hover:text-gray-900"
                    onClick={() => setEditingProduct(product)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-800"
                    onClick={() => deleteProduct(product.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Quantidade</p>
                    <p className="font-semibold text-lg">{product.quantity}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Estoque Mín.</p>
                    <p className="font-semibold text-lg">{product.minStock}</p>
                  </div>
                </div>
                
                {product.location && (
                  <div>
                    <p className="text-gray-600 text-sm">Localização</p>
                    <p className="font-medium">{product.location}</p>
                  </div>
                )}
                
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Atualizado em {new Date(product.lastUpdated).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-8 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory !== "all" 
                ? "Tente ajustar os filtros de busca"
                : "Comece adicionando seu primeiro produto"
              }
            </p>
            {!searchTerm && selectedCategory === "all" && (
              <Button onClick={() => setIsAddModalOpen(true)} className="bg-gray-800 hover:bg-gray-900">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Produto
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Product Editor Modal */}
      {editingProduct && (
        <ProductEditor
          product={editingProduct}
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdate={updateProduct}
        />
      )}
    </div>
  );
};

export default ProductManager;

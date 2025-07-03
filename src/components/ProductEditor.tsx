
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

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

interface ProductEditorProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedProduct: Product) => void;
}

const ProductEditor = ({ product, isOpen, onClose, onUpdate }: ProductEditorProps) => {
  const { toast } = useToast();
  const [editedProduct, setEditedProduct] = useState<Product>(product);

  const handleSave = () => {
    if (!editedProduct.name.trim() || !editedProduct.category.trim()) {
      toast({
        title: "Erro",
        description: "Nome e categoria são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const updatedProduct = {
      ...editedProduct,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    onUpdate(updatedProduct);
    onClose();
    
    toast({
      title: "Sucesso",
      description: "Produto atualizado com sucesso!",
    });
  };

  const handleQuantityChange = (type: 'add' | 'remove', amount: number) => {
    const newQuantity = type === 'add' 
      ? editedProduct.quantity + amount 
      : Math.max(0, editedProduct.quantity - amount);
    
    setEditedProduct({
      ...editedProduct,
      quantity: newQuantity
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm sm:max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Atualizar Produto</DialogTitle>
          <DialogDescription className="text-sm">
            Modifique as informações do produto
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="productName" className="text-sm">Nome do Produto</Label>
            <Input
              id="productName"
              value={editedProduct.name}
              onChange={(e) => setEditedProduct({...editedProduct, name: e.target.value})}
              className="mt-1 text-sm"
            />
          </div>
          
          <div>
            <Label htmlFor="productCategory" className="text-sm">Categoria</Label>
            <Select value={editedProduct.category} onValueChange={(value) => setEditedProduct({...editedProduct, category: value})}>
              <SelectTrigger className="mt-1">
                <SelectValue />
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
          
          <div>
            <Label className="text-sm">Quantidade Atual: {editedProduct.quantity}</Label>
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange('remove', 1)}
                className="text-red-600 hover:text-red-800 text-xs"
              >
                -1
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange('remove', 5)}
                className="text-red-600 hover:text-red-800 text-xs"
              >
                -5
              </Button>
              <Input
                type="number"
                value={editedProduct.quantity}
                onChange={(e) => setEditedProduct({...editedProduct, quantity: parseInt(e.target.value) || 0})}
                className="col-span-2 sm:col-span-1 sm:w-16 text-center text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange('add', 5)}
                className="text-green-600 hover:text-green-800 text-xs"
              >
                +5
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange('add', 1)}
                className="text-green-600 hover:text-green-800 text-xs"
              >
                +1
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minStock" className="text-sm">Estoque Mínimo</Label>
              <Input
                id="minStock"
                type="number"
                value={editedProduct.minStock}
                onChange={(e) => setEditedProduct({...editedProduct, minStock: parseInt(e.target.value) || 0})}
                className="mt-1 text-sm"
              />
            </div>
            
            <div>
              <Label htmlFor="location" className="text-sm">Localização</Label>
              <Input
                id="location"
                value={editedProduct.location}
                onChange={(e) => setEditedProduct({...editedProduct, location: e.target.value})}
                className="mt-1 text-sm"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="text-sm">
              Cancelar
            </Button>
            <Button type="button" onClick={handleSave} className="bg-gray-800 hover:bg-gray-900 text-sm">
              Salvar Alterações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditor;

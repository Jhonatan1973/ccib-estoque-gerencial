import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Table, Edit, Trash2, Columns, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TableProductManager from "./TableProductManager";

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

const TableManager = () => {
  const { toast } = useToast();
  const [tables, setTables] = useState<CustomTable[]>([
    {
      id: "1",
      name: "Publicações CCB",
      description: "Controle de hinários, revistas e folhetos",
      columns: [
        { id: "1", name: "Nome", type: "text", required: true },
        { id: "2", name: "Quantidade", type: "number", required: true },
        { id: "3", name: "Data de Entrada", type: "date", required: false },
        { id: "4", name: "Localização", type: "text", required: false },
      ],
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Material de Escritório",
      description: "Canetas, papéis e outros materiais",
      columns: [
        { id: "1", name: "Item", type: "text", required: true },
        { id: "2", name: "Quantidade", type: "number", required: true },
        { id: "3", name: "Fornecedor", type: "text", required: false },
        { id: "4", name: "Preço Unitário", type: "number", required: false },
      ],
      createdAt: "2024-01-10",
    },
    {
      id: "3",
      name: "Cozinha",
      description: "Controle de alimentos e utensílios",
      columns: [
        { id: "1", name: "Nome", type: "text", required: true },
        { id: "2", name: "Quantidade", type: "number", required: true },
        { id: "3", name: "Data de Entrada", type: "date", required: false },
        { id: "4", name: "Localização", type: "text", required: false },
      ],
      createdAt: "2024-01-08",
    },
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<CustomTable | null>(null);
  const [newTableName, setNewTableName] = useState("");
  const [newTableDescription, setNewTableDescription] = useState("");
  const [newColumns, setNewColumns] = useState<TableColumn[]>([
    { id: "1", name: "Nome", type: "text", required: true },
    { id: "2", name: "Quantidade", type: "number", required: true },
  ]);

  if (selectedTable) {
    return (
      <TableProductManager 
        table={selectedTable} 
        onClose={() => setSelectedTable(null)} 
      />
    );
  }

  const addColumn = () => {
    const newColumn: TableColumn = {
      id: Date.now().toString(),
      name: "",
      type: "text",
      required: false,
    };
    setNewColumns([...newColumns, newColumn]);
  };

  const updateColumn = (id: string, field: keyof TableColumn, value: any) => {
    setNewColumns(newColumns.map(col => 
      col.id === id ? { ...col, [field]: value } : col
    ));
  };

  const removeColumn = (id: string) => {
    if (newColumns.length > 2) {
      setNewColumns(newColumns.filter(col => col.id !== id));
    }
  };

  const createTable = () => {
    if (!newTableName.trim()) {
      toast({
        title: "Erro",
        description: "Nome da tabela é obrigatório",
        variant: "destructive",
      });
      return;
    }

    const validColumns = newColumns.filter(col => col.name.trim() !== "");
    if (validColumns.length === 0) {
      toast({
        title: "Erro",
        description: "Pelo menos uma coluna deve ser definida",
        variant: "destructive",
      });
      return;
    }

    const newTable: CustomTable = {
      id: Date.now().toString(),
      name: newTableName,
      description: newTableDescription,
      columns: validColumns,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTables([...tables, newTable]);
    setIsCreateModalOpen(false);
    setNewTableName("");
    setNewTableDescription("");
    setNewColumns([
      { id: "1", name: "Nome", type: "text", required: true },
      { id: "2", name: "Quantidade", type: "number", required: true },
    ]);

    toast({
      title: "Sucesso",
      description: "Tabela criada com sucesso!",
    });
  };

  const deleteTable = (id: string) => {
    setTables(tables.filter(table => table.id !== id));
    toast({
      title: "Tabela removida",
      description: "A tabela foi removida com sucesso",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gerenciar Tabelas</h2>
          <p className="text-gray-600">Crie e gerencie tabelas personalizadas para seu estoque</p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gray-800 hover:bg-gray-900">
              <Plus className="w-4 h-4 mr-2" />
              Nova Tabela
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Nova Tabela</DialogTitle>
              <DialogDescription>
                Configure uma nova tabela para organizar seus produtos
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tableName">Nome da Tabela</Label>
                  <Input
                    id="tableName"
                    value={newTableName}
                    onChange={(e) => setNewTableName(e.target.value)}
                    placeholder="Ex: Instrumentos Musicais"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tableDescription">Descrição (Opcional)</Label>
                  <Input
                    id="tableDescription"
                    value={newTableDescription}
                    onChange={(e) => setNewTableDescription(e.target.value)}
                    placeholder="Breve descrição da tabela"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Colunas da Tabela</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addColumn}>
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar Coluna
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {newColumns.map((column, index) => (
                    <div key={column.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <Input
                          value={column.name}
                          onChange={(e) => updateColumn(column.id, "name", e.target.value)}
                          placeholder="Nome da coluna"
                          className="bg-white"
                        />
                      </div>
                      <select
                        value={column.type}
                        onChange={(e) => updateColumn(column.id, "type", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md bg-white"
                      >
                        <option value="text">Texto</option>
                        <option value="number">Número</option>
                        <option value="date">Data</option>
                      </select>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={column.required}
                          onChange={(e) => updateColumn(column.id, "required", e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Obrigatório</span>
                      </label>
                      {newColumns.length > 2 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeColumn(column.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="button" onClick={createTable} className="bg-gray-800 hover:bg-gray-900">
                  Criar Tabela
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => (
          <Card key={table.id} className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-gray-900 flex items-center">
                    <Table className="w-5 h-5 mr-2" />
                    {table.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {table.description || "Sem descrição"}
                  </CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTable(table.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent onClick={() => setSelectedTable(table)}>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Columns className="w-4 h-4 mr-2" />
                  {table.columns.length} colunas configuradas
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {table.columns.slice(0, 4).map((column) => (
                    <Badge key={column.id} variant="secondary" className="text-xs">
                      {column.name}
                    </Badge>
                  ))}
                  {table.columns.length > 4 && (
                    <Badge variant="secondary" className="text-xs">
                      +{table.columns.length - 4} mais
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Criada em {new Date(table.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-600 hover:text-gray-900"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTable(table);
                    }}
                  >
                    <Package className="w-4 h-4 mr-1" />
                    Gerenciar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TableManager;

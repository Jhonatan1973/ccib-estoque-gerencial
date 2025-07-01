
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle, TrendingUp, Calendar } from "lucide-react";

const StockOverview = () => {
  const stockData = [
    { name: "Produtos Cadastrados", value: 150, icon: Package, color: "bg-blue-500" },
    { name: "Estoque Baixo", value: 12, icon: AlertTriangle, color: "bg-red-500" },
    { name: "Movimentações Hoje", value: 35, icon: TrendingUp, color: "bg-green-500" },
    { name: "Última Atualização", value: "Agora", icon: Calendar, color: "bg-gray-500" },
  ];

  const recentMovements = [
    { product: "Hinário 5", action: "Entrada", quantity: 50, date: "Hoje às 14:30" },
    { product: "Revista Mensageiro", action: "Saída", quantity: 20, date: "Hoje às 13:15" },
    { product: "Folhetos", action: "Entrada", quantity: 100, date: "Hoje às 10:45" },
    { product: "CD Hinos CCB", action: "Saída", quantity: 15, date: "Ontem às 16:20" },
  ];

  const lowStockItems = [
    { name: "Hinário 4", current: 5, minimum: 20, category: "Publicações" },
    { name: "Envelopes Oferta", current: 8, minimum: 50, category: "Material" },
    { name: "Canetas", current: 3, minimum: 25, category: "Escritório" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stockData.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={index} className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${item.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{item.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Movements */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-gray-900">Movimentações Recentes</CardTitle>
            <CardDescription>Últimas entradas e saídas do estoque</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMovements.map((movement, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{movement.product}</p>
                    <p className="text-sm text-gray-500">{movement.date}</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={movement.action === "Entrada" ? "default" : "secondary"}
                      className={movement.action === "Entrada" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {movement.action} ({movement.quantity})
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
              Estoque Baixo
            </CardTitle>
            <CardDescription>Itens que precisam de reposição</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">
                      {item.current} / {item.minimum}
                    </p>
                    <p className="text-xs text-red-500">Estoque mínimo</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StockOverview;

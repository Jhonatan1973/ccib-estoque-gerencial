
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, Plus, Package, Table, BarChart3, Settings } from "lucide-react";
import TableManager from "./TableManager";
import ProductManager from "./ProductManager";
import StockOverview from "./StockOverview";

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  const navigationItems = [
    { id: "overview", label: "Visão Geral", icon: BarChart3 },
    { id: "tables", label: "Gerenciar Tabelas", icon: Table },
    { id: "products", label: "Produtos", icon: Package },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Package className="w-8 h-8 text-gray-700" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Sistema de Estoque</h1>
                  <p className="text-sm text-gray-500">Congregação Cristã no Brasil</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="border-gray-200 hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === "overview" && <StockOverview />}
          {activeTab === "tables" && <TableManager />}
          {activeTab === "products" && <ProductManager />}
          {activeTab === "settings" && (
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
                <CardDescription>
                  Personalize as configurações do seu sistema de estoque
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Configurações em desenvolvimento...</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

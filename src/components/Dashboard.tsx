
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, Plus, Package, Table, BarChart3, Settings, Menu } from "lucide-react";
import TableManager from "./TableManager";
import ProductManager from "./ProductManager";
import StockOverview from "./StockOverview";

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700" />
                <div className="hidden sm:block">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900">Sistema de Estoque</h1>
                  <p className="text-xs sm:text-sm text-gray-500">Congregação Cristã no Brasil</p>
                </div>
                <div className="sm:hidden">
                  <h1 className="text-lg font-bold text-gray-900">Estoque CCB</h1>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="border-gray-200 hover:bg-gray-50 text-xs sm:text-sm"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Mobile Navigation Toggle */}
        <div className="sm:hidden mb-4">
          <Button
            variant="outline"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full justify-start"
          >
            <Menu className="w-4 h-4 mr-2" />
            Menu de Navegação
          </Button>
        </div>

        {/* Navigation */}
        <div className="mb-6 sm:mb-8">
          <nav className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:block`}>
            <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-2 rounded-md text-sm font-medium transition-colors w-full sm:w-auto ${
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
            </div>
          </nav>
        </div>

        {/* Content */}
        <div className="space-y-4 sm:space-y-6">
          {activeTab === "overview" && <StockOverview />}
          {activeTab === "tables" && <TableManager />}
          {activeTab === "products" && <ProductManager />}
          {activeTab === "settings" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Configurações do Sistema</CardTitle>
                <CardDescription className="text-sm">
                  Personalize as configurações do seu sistema de estoque
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm sm:text-base">Configurações em desenvolvimento...</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

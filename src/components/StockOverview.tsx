
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle, TrendingUp, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const StockOverview = () => {
  const { userProfile } = useAuth();

  // Buscar estatísticas reais do banco
  const { data: stats } = useQuery({
    queryKey: ['stock-stats', userProfile?.setor_id],
    queryFn: async () => {
      if (!userProfile?.setor_id) return null;

      try {
        // Contar tabelas
        const { count: tablesCount } = await supabase
          .from('custom_tables')
          .select('*', { count: 'exact', head: true })
          .eq('setor_id', userProfile.setor_id);

        // Contar produtos
        const { count: productsCount } = await supabase
          .from('table_products')
          .select('*', { count: 'exact', head: true })
          .eq('setor_id', userProfile.setor_id);

        return {
          tables: tablesCount || 0,
          products: productsCount || 0,
          movements: 0, // Implementar quando tiver sistema de movimentação
          lastUpdate: new Date().toLocaleString('pt-BR')
        };
      } catch (error) {
        console.error('Error fetching stats:', error);
        return { tables: 0, products: 0, movements: 0, lastUpdate: 'Nunca' };
      }
    },
    enabled: !!userProfile?.setor_id
  });

  const stockData = [
    { name: "Tabelas Criadas", value: stats?.tables || 0, icon: Package, color: "bg-blue-500" },
    { name: "Produtos Cadastrados", value: stats?.products || 0, icon: AlertTriangle, color: "bg-green-500" },
    { name: "Movimentações", value: stats?.movements || 0, icon: TrendingUp, color: "bg-purple-500" },
    { name: "Última Atualização", value: stats?.lastUpdate || "Nunca", icon: Calendar, color: "bg-gray-500" },
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
        {/* Status */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-gray-900">Status do Sistema</CardTitle>
            <CardDescription>Informações sobre seu setor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Setor Ativo</p>
                  <p className="text-sm text-gray-500">{userProfile?.setores?.nome || 'Não definido'}</p>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  Ativo
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Permissão</p>
                  <p className="text-sm text-gray-500">{userProfile?.user_roles?.[0]?.role || 'user'}</p>
                </div>
                <Badge variant="secondary">
                  {userProfile?.user_roles?.[0]?.role || 'user'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instruções */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-gray-900">Primeiros Passos</CardTitle>
            <CardDescription>Configure seu sistema de estoque</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                <p className="font-medium text-gray-900 mb-2">1. Criar Tabelas</p>
                <p className="text-sm text-gray-600">
                  Vá em "Gerenciar Tabelas" para criar suas primeiras tabelas de produtos.
                </p>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                <p className="font-medium text-gray-900 mb-2">2. Adicionar Produtos</p>
                <p className="text-sm text-gray-600">
                  Depois, use "Produtos" para cadastrar itens em suas tabelas.
                </p>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="font-medium text-gray-900 mb-2">3. Configurar Setor</p>
                <p className="text-sm text-gray-600">
                  Configure seu setor em "Configurações" para personalizar o sistema.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StockOverview;

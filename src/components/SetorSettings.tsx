
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Settings, Save, Building, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const SetorSettings = () => {
  const { userProfile } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [setorName, setSetorName] = useState("");
  const [setorDescription, setSetorDescription] = useState("");

  // Buscar dados do setor atual
  const { data: setor } = useQuery({
    queryKey: ['setor', userProfile?.setor_id],
    queryFn: async () => {
      if (!userProfile?.setor_id) return null;
      
      try {
        const { data, error } = await supabase
          .from('setores')
          .select('*')
          .eq('id', userProfile.setor_id)
          .single();
        
        if (error) throw error;
        
        // Definir valores iniciais
        setSetorName(data.nome || '');
        setSetorDescription(data.descricao || '');
        
        return data;
      } catch (error) {
        console.error('Error fetching setor:', error);
        return null;
      }
    },
    enabled: !!userProfile?.setor_id
  });

  // Buscar estatísticas do setor
  const { data: setorStats } = useQuery({
    queryKey: ['setor-stats', userProfile?.setor_id],
    queryFn: async () => {
      if (!userProfile?.setor_id) return null;

      try {
        const { count: tablesCount } = await supabase
          .from('custom_tables')
          .select('*', { count: 'exact', head: true })
          .eq('setor_id', userProfile.setor_id);

        const { count: productsCount } = await supabase
          .from('table_products')
          .select('*', { count: 'exact', head: true })
          .eq('setor_id', userProfile.setor_id);

        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('setor_id', userProfile.setor_id);

        return {
          tables: tablesCount || 0,
          products: productsCount || 0,
          users: usersCount || 0
        };
      } catch (error) {
        console.error('Error fetching setor stats:', error);
        return { tables: 0, products: 0, users: 0 };
      }
    },
    enabled: !!userProfile?.setor_id
  });

  // Mutation para atualizar setor
  const updateSetorMutation = useMutation({
    mutationFn: async ({ name, description }: { name: string; description: string }) => {
      if (!userProfile?.setor_id) throw new Error('Setor não encontrado');

      const { error } = await supabase
        .from('setores')
        .update({
          nome: name,
          descricao: description,
          updated_at: new Date().toISOString()
        })
        .eq('id', userProfile.setor_id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Setor atualizado!",
        description: "As configurações do setor foram salvas com sucesso."
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['setor'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleSave = () => {
    if (!setorName.trim()) {
      toast({
        title: "Erro",
        description: "O nome do setor é obrigatório",
        variant: "destructive"
      });
      return;
    }

    updateSetorMutation.mutate({
      name: setorName.trim(),
      description: setorDescription.trim()
    });
  };

  const handleCancel = () => {
    setSetorName(setor?.nome || '');
    setSetorDescription(setor?.descricao || '');
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Informações do Setor */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-lg sm:text-xl">
            <Building className="w-5 h-5 mr-2" />
            Configurações do Setor
          </CardTitle>
          <CardDescription className="text-sm">
            Gerencie as informações e configurações do seu setor
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="setorName">Nome do Setor</Label>
                {isEditing ? (
                  <Input
                    id="setorName"
                    value={setorName}
                    onChange={(e) => setSetorName(e.target.value)}
                    placeholder="Digite o nome do setor"
                  />
                ) : (
                  <p className="text-sm p-2 bg-gray-50 rounded-md">
                    {setor?.nome || 'Não definido'}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="setorDescription">Descrição</Label>
                {isEditing ? (
                  <Textarea
                    id="setorDescription"
                    value={setorDescription}
                    onChange={(e) => setSetorDescription(e.target.value)}
                    placeholder="Digite uma descrição para o setor"
                    rows={3}
                  />
                ) : (
                  <p className="text-sm p-2 bg-gray-50 rounded-md min-h-[80px]">
                    {setor?.descricao || 'Nenhuma descrição cadastrada'}
                  </p>
                )}
              </div>

              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <Button 
                      onClick={handleSave}
                      disabled={updateSetorMutation.isPending}
                      className="flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {updateSetorMutation.isPending ? 'Salvando...' : 'Salvar'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleCancel}
                      disabled={updateSetorMutation.isPending}
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Estatísticas do Setor</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Tabelas Criadas</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {setorStats?.tables || 0}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Produtos Cadastrados</span>
                  <Badge className="bg-green-100 text-green-800">
                    {setorStats?.products || 0}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Usuários Vinculados</span>
                  <Badge className="bg-purple-100 text-purple-800">
                    {setorStats?.users || 0}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações do Usuário */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-lg sm:text-xl">
            <User className="w-5 h-5 mr-2" />
            Suas Informações
          </CardTitle>
          <CardDescription className="text-sm">
            Informações sobre sua conta e permissões
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Nome</p>
              <p className="text-sm text-gray-900">{userProfile?.nome || 'Não definido'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-700">Email</p>
              <p className="text-sm text-gray-900">{userProfile?.email || 'Não definido'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-700">Setor</p>
              <p className="text-sm text-gray-900">{userProfile?.setores?.nome || 'Não definido'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-700">Permissão</p>
              <Badge variant="secondary" className="text-xs">
                {userProfile?.user_roles?.[0]?.role || 'user'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetorSettings;

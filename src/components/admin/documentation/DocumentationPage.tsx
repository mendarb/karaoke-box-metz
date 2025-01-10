import { DashboardLayout } from "../dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { DeveloperDocs } from "./sections/DeveloperDocs";
import { AdminDocs } from "./sections/AdminDocs";
import { UserDocs } from "./sections/UserDocs";
import { BookOpen, Settings, Users } from "lucide-react";

export const DocumentationPage = () => {
  const isMobile = useIsMobile();
  
  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-[1200px]">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Documentation</h1>
          <p className="text-gray-600">Guides complets pour l'utilisation de la plateforme</p>
        </div>
        
        <Tabs defaultValue="admin" className="space-y-6">
          <TabsList className={`bg-gray-100/80 p-1 ${isMobile ? 'flex flex-col w-full gap-2' : ''}`}>
            <TabsTrigger 
              value="admin" 
              className={`${isMobile ? 'w-full' : ''} gap-2 data-[state=active]:bg-white`}
            >
              <Settings className="w-4 h-4" />
              Guide Administrateur
            </TabsTrigger>
            <TabsTrigger 
              value="dev" 
              className={`${isMobile ? 'w-full' : ''} gap-2 data-[state=active]:bg-white`}
            >
              <BookOpen className="w-4 h-4" />
              Guide Développeur
            </TabsTrigger>
            <TabsTrigger 
              value="user" 
              className={`${isMobile ? 'w-full' : ''} gap-2 data-[state=active]:bg-white`}
            >
              <Users className="w-4 h-4" />
              Guide Utilisateur
            </TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="pr-6">
              <TabsContent value="dev" className="mt-0">
                <DeveloperDocs />
              </TabsContent>
              
              <TabsContent value="admin" className="mt-0">
                <AdminDocs />
              </TabsContent>
              
              <TabsContent value="user" className="mt-0">
                <UserDocs />
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};
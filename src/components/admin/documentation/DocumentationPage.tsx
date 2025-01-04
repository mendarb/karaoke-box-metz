import { DashboardLayout } from "../DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { DeveloperDocs } from "./sections/DeveloperDocs";
import { AdminDocs } from "./sections/AdminDocs";
import { UserDocs } from "./sections/UserDocs";

export const DocumentationPage = () => {
  const isMobile = useIsMobile();
  
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Documentation</h1>
        
        <Tabs defaultValue="admin" className="space-y-4">
          <TabsList className={`${isMobile ? 'flex flex-col w-full gap-2' : ''}`}>
            <TabsTrigger value="admin" className={isMobile ? 'w-full' : ''}>
              Guide Administrateur
            </TabsTrigger>
            <TabsTrigger value="dev" className={isMobile ? 'w-full' : ''}>
              Guide Développeur
            </TabsTrigger>
            <TabsTrigger value="user" className={isMobile ? 'w-full' : ''}>
              Guide Utilisateur
            </TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[calc(100vh-200px)]">
            <TabsContent value="dev" className="space-y-4 pb-6">
              <DeveloperDocs />
            </TabsContent>
            
            <TabsContent value="admin" className="space-y-4 pb-6">
              <AdminDocs />
            </TabsContent>
            
            <TabsContent value="user" className="space-y-4 pb-6">
              <UserDocs />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};
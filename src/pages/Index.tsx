import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import IntelligentGeneration from "@/components/IntelligentGeneration";
import AnswerStatistics from "@/components/AnswerStatistics";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const view = searchParams.get('view') || 'intelligent-generation';
  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  // Show nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  // 渲染主内容
  const renderMainContent = () => {
    switch (view) {
      case 'statistics':
        return (
          <div className="min-h-screen bg-background">
            <AnswerStatistics />
          </div>
        );
      default:
        return (
          <div className="min-h-screen bg-background">
            <IntelligentGeneration />
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          {renderMainContent()}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;

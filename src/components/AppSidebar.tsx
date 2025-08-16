import { Home, FileText, Heart, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import teacherLogo from "@/assets/teacher-logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AppSidebarProps {
  activeView: 'home' | 'quiz-list' | 'favorites' | 'login';
  onViewChange: (view: 'home' | 'quiz-list' | 'favorites' | 'login') => void;
}

export function AppSidebar({ activeView, onViewChange }: AppSidebarProps) {
  const { user, logout, isAuthenticated } = useAuth();

  const menuItems = [
    { 
      id: 'home' as const, 
      title: '主页', 
      icon: Home,
    },
    { 
      id: 'quiz-list' as const, 
      title: '试卷管理', 
      icon: FileText,
    },
    { 
      id: 'favorites' as const, 
      title: '我的收藏', 
      icon: Heart,
    },
  ];

  const handleMenuClick = (viewId: 'home' | 'quiz-list' | 'favorites') => {
    if (!isAuthenticated) {
      onViewChange('login');
    } else {
      onViewChange(viewId);
    }
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
      onViewChange('login');
    } else {
      onViewChange('login');
    }
  };

  return (
    <Sidebar className="w-64">
      {/* Header with Logo */}
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <img src={teacherLogo} alt="小班题库" className="w-10 h-10" />
          <div>
            <h1 className="text-xl font-bold text-foreground">小班题库</h1>
            <p className="text-xs text-muted-foreground">内部题目管理系统</p>
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation Menu */}
      <SidebarContent className="px-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => handleMenuClick(item.id)}
                isActive={activeView === item.id}
                className="w-full justify-start gap-3 py-3"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer with Auth */}
      <SidebarFooter className="p-4 border-t">
        {isAuthenticated && user ? (
          <div className="space-y-3">
            {/* User Info */}
            <div className="flex items-center gap-3 px-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs">
                  {user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.email.split('@')[0]}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user.role === 'teacher' ? '老师' : '学生'}
                </p>
              </div>
            </div>
            
            {/* Logout Button */}
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={handleAuthAction}
            >
              <LogOut className="w-4 h-4" />
              退出登录
            </Button>
          </div>
        ) : (
          <Button
            className="w-full gap-2"
            onClick={handleAuthAction}
          >
            <LogIn className="w-4 h-4" />
            登录
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
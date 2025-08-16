import { Brain, FileText, Heart, BarChart3, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import teacherLogo from "@/assets/teacher-logo.png";
import WelcomeMessage from "@/components/WelcomeMessage";
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
  className?: string;
}

export function AppSidebar({ className }: AppSidebarProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { 
      id: 'intelligent-generation' as const, 
      title: '智能出题', 
      icon: Brain,
      path: '/',
    },
    { 
      id: 'statistics' as const, 
      title: '答题统计', 
      icon: BarChart3,
      path: '/?view=statistics',
    },
    { 
      id: 'quiz-list' as const, 
      title: '试卷管理', 
      icon: FileText,
      path: '/quiz-list',
    },
    { 
      id: 'favorites' as const, 
      title: '我的收藏', 
      icon: Heart,
      path: '/favorites',
    },
  ];

  const handleMenuClick = (item: typeof menuItems[0]) => {
    if (!isAuthenticated) {
      navigate('/auth');
    } else {
      navigate(item.path);
    }
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
      navigate('/auth');
    } else {
      navigate('/auth');
    }
  };

  const isActiveRoute = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' && !location.search.includes('view=statistics');
    }
    if (path === '/?view=statistics') {
      return location.pathname === '/' && location.search.includes('view=statistics');
    }
    return location.pathname === path;
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
                onClick={() => handleMenuClick(item)}
                isActive={isActiveRoute(item.path)}
                className="w-full justify-start gap-3 py-3"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer with Auth - Only show when authenticated */}
      {isAuthenticated && user && (
        <SidebarFooter className="p-4 border-t space-y-4">
          {/* Welcome Message */}
          <div className="px-2">
            <WelcomeMessage />
          </div>
          
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
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
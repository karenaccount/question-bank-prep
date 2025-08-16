import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { BookOpen, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import teacherLogo from "@/assets/teacher-logo.png";

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={teacherLogo} alt="TeachMate" className="w-10 h-10" />
          <div>
            <h1 className="text-xl font-bold text-foreground">TeachMate 备课助手</h1>
            <p className="text-sm text-muted-foreground">智能题库管理系统</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Button variant="ghost" className="gap-2">
            <BookOpen className="w-4 h-4" />
            题库管理
          </Button>
          <Button variant="ghost" className="gap-2">
            <User className="w-4 h-4" />
            学生管理
          </Button>
          <Button variant="ghost" className="gap-2">
            <Settings className="w-4 h-4" />
            系统设置
          </Button>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <LogOut className="w-4 h-4" />
                  退出登录
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确认退出登录</AlertDialogTitle>
                  <AlertDialogDescription>
                    确定要退出登录吗？退出后需要重新登录才能使用系统功能。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction onClick={logout}>确认退出</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/auth'}>登录</Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
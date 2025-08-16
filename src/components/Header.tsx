import { Button } from "@/components/ui/button";
import { BookOpen, User, Settings } from "lucide-react";
import teacherLogo from "@/assets/teacher-logo.png";

const Header = () => {
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
          <Button variant="outline" size="sm">登录</Button>
          <Button variant="default" size="sm">注册</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
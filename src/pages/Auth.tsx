import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import teacherLogo from '@/assets/teacher-logo.png';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('teacher');
  const [rememberPassword, setRememberPassword] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "登录失败",
        description: "请输入邮箱和密码",
      });
      return;
    }

    try {
      await login(email, password, selectedRole);
      toast({
        title: "登录成功",
        description: `欢迎您，${selectedRole === 'teacher' ? '老师' : '同学'}！`,
      });
      navigate('/');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "登录失败",
        description: "邮箱或密码错误，请重试",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Introduction */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img src={teacherLogo} alt="小班题库" className="w-16 h-16" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">小班题库</h1>
            <p className="text-muted-foreground">您的题目管理助手</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>登录账户</CardTitle>
            <CardDescription>
              选择您的身份并输入登录信息
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label>选择身份</Label>
                <div className="flex gap-3">
                  <Badge
                    variant={selectedRole === 'teacher' ? 'default' : 'outline'}
                    className="cursor-pointer px-4 py-2"
                    onClick={() => setSelectedRole('teacher')}
                  >
                    老师
                  </Badge>
                  <Badge
                    variant={selectedRole === 'student' ? 'default' : 'outline'}
                    className="cursor-pointer px-4 py-2"
                    onClick={() => setSelectedRole('student')}
                  >
                    学生
                  </Badge>
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="请输入邮箱"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Remember Password */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberPassword}
                  onChange={(e) => setRememberPassword(e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="remember" className="text-sm">
                  记住密码
                </Label>
              </div>

              {/* Login Button */}
              <Button type="submit" className="w-full">
                登录
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Button variant="ghost" onClick={() => navigate('/')}>
            返回首页
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
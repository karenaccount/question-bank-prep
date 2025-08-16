import { useAuth } from "@/contexts/AuthContext";

const WelcomeMessage = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "早上好";
    if (hour < 18) return "下午好";
    return "晚上好";
  };

  const getWelcomeMessage = () => {
    const timeOfDay = getTimeOfDay();
    const userName = user.email.split('@')[0]; // 使用邮箱前缀作为用户名
    
    if (user.role === 'teacher') {
      return `${timeOfDay}，${userName}老师，出题助手伴你开启新的一天~`;
    } else {
      return `${timeOfDay}，${userName}，学习记得劳逸结合哦~`;
    }
  };

  return (
    <div className="text-center">
      <p className="text-xs text-muted-foreground">
        {getWelcomeMessage()}
      </p>
    </div>
  );
};

export default WelcomeMessage;
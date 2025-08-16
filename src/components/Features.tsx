import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Brain, 
  FileText, 
  Users, 
  CheckCircle, 
  BarChart3,
  Plus,
  Edit,
  Send,
  Award
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      title: "知识点管理",
      description: "分类管理教学知识点，支持多级分类，便于快速检索和选择",
      action: "管理知识点",
      gradient: "from-blue-500/10 to-blue-600/10"
    },
    {
      icon: <Brain className="w-8 h-8 text-primary" />,
      title: "智能出题",
      description: "基于选定知识点，AI自动生成多种题型，包括选择题、填空题、解答题",
      action: "开始出题",
      gradient: "from-purple-500/10 to-purple-600/10"
    },
    {
      icon: <FileText className="w-8 h-8 text-primary" />,
      title: "试卷生成",
      description: "快速组合题目，自动排版生成标准化试卷，支持多种模板",
      action: "创建试卷",
      gradient: "from-green-500/10 to-green-600/10"
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "学生管理",
      description: "管理学生信息，分配试卷，跟踪学习进度和答题情况",
      action: "管理学生",
      gradient: "from-orange-500/10 to-orange-600/10"
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-primary" />,
      title: "自动批改",
      description: "智能批改学生答题，给出分数，提供详细的错题分析和解题思路",
      action: "查看批改",
      gradient: "from-red-500/10 to-red-600/10"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-primary" />,
      title: "数据统计",
      description: "生成详细的成绩报告，分析学生掌握情况，优化教学方案",
      action: "查看统计",
      gradient: "from-indigo-500/10 to-indigo-600/10"
    }
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            完整的教学解决方案
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            从知识点管理到智能批改，TeachMate 为您提供一站式的备课和教学管理服务
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`bg-gradient-card border border-border hover:shadow-feature transform hover:-translate-y-2 transition-all duration-300 group cursor-pointer bg-gradient-to-br ${feature.gradient}`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="bg-accent rounded-lg p-3 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground mb-4 leading-relaxed">
                  {feature.description}
                </CardDescription>
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                >
                  {feature.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-16 bg-gradient-card rounded-2xl p-8 border border-border shadow-card">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            快速操作
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="feature" className="flex-col gap-2 h-24">
              <Edit className="w-6 h-6" />
              新建试卷
            </Button>
            <Button variant="feature" className="flex-col gap-2 h-24">
              <Send className="w-6 h-6" />
              发布作业
            </Button>
            <Button variant="feature" className="flex-col gap-2 h-24">
              <Award className="w-6 h-6" />
              查看成绩
            </Button>
            <Button variant="feature" className="flex-col gap-2 h-24">
              <BarChart3 className="w-6 h-6" />
              分析报告
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
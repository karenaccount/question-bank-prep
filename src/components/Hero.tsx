import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Clock, Target } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const Hero = () => {
  return (
    <section className="relative bg-gradient-hero text-primary-foreground py-20 px-4 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroBanner})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary-glow/80" />
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            智能备课，
            <span className="text-accent bg-gradient-to-r from-accent to-primary-glow bg-clip-text text-transparent">
              轻松出题
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 leading-relaxed">
            基于AI的智能题库系统，帮助老师快速生成高质量试卷，
            自动批改答题，提供详细解析，让教学更高效
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button variant="hero" size="lg" className="gap-2 text-lg px-8 py-6">
              <Sparkles className="w-5 h-5" />
              开始使用
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="feature" size="lg" className="gap-2 text-lg px-8 py-6 bg-card/20 text-primary-foreground border-primary-foreground/30 hover:bg-card/30">
              查看演示
            </Button>
          </div>
          
          {/* Features Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="bg-card/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/20">
              <div className="bg-accent rounded-full w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">快速生成</h3>
              <p className="text-primary-foreground/80">选择知识点，AI自动生成高质量题目</p>
            </div>
            
            <div className="bg-card/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/20">
              <div className="bg-accent rounded-full w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">智能批改</h3>
              <p className="text-primary-foreground/80">自动批改答题，提供详细解析</p>
            </div>
            
            <div className="bg-card/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/20">
              <div className="bg-accent rounded-full w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">试卷管理</h3>
              <p className="text-primary-foreground/80">一站式试卷管理，统计分析</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
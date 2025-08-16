import { BookOpen, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6" />
              <h3 className="text-xl font-bold">TeachMate</h3>
            </div>
            <p className="text-primary-foreground/80 mb-4">
              专业的教师备课题库系统，让教学更智能、更高效。
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-lg font-semibold mb-4">产品功能</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>智能出题</li>
              <li>试卷管理</li>
              <li>自动批改</li>
              <li>学生管理</li>
              <li>数据统计</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">帮助支持</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>使用教程</li>
              <li>常见问题</li>
              <li>联系客服</li>
              <li>意见反馈</li>
              <li>更新日志</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">联系我们</h4>
            <div className="space-y-3 text-primary-foreground/80">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@teachmate.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>400-123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>北京市朝阳区</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/60">
            © 2024 TeachMate. All rights reserved. | 
            <span className="ml-2">京ICP备12345678号</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
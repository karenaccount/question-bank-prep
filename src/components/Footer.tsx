import { BookOpen, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-8 px-4">
      <div className="container mx-auto">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-6 h-6" />
            <h3 className="text-xl font-bold">小班题库</h3>
          </div>
          <p className="text-primary-foreground/80 mb-4">
            内部题目管理系统
          </p>
          <p className="text-primary-foreground/60 text-sm">
            © 2024 小班题库. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import WelcomeMessage from "@/components/WelcomeMessage";
import TeacherDashboard from "@/components/TeacherDashboard";
import StudentDashboard from "@/components/StudentDashboard";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <WelcomeMessage />
        {user.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />}
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;

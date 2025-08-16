import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import WelcomeMessage from "@/components/WelcomeMessage";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {isAuthenticated && <WelcomeMessage />}
      <Hero />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;

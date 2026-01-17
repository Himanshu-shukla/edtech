import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingDots from "../FloatingDots";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Background dots */}
      <div className="fixed inset-0 -z-10">
        <FloatingDots numDots={40} className="mix-blend-screen opacity-30" />
      </div>
      
      <main className="pt-20 flex items-center justify-center min-h-screen">
        <div className="text-center px-6 max-w-2xl">
          <div className="text-8xl mb-6">🔍</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Page Not Found
          </h1>
          <p className="text-white/70 text-lg mb-8">
            Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you entered the wrong URL.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="cta cta-primary">
              Go Home
            </Link>
            <Link to="/programs" className="cta cta-secondary">
              Browse Programs
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

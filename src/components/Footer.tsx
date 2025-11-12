import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
              <GraduationCap className="h-6 w-6 text-accent" />
              <span>SkillBridge</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Empowering students through real-world projects and verified micro-credentials.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/browse-projects" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                  Browse Projects
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                  Help Centre
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} SkillBridge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};


import { Search, Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  product: [
    { name: "Pricing", to: "/pricing" },
    { name: "Features", to: "/features" },
    { name: "How It Works", to: "/how-it-works" },
    { name: "Use Cases", to: "/use-cases" }
  ],
  company: [
    { name: "Blog", to: "/blog" },
    { name: "Design Inspiration", to: "/design-inspiration" },
    { name: "About", href: "mailto:abhi@milna.dev?subject=About Milna" },
    { name: "Contact", href: "mailto:abhi@milna.dev?subject=Contact Milna" }
  ],
  support: [
    { name: "Help Center", to: "/help-center" },
    { name: "Community", to: "/community" },
    { name: "Status", to: "/status" },
    { name: "Privacy", to: "/privacy" }
  ]
};

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
  { name: "GitHub", icon: Github, href: "#" }
];

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/milna-symbol.png" 
                alt="Milna" 
                className="h-8 w-8"
              />
              <span className="text-xl font-bold">Milna</span>
            </div>
            
            <p className="text-muted-foreground mb-6 max-w-sm">
              Transform your website into an AI-powered sales and search agent. Book more meetings, qualify more leads.
            </p>

            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link to={link.to} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  {link.to ? (
                    <Link to={link.to} className="text-muted-foreground hover:text-foreground transition-colors">
                      {link.name}
                    </Link>
                  ) : (
                    <a href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  {link.to ? (
                    <Link to={link.to} className="text-muted-foreground hover:text-foreground transition-colors">
                      {link.name}
                    </Link>
                  ) : (
                    <a href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Milna. All rights reserved.
          </p>
          
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const currentYear = new Date().getFullYear();

const footerLinks = {
  rukuni: [
    { name: 'Wayoyi', href: '/category/wayoyi' },
    { name: 'Manhajoji', href: '/category/manhajoji' },
    { name: 'Bita', href: '/category/bita' },
    { name: 'Dabaru', href: '/category/dabaru' },
  ],
  bayani: [
    { name: 'Game da mu', href: '/about' },
    { name: 'Tuntuɓe mu', href: '/contact' },
    { name: 'Manufa', href: '/privacy' },
    { name: 'Sharuɗɗa', href: '/terms' },
  ],
};

const socialLinks = [
  { icon: FaFacebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: FaYoutube, href: 'https://youtube.com', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="brand-name text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4 tracking-tight">
              Technologiya
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md leading-relaxed">
              Mafi kyawun wurin samun sabbin labarai game da wayoyi, manhajoji, da dabaru na fasaha a cikin Hausa.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-mono font-bold text-gray-900 dark:text-gray-100 mb-4 tracking-wide">
              Rukunin Labarai
            </h4>
            <ul className="space-y-2">
              {footerLinks.rukuni.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Links */}
          <div>
            <h4 className="font-mono font-bold text-gray-900 dark:text-gray-100 mb-4 tracking-wide">
              Bayani
            </h4>
            <ul className="space-y-2">
              {footerLinks.bayani.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="font-mono text-gray-600 dark:text-gray-400 text-sm tabular-nums">
              © {currentYear} Technologiya. Duk haƙƙoƙin an keɓe.
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              An gina shi da ❤️ don masu magana da Hausa
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

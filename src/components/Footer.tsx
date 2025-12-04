import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaGithub, FaLinkedin } from 'react-icons/fa';
import { FiArrowRight, FiMail } from 'react-icons/fi';

const currentYear = new Date().getFullYear();

const footerLinks = {
  explore: [
    { name: 'Wayoyi', href: '/category/wayoyi' },
    { name: 'Manhajoji', href: '/category/manhajoji' },
    { name: 'Bita', href: '/category/bita' },
    { name: 'Dabaru', href: '/category/dabaru' },
    { name: 'Koyarwa', href: '/category/koyarwa' },
  ],
  company: [
    { name: 'Game da mu', href: '/about' },
    { name: 'Tuntuɓe mu', href: '/contact' },
    { name: 'Yi Talla', href: '/advertise' },
    { name: 'Marubuta', href: '/authors' },
  ],
  legal: [
    { name: 'Manufa', href: '/privacy' },
    { name: 'Sharuɗɗa', href: '/terms' },
    { name: 'Cookies', href: '/cookies' },
  ],
};

const socialLinks = [
  { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter', color: 'hover:text-sky-500' },
  { icon: FaFacebook, href: 'https://facebook.com', label: 'Facebook', color: 'hover:text-blue-600' },
  { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram', color: 'hover:text-pink-500' },
  { icon: FaYoutube, href: 'https://youtube.com', label: 'YouTube', color: 'hover:text-red-600' },
  { icon: FaLinkedin, href: 'https://linkedin.com', label: 'LinkedIn', color: 'hover:text-blue-700' },
];

export default function Footer() {
  return (
    <footer className="relative bg-white dark:bg-[#030712] border-t border-gray-200 dark:border-gray-900 overflow-hidden">
      {/* Decorative Background Glow */}
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 relative z-10">
        
        {/* Top Section: Brand & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 pb-12 border-b border-gray-100 dark:border-gray-900">
          
          {/* Brand */}
          <div className="lg:col-span-5">
            <a href="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                T
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white font-display">
                Technologiya
              </span>
            </a>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8 max-w-md">
              Cibiyar labaran fasaha ta zamani a harshen Hausa. Muna kawo muku sabbin labarai, bita, da koyarwa don haɓaka ilimin fasaha a Arewacin Najeriya da duniya baki ɗaya.
            </p>
            
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-full bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 transition-all duration-300 hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg hover:-translate-y-1 ${social.color}`}
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Newsletter Widget */}
          <div className="lg:col-span-7 lg:pl-12">
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full"></div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Kasance da Labarai
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Samun sabbin labarai kai tsaye zuwa imel ɗin ku kowane mako.
                </p>
                
                <form className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="email" 
                      placeholder="Shigar da imel ɗin ku" 
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <button className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 flex items-center justify-center gap-2">
                    Yi Rajista <FiArrowRight />
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-4">
                  Ba ma tura spam. Kuna iya fita a kowane lokaci.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-16">
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">Bincika</h4>
            <ul className="space-y-4">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">Kamfani</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">Doka</h4>
            <ul className="space-y-4">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">Saukewa</h4>
            <p className="text-sm text-gray-500 mb-4">
              Zai zo nan ba da jimawa ba akan:
            </p>
            <div className="space-y-3 opacity-60 grayscale hover:grayscale-0 transition-all cursor-not-allowed">
              <div className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-3 border border-gray-800">
                <div className="text-2xl"></div>
                <div className="text-left">
                  <div className="text-[10px] leading-none">Download on the</div>
                  <div className="text-sm font-bold leading-tight">App Store</div>
                </div>
              </div>
              <div className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-3 border border-gray-800">
                <div className="text-xl">▶</div>
                <div className="text-left">
                  <div className="text-[10px] leading-none">GET IT ON</div>
                  <div className="text-sm font-bold leading-tight">Google Play</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 dark:border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-500 font-mono">
            © {currentYear} Technologiya Media. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-500 dark:text-gray-500 flex items-center gap-2">
              An gina da <span className="text-red-500">❤️</span> a Kano
            </span>
            <div className="h-4 w-px bg-gray-200 dark:bg-gray-800"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-mono text-gray-500">System: Stable</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
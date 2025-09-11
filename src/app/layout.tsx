import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Image Generator',
  description: 'Create stunning images with artificial intelligence',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800`}>
        <div className="min-h-full flex flex-col">
          {/* Navigation Header */}
          <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-8">
                  <Link href="/" className="text-2xl font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    AI Generator
                  </Link>
                  <nav className="hidden md:flex space-x-6">
                    <Link 
                      href="/" 
                      className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
                    >
                      Generate
                    </Link>
                    <Link 
                      href="/gallery" 
                      className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
                    >
                      Gallery
                    </Link>
                  </nav>
                </div>
                
                {/* Mobile Navigation */}
                <div className="md:hidden">
                  <Link 
                    href="/gallery" 
                    className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
                  >
                    Gallery
                  </Link>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 flex flex-col">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                <p>Create beautiful images with advanced AI technology</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
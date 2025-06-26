// src/App.tsx
import { useEffect, useState } from 'react';
import CoinDetail from './components/CoinDetail';
import Footer from './components/Footer';
import Header from './components/Header';
import MainContent from './components/MainContent';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const [currentPage, setCurrentPage] = useState<'main' | 'detail'>('main');
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);

  const navigateToCoinDetail = (coinId: string) => {
    setSelectedCoinId(coinId);
    setCurrentPage('detail');
  };

  const navigateToMain = () => {
    setSelectedCoinId(null);
    setCurrentPage('main');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header
        currentTheme={theme}
        onThemeToggle={toggleTheme}
        onSearch={() => { /* TODO: Implement search logic */ }}
        onLogoClick={navigateToMain}
      />

      <main className="container mx-auto p-4 flex-grow">
        {currentPage === 'main' ? (
          <MainContent onCoinSelect={navigateToCoinDetail} />
        ) : (
          // *** แก้ไขตรงนี้: เพิ่ม prop currentTheme={theme} ***
          <CoinDetail
            coinId={selectedCoinId}
            onBackToList={navigateToMain}
            currentTheme={theme} // <--- บรรทัดนี้ที่ต้องเพิ่ม
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
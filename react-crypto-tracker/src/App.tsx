// src/App.tsx
import { useEffect, useState } from 'react';
import CoinDetail from './components/CoinDetail';
import Footer from './components/Footer';
import Header from './components/Header';
import MainContent from './components/MainContent';

function App() {
  // State สำหรับจัดการธีมของแอปพลิเคชัน
  // ใช้ localStorage เพื่อจดจำธีมที่ผู้ใช้เลือกไว้
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' ? 'dark' : 'light';
  });

  // Effect hook สำหรับเพิ่ม/ลบ class 'dark' บนแท็ก <html> เมื่อธีมเปลี่ยน
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme); // บันทึกธีมที่เลือกใน localStorage
  }, [theme]);

  // ฟังก์ชันสำหรับสลับธีม
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // State สำหรับจัดการการแสดงผลว่ากำลังดูหน้าหลักหรือหน้ารายละเอียดเหรียญ
  // ในอนาคต อาจจะใช้ React Router หรือ Context API สำหรับการจัดการเส้นทางที่ซับซ้อนกว่านี้
  const [currentPage, setCurrentPage] = useState<'main' | 'detail'>('main');
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);

  // ฟังก์ชันสำหรับเปลี่ยนไปหน้ารายละเอียดเหรียญ
  const navigateToCoinDetail = (coinId: string) => {
    setSelectedCoinId(coinId);
    setCurrentPage('detail');
  };

  // ฟังก์ชันสำหรับกลับไปหน้าหลัก
  const navigateToMain = () => {
    setSelectedCoinId(null);
    setCurrentPage('main');
  };

  return (
    // div หลักของแอปพลิเคชัน กำหนดพื้นหลังและสีข้อความตามธีม
    // min-h-screen: กำหนดความสูงขั้นต่ำเต็มหน้าจอ
    // flex flex-col: จัดวางองค์ประกอบแนวตั้ง
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header Component */}
      <Header
        currentTheme={theme}
        onThemeToggle={toggleTheme}
        onSearch={() => { /* TODO: Implement search logic */ }}
        onLogoClick={navigateToMain} // เมื่อคลิกโลโก้ จะกลับไปหน้าหลัก
      />

      {/* Main content area */}
      <main className="container mx-auto p-4 flex-grow">
        {currentPage === 'main' ? (
          // แสดง MainContent เมื่ออยู่หน้าหลัก
          // ส่งฟังก์ชัน navigateToCoinDetail ไปยัง MainContent เพื่อให้สามารถคลิกดูรายละเอียดเหรียญได้
          <MainContent onCoinSelect={navigateToCoinDetail} />
        ) : (
          // แสดง CoinDetail เมื่ออยู่หน้ารายละเอียดเหรียญ
          // ส่ง selectedCoinId และ navigateToMain กลับไปหน้าหลัก
          <CoinDetail coinId={selectedCoinId} onBackToList={navigateToMain} />
        )}
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}

export default App;





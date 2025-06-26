import React from 'react';

// กำหนด Type สำหรับ Props ของ Header Component
interface HeaderProps {
    currentTheme: 'light' | 'dark'; // ธีมปัจจุบัน
    onThemeToggle: () => void; // ฟังก์ชันสำหรับสลับธีม
    onSearch: (query: string) => void; // ฟังก์ชันเมื่อมีการค้นหา
    onLogoClick: () => void; // ฟังก์ชันเมื่อคลิกโลโก้/ชื่อแอป
}

const Header: React.FC<HeaderProps> = ({ currentTheme, onThemeToggle, onSearch, onLogoClick }) => {
    // State สำหรับเก็บค่าที่ผู้ใช้พิมพ์ในช่องค้นหา
    const [searchQuery, setSearchQuery] = React.useState<string>('');

    // ฟังก์ชันจัดการการเปลี่ยนแปลงในช่องค้นหา
    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // ฟังก์ชันจัดการการกดปุ่ม Enter ในช่องค้นหา
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // ป้องกันการ reload หน้า
        onSearch(searchQuery); // เรียกฟังก์ชัน onSearch ที่ส่งมาจาก App.tsx
        // setSearchQuery(''); // อาจจะล้างช่องค้นหาหลังจากค้นหาแล้ว
    };

    return (
        // Header container: กำหนดสีพื้นหลัง, padding, shadow และการจัดวาง
        <header className="bg-white dark:bg-gray-800 shadow-md p-4 sticky top-0 z-50 transition-colors duration-300">
            <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
                {/* Logo / App Name */}
                <div
                    className="flex items-center space-x-2 cursor-pointer mb-4 sm:mb-0"
                    onClick={onLogoClick} // เมื่อคลิกจะกลับไปหน้าหลัก
                >
                    {/* Icon (ตัวอย่าง: ไอคอนเหรียญ) */}
                    <svg
                        className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.292 9.776a4 4 0 00-4.004-4.004L13 5a4 4 0 00-4 4v5a4 4 0 004 4h.004a4 4 0 004.004-4v-5zM12 21.01V23M15 12h-6"
                        ></path>
                    </svg>
                    {/* ชื่อแอปพลิเคชัน */}
                    <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white">
                        CoinWatch
                    </h1>
                </div>

                {/* Search Bar and Theme Toggle */}
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                    {/* Search Bar */}
                    <form onSubmit={handleSearchSubmit} className="relative flex-grow sm:flex-none">
                        <input
                            type="text"
                            placeholder="ค้นหาเหรียญ..."
                            className="py-2 pl-10 pr-4 w-full sm:w-64 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                        />
                        {/* Search Icon */}
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                                className="h-5 w-5 text-gray-500 dark:text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </div>
                    </form>

                    {/* Theme Toggle Button */}
                    <button
                        onClick={onThemeToggle}
                        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                        aria-label="Toggle theme"
                    >
                        {currentTheme === 'light' ? (
                            // Sun icon for light mode
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 3v1m0 16v1m9-9h1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                ></path>
                            </svg>
                        ) : (
                            // Moon icon for dark mode
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                ></path>
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
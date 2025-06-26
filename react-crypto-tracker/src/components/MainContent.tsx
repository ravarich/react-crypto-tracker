// src/components/MainContent.tsx
import React, { useEffect, useState } from 'react';

// กำหนด Type สำหรับโครงสร้างข้อมูลของเหรียญที่ได้จาก API (Simplified)
// สามารถเพิ่ม properties อื่นๆ ได้ตามที่ CoinGecko API ส่งมา
interface Coin {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    price_change_percentage_24h: number;
    total_volume: number;
}

// กำหนด Type สำหรับ Props ของ MainContent Component
interface MainContentProps {
    onCoinSelect: (coinId: string) => void; // ฟังก์ชันเมื่อเลือกเหรียญเพื่อดูรายละเอียด
}

const MainContent: React.FC<MainContentProps> = ({ onCoinSelect }) => {
    // State สำหรับเก็บข้อมูลเหรียญที่ดึงมาจาก API
    const [coins, setCoins] = useState<Coin[]>([]);
    // State สำหรับจัดการสถานะการโหลดข้อมูล
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // State สำหรับจัดการข้อผิดพลาด (ถ้ามี)
    const [error, setError] = useState<string | null>(null);

    // useEffect Hook สำหรับดึงข้อมูลเมื่อ Component ถูก Render ครั้งแรก
    useEffect(() => {
        const fetchCoins = async () => {
            try {
                setIsLoading(true); // ตั้งค่าสถานะการโหลดเป็น true
                setError(null);    // ล้างข้อผิดพลาดเก่า

                // URL สำหรับ CoinGecko API เพื่อดึงข้อมูลเหรียญยอดนิยม
                // per_page=20: ดึงมา 20 เหรียญต่อหน้า
                // vs_currency=usd: กำหนดสกุลเงินเป็น USD
                // sparkline=false: ไม่ต้องการข้อมูลกราฟย่อ
                const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false';

                const response = await fetch(API_URL);

                // ตรวจสอบว่า response สำเร็จหรือไม่ (status 2xx)
                if (!response.ok) {
                    // หากไม่สำเร็จ โยน Error พร้อมข้อความสถานะ
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: Coin[] = await response.json(); // แปลง response เป็น JSON
                setCoins(data); // เก็บข้อมูลเหรียญลงใน state
            } catch (err: any) { // ใช้ 'any' เพื่อให้ครอบคลุมประเภท error ที่อาจเกิดขึ้น
                console.error("Failed to fetch coins:", err);
                setError(err.message || "Failed to load cryptocurrency data."); // ตั้งค่าข้อผิดพลาด
            } finally {
                setIsLoading(false); // ไม่ว่าจะสำเร็จหรือล้มเหลว ก็หยุดสถานะการโหลด
            }
        };

        fetchCoins(); // เรียกใช้ฟังก์ชันดึงข้อมูลเมื่อ Component โหลด
    }, []); // Dependency array ว่างเปล่า [] หมายความว่า Effect นี้จะรันเพียงครั้งเดียวเมื่อ Component mount

    // แสดงสถานะการโหลด
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-xl text-gray-700 dark:text-gray-300">Loading cryptocurrencies...</p>
            </div>
        );
    }

    // แสดงข้อผิดพลาด
    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-64 bg-red-100 dark:bg-red-900 rounded-lg shadow-xl text-red-700 dark:text-red-200 p-4">
                <p className="text-xl font-bold mb-2">Error:</p>
                <p className="text-center">{error}</p>
                <p className="text-sm mt-2">โปรดลองอีกครั้งในภายหลัง หรือตรวจสอบการเชื่อมต่ออินเทอร์เน็ต</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                ตลาดคริปโตยอดนิยม
            </h2>

            {/* ตารางแสดงรายการเหรียญ */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Rank
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Coin
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Price (USD)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                24h Change
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Market Cap
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                24h Volume
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {/* วนลูปแสดงข้อมูลเหรียญที่ได้จาก API */}
                        {coins.map((coin) => (
                            <tr
                                key={coin.id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                onClick={() => onCoinSelect(coin.id)} // เมื่อคลิกจะเรียกฟังก์ชัน onCoinSelect
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    {coin.market_cap_rank}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    <div className="flex items-center">
                                        {/* แสดงรูปภาพเหรียญ */}
                                        <img src={coin.image} alt={coin.name} className="flex-shrink-0 h-8 w-8 mr-2 rounded-full" />
                                        <span>{coin.name}</span>
                                        <span className="ml-2 text-gray-500 dark:text-gray-400">
                                            {coin.symbol.toUpperCase()}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                                </td>
                                <td
                                    className={`px-6 py-4 whitespace-nowrap text-sm ${coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                                        }`}
                                >
                                    {coin.price_change_percentage_24h ? coin.price_change_percentage_24h.toFixed(2) : 'N/A'}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    ${coin.market_cap.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    ${coin.total_volume.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                ข้อมูลจาก CoinGecko API
            </p>
        </div>
    );
};

export default MainContent;
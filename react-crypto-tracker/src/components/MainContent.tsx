import React from 'react';

// กำหนด Type สำหรับ Props ของ MainContent Component
interface MainContentProps {
    onCoinSelect: (coinId: string) => void; // ฟังก์ชันเมื่อเลือกเหรียญเพื่อดูรายละเอียด
}

const MainContent: React.FC<MainContentProps> = ({ onCoinSelect }) => {
    // TODO: ในอนาคตจะดึงข้อมูลเหรียญจาก CoinGecko API มาแสดงที่นี่
    // อาจจะใช้ useState เพื่อเก็บข้อมูลเหรียญ และ useEffect สำหรับเรียก API

    // ตัวอย่างข้อมูลเหรียญ (Placeholder Data)
    const coins = [
        { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 65000, change24h: 2.5, marketCap: '1.2T' },
        { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3500, change24h: -1.2, marketCap: '420B' },
        { id: 'binancecoin', name: 'BNB', symbol: 'BNB', price: 600, change24h: 0.8, marketCap: '90B' },
        { id: 'solana', name: 'Solana', symbol: 'SOL', price: 150, change24h: 5.1, marketCap: '65B' },
    ];

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
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {coins.map((coin, index) => (
                            // แต่ละแถวเหรียญ สามารถคลิกได้
                            <tr
                                key={coin.id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                onClick={() => onCoinSelect(coin.id)} // เมื่อคลิกจะเรียกฟังก์ชัน onCoinSelect
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    {index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    <div className="flex items-center">
                                        {/* Placeholder for coin logo */}
                                        <div className="flex-shrink-0 h-8 w-8 mr-2 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white">
                                            {coin.symbol.substring(0, 2).toUpperCase()}
                                        </div>
                                        <span>{coin.name}</span>
                                        <span className="ml-2 text-gray-500 dark:text-gray-400">
                                            {coin.symbol.toUpperCase()}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    ${coin.price.toLocaleString()}
                                </td>
                                <td
                                    className={`px-6 py-4 whitespace-nowrap text-sm ${coin.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                                        }`}
                                >
                                    {coin.change24h.toFixed(2)}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    ${coin.marketCap}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                ข้อมูลตัวอย่างเท่านั้น
            </p>
        </div>
    );
};

export default MainContent;
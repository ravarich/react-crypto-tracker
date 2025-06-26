import React from 'react';

// กำหนด Type สำหรับ Props ของ CoinDetail Component
interface CoinDetailProps {
    coinId: string | null; // ID ของเหรียญที่ถูกเลือก
    onBackToList: () => void; // ฟังก์ชันสำหรับกลับไปหน้าหลัก
}

const CoinDetail: React.FC<CoinDetailProps> = ({ coinId, onBackToList }) => {
    // TODO: ในอนาคตจะดึงข้อมูลรายละเอียดของเหรียญจาก CoinGecko API มาแสดงที่นี่
    // โดยใช้ coinId ที่ส่งมาเป็นพารามิเตอร์
    // อาจจะใช้ useState เพื่อเก็บข้อมูลรายละเอียดเหรียญ และ useEffect สำหรับเรียก API

    // Placeholder Data สำหรับแสดงรายละเอียด
    const coinDetails = {
        id: coinId || 'bitcoin',
        name: coinId === 'ethereum' ? 'Ethereum' : 'Bitcoin',
        symbol: coinId === 'ethereum' ? 'ETH' : 'BTC',
        price: coinId === 'ethereum' ? 3500 : 65000,
        rank: coinId === 'ethereum' ? 2 : 1,
        description: 'นี่คือคำอธิบายสั้นๆ ของเหรียญนี้... (ข้อมูลจำลอง)',
        high24h: coinId === 'ethereum' ? 3600 : 66000,
        low24h: coinId === 'ethereum' ? 3400 : 64000,
        marketCap: coinId === 'ethereum' ? '420,000,000,000' : '1,200,000,000,000',
        totalSupply: coinId === 'ethereum' ? '120,000,000' : '21,000,000',
        circulatingSupply: coinId === 'ethereum' ? '120,000,000' : '19,700,000',
    };

    if (!coinId) {
        return (
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl text-gray-700 dark:text-gray-300">
                <p>กรุณาเลือกเหรียญเพื่อดูรายละเอียด.</p>
                <button
                    onClick={onBackToList}
                    className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    กลับไปที่รายการเหรียญ
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
            {/* ปุ่มสำหรับกลับไปหน้าหลัก */}
            <button
                onClick={onBackToList}
                className="flex items-center mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                <svg
                    className="h-5 w-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    ></path>
                </svg>
                กลับ
            </button>

            <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
                {coinDetails.name} <span className="text-indigo-600 dark:text-indigo-400">({coinDetails.symbol.toUpperCase()})</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                Rank #{coinDetails.rank}
            </p>

            {/* ข้อมูลราคาและสถิติ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-inner">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">ราคาปัจจุบัน</h3>
                    <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                        ${coinDetails.price.toLocaleString()}
                    </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-inner">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">ข้อมูลสถิติ</h3>
                    <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                        <li><span className="font-medium">Market Cap:</span> ${coinDetails.marketCap}</li>
                        <li><span className="font-medium">High (24h):</span> ${coinDetails.high24h.toLocaleString()}</li>
                        <li><span className="font-medium">Low (24h):</span> ${coinDetails.low24h.toLocaleString()}</li>
                        <li><span className="font-medium">Total Supply:</span> {coinDetails.totalSupply}</li>
                        <li><span className="font-medium">Circulating Supply:</span> {coinDetails.circulatingSupply}</li>
                    </ul>
                </div>
            </div>

            {/* กราฟราคา (Placeholder) */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-inner mb-8">
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">กราฟราคา (Placeholder)</h3>
                <div className="h-64 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400">
                    กราฟจะแสดงที่นี่ (เช่น Chart.js, Recharts)
                </div>
            </div>

            {/* คำอธิบายเหรียญ */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-inner">
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">เกี่ยวกับ {coinDetails.name}</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {coinDetails.description}
                </p>
                {/* TODO: เพิ่มลิงก์เว็บไซต์ทางการ, Explorer, Community เป็นต้น */}
            </div>
        </div>
    );
};

export default CoinDetail;
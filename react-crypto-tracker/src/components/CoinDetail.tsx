// src/components/CoinDetail.tsx
import React, { useEffect, useState } from 'react';

// กำหนด Type สำหรับโครงสร้างข้อมูลของเหรียญที่ได้จาก API (Simplified)
// CoinGecko API สำหรับรายละเอียดเหรียญจะส่งข้อมูลมาเยอะมาก เราจะเลือกเฉพาะที่จำเป็น
interface CoinDetailData {
    id: string;
    symbol: string;
    name: string;
    description: {
        en: string; // คำอธิบายเป็นภาษาอังกฤษ
    };
    image: {
        large: string; // URL รูปภาพขนาดใหญ่
    };
    market_cap_rank: number;
    market_data: {
        current_price: {
            usd: number;
            thb: number; // ถ้าอยากได้ราคา THB ด้วย
        };
        high_24h: {
            usd: number;
        };
        low_24h: {
            usd: number;
        };
        market_cap: {
            usd: number;
        };
        total_volume: {
            usd: number;
        };
        circulating_supply: number;
        total_supply: number | null;
        ath: {
            usd: number;
        };
        ath_date: {
            usd: string;
        };
    };
    links: {
        homepage: string[];
        blockchain_site: string[];
        official_forum_url: string[];
        twitter_screen_name: string;
    };
}

// กำหนด Type สำหรับ Props ของ CoinDetail Component
interface CoinDetailProps {
    coinId: string | null; // ID ของเหรียญที่ถูกเลือก (เช่น 'bitcoin', 'ethereum')
    onBackToList: () => void; // ฟังก์ชันสำหรับกลับไปหน้าหลัก
}

const CoinDetail: React.FC<CoinDetailProps> = ({ coinId, onBackToList }) => {
    // State สำหรับเก็บข้อมูลรายละเอียดเหรียญ
    const [coinData, setCoinData] = useState<CoinDetailData | null>(null);
    // State สำหรับจัดการสถานะการโหลดข้อมูล
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // State สำหรับจัดการข้อผิดพลาด (ถ้ามี)
    const [error, setError] = useState<string | null>(null);

    // useEffect Hook สำหรับดึงข้อมูลรายละเอียดเหรียญเมื่อ coinId เปลี่ยนแปลง
    useEffect(() => {
        // หากไม่มี coinId ให้หยุดการทำงาน (กรณีกลับมาจากหน้ารายละเอียด)
        if (!coinId) {
            setIsLoading(false);
            setCoinData(null);
            return;
        }

        const fetchCoinDetails = async () => {
            try {
                setIsLoading(true); // ตั้งค่าสถานะการโหลดเป็น true
                setError(null);    // ล้างข้อผิดพลาดเก่า
                setCoinData(null); // ล้างข้อมูลเก่า (ป้องกันการแสดงข้อมูลผิดเหรียญชั่วคราว)

                // URL สำหรับ CoinGecko API เพื่อดึงรายละเอียดของเหรียญแต่ละเหรียญ
                // ids: กำหนด ID ของเหรียญ
                // localization=false: ไม่ต้องการข้อมูลที่แปลเป็นภาษาท้องถิ่น
                // tickers=false: ไม่ต้องการข้อมูล Exchange
                // community_data=false: ไม่ต้องการข้อมูลจากชุมชน
                // developer_data=false: ไม่ต้องการข้อมูลจากนักพัฒนา
                // sparkline=true: ต้องการข้อมูลกราฟย่อ (สำหรับกราฟราคา)
                const API_URL = `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=true`;

                const response = await fetch(API_URL);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: CoinDetailData = await response.json();
                setCoinData(data); // เก็บข้อมูลรายละเอียดเหรียญลงใน state
            } catch (err: any) {
                console.error(`Failed to fetch details for ${coinId}:`, err);
                setError(err.message || "Failed to load coin details.");
            } finally {
                setIsLoading(false); // ไม่ว่าจะสำเร็จหรือล้มเหลว ก็หยุดสถานะการโหลด
            }
        };

        fetchCoinDetails(); // เรียกใช้ฟังก์ชันดึงข้อมูลเมื่อ coinId มีค่า
    }, [coinId]); // Dependency array: Effect นี้จะทำงานใหม่เมื่อค่า 'coinId' เปลี่ยนแปลง

    // แสดงสถานะการโหลด
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-xl text-gray-700 dark:text-gray-300">Loading coin details...</p>
            </div>
        );
    }

    // แสดงข้อผิดพลาด
    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-64 bg-red-100 dark:bg-red-900 rounded-lg shadow-xl text-red-700 dark:text-red-200 p-4">
                <p className="text-xl font-bold mb-2">Error:</p>
                <p className="text-center">{error}</p>
                <button
                    onClick={onBackToList}
                    className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    กลับไปที่รายการเหรียญ
                </button>
            </div>
        );
    }

    // หากไม่มีข้อมูลเหรียญหลังจากโหลด (อาจเกิดจาก coinId ไม่ถูกต้องหรือ API ไม่พบ)
    if (!coinData) {
        return (
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl text-gray-700 dark:text-gray-300">
                <p>ไม่พบข้อมูลสำหรับเหรียญนี้</p>
                <button
                    onClick={onBackToList}
                    className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    กลับไปที่รายการเหรียญ
                </button>
            </div>
        );
    }

    // Helper function to render HTML from description (CoinGecko returns HTML)
    // !!! WARNING: Using dangerouslySetInnerHTML can expose your site to XSS attacks
    // !!! if the content is not trusted. For CoinGecko API, it's generally safe.
    const renderDescription = (html: string) => {
        // Remove links from description to prevent external navigation issues
        // This is a simple regex and might not cover all cases.
        const sanitizedHtml = html.replace(/<a[^>]*>(.*?)<\/a>/g, '$1');
        return { __html: sanitizedHtml };
    };

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
                    xmlns="http://www.w3.org/2000/svg"
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

            {/* Header ของรายละเอียดเหรียญ */}
            <div className="flex items-center mb-4">
                {coinData.image.large && (
                    <img src={coinData.image.large} alt={coinData.name} className="w-16 h-16 mr-4 rounded-full" />
                )}
                <div>
                    <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
                        {coinData.name} <span className="text-indigo-600 dark:text-indigo-400">({coinData.symbol.toUpperCase()})</span>
                    </h2>
                    {coinData.market_cap_rank && (
                        <p className="text-gray-600 dark:text-gray-300 text-lg">
                            Rank #{coinData.market_cap_rank}
                        </p>
                    )}
                </div>
            </div>

            {/* ข้อมูลราคาและสถิติ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* ราคาปัจจุบัน */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-inner">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">ราคาปัจจุบัน</h3>
                    <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                        ${coinData.market_data.current_price.usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                    </p>
                </div>
                {/* ข้อมูลสถิติ */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-inner">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">ข้อมูลสถิติ</h3>
                    <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                        <li><span className="font-medium">Market Cap:</span> ${coinData.market_data.market_cap.usd.toLocaleString()}</li>
                        <li><span className="font-medium">High (24h):</span> ${coinData.market_data.high_24h.usd.toLocaleString()}</li>
                        <li><span className="font-medium">Low (24h):</span> ${coinData.market_data.low_24h.usd.toLocaleString()}</li>
                        <li><span className="font-medium">Total Supply:</span> {coinData.market_data.total_supply?.toLocaleString() || 'N/A'}</li>
                        <li><span className="font-medium">Circulating Supply:</span> {coinData.market_data.circulating_supply.toLocaleString()}</li>
                        <li>
                            <span className="font-medium">All-Time High (ATH):</span> $
                            {coinData.market_data.ath.usd.toLocaleString()} (
                            {new Date(coinData.market_data.ath_date.usd).toLocaleDateString()})
                        </li>
                    </ul>
                </div>
            </div>

            {/* กราฟราคา (Placeholder) */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-inner mb-8">
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">กราฟราคา (Placeholder)</h3>
                <div className="h-64 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400">
                    กราฟของ {coinData.name} จะแสดงที่นี่ (เช่น Chart.js, Recharts)
                </div>
            </div>

            {/* คำอธิบายเหรียญ */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-inner mb-8">
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">เกี่ยวกับ {coinData.name}</h3>
                {coinData.description.en ? (
                    <p
                        className="text-gray-700 dark:text-gray-300 leading-relaxed description-text"
                        // CoinGecko ส่ง HTML มาใน description จึงต้องใช้ dangerouslySetInnerHTML
                        // WARNING: ใช้ด้วยความระมัดระวังและเฉพาะกับเนื้อหาที่เชื่อถือได้เท่านั้น
                        dangerouslySetInnerHTML={renderDescription(coinData.description.en)}
                    ></p>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">ไม่มีคำอธิบายสำหรับเหรียญนี้</p>
                )}
            </div>

            {/* ลิงก์สำคัญ */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-inner">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">ลิงก์สำคัญ</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {coinData.links.homepage[0] && (
                        <a
                            href={coinData.links.homepage[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200"
                        >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                            เว็บไซต์ทางการ
                        </a>
                    )}
                    {coinData.links.blockchain_site[0] && (
                        <a
                            href={coinData.links.blockchain_site[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                        >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3.586a1 1 0 00.707-.293l4.414-4.414A1 1 0 0014.586 0H16a1 1 0 001-1v-1a1 1 0 00-1-1h-1.414a1 1 0 00-.707.293l-4.414 4.414A1 1 0 005.414 20H4a1 1 0 00-1 1v1a1 1 0 001 1h1.414a1 1 0 00.707-.293l4.414-4.414A1 1 0 0014.586 20H16a1 1 0 001-1v-1a1 1 0 00-1-1h-1.414a1 1 0 00-.707.293l-4.414 4.414A1 1 0 005.414 16H4a1 1 0 00-1 1v1a1 1 0 001 1h1.414a1 1 0 00.707-.293l4.414-4.414A1 1 0 0014.586 16H16a1 1 0 001-1v-1a1 1 0 00-1-1h-1.414a1 1 0 00-.707.293l-4.414 4.414A1 1 0 005.414 12H4a1 1 0 00-1 1v1a1 1 0 001 1h1.414a1 1 0 00.707-.293l4.414-4.414A1 1 0 0014.586 12H16a1 1 0 001-1V9a1 1 0 00-1-1h-1.414a1 1 0 00-.707.293l-4.414 4.414A1 1 0 005.414 8H4a1 1 0 00-1 1v1a1 1 0 001 1h1.414a1 1 0 00.707-.293l4.414-4.414A1 1 0 0014.586 8H16a1 1 0 001-1V5a1 1 0 00-1-1h-1.414a1 1 0 00-.707.293l-4.414 4.414A1 1 0 005.414 4H4z" clipRule="evenodd"></path></svg>
                            Explorer
                        </a>
                    )}
                    {coinData.links.twitter_screen_name && (
                        <a
                            href={`https://twitter.com/${coinData.links.twitter_screen_name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                        >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.707 7.707a1 1 0 00-1.414-1.414L12 11.586l-2.293-2.293a1 1 0 00-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 001.414 1.414L12 12.414l2.293 2.293a1 1 0 001.414-1.414L13.414 12l2.293-2.293z"></path></svg>
                            Twitter
                        </a>
                    )}
                    {/* เพิ่มลิงก์อื่นๆ ได้ตามต้องการ */}
                </div>
            </div>
        </div>
    );
};

export default CoinDetail;
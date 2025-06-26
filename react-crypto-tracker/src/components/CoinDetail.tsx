// src/components/CoinDetail.tsx
import React, { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

// กำหนด Type สำหรับโครงสร้างข้อมูลของเหรียญที่ได้จาก API (Simplified)
interface CoinDetailData {
    id: string;
    symbol: string;
    name: string;
    description: {
        en: string;
    };
    image: {
        large: string;
    };
    market_cap_rank: number;
    market_data: {
        current_price: {
            usd: number;
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

// กำหนด Type สำหรับข้อมูลราคาประวัติศาสตร์ (สำหรับกราฟ)
interface ChartData {
    timestamp: number; // Unix timestamp
    price: number;
    date: string; // วันที่ในรูปแบบที่อ่านง่าย
}

// กำหนด Type สำหรับ Props ของ CoinDetail Component
interface CoinDetailProps {
    coinId: string | null;
    onBackToList: () => void;
    currentTheme: 'light' | 'dark'; // รับ prop ธีมเข้ามา
}

const CoinDetail: React.FC<CoinDetailProps> = ({ coinId, onBackToList, currentTheme }) => {
    const [coinData, setCoinData] = useState<CoinDetailData | null>(null);
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [days, setDays] = useState<string>('7'); // State สำหรับเลือกช่วงเวลาของกราฟ (เริ่มต้น 7 วัน)

    // Effect Hook สำหรับดึงข้อมูลรายละเอียดเหรียญและข้อมูลกราฟ
    useEffect(() => {
        // ถ้าไม่มี coinId ให้หยุดการทำงานและรีเซ็ตสถานะ
        if (!coinId) {
            setIsLoading(false);
            setCoinData(null);
            setChartData([]);
            return;
        }

        const fetchDetailsAndChart = async () => {
            try {
                setIsLoading(true); // ตั้งค่าสถานะการโหลดเป็น true
                setError(null);    // ล้างข้อผิดพลาดเก่า
                setCoinData(null); // ล้างข้อมูลเหรียญเก่า
                setChartData([]);  // ล้างข้อมูลกราฟเก่า

                // --- Fetch Coin Details ---
                const detailApiUrl = `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`;
                const detailResponse = await fetch(detailApiUrl);
                if (!detailResponse.ok) {
                    throw new Error(`HTTP error! status: ${detailResponse.status} for coin details.`);
                }
                const detailData: CoinDetailData = await detailResponse.json();
                setCoinData(detailData);

                // --- Fetch Chart Data ---
                const chartApiUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`;
                const chartResponse = await fetch(chartApiUrl);
                if (!chartResponse.ok) {
                    throw new Error(`HTTP error! status: ${chartResponse.status} for chart data.`);
                }
                const chartRawData = await chartResponse.json();

                // แปลงข้อมูลกราฟให้อยู่ในรูปแบบที่ Recharts ต้องการ
                const formattedChartData: ChartData[] = chartRawData.prices.map((item: [number, number]) => ({
                    timestamp: item[0],
                    price: item[1],
                    date: new Date(item[0]).toLocaleDateString('en-GB'), // ใช้ 'en-GB' เพื่อให้ได้รูปแบบ DD/MM/YYYY
                }));
                setChartData(formattedChartData);

            } catch (err: any) {
                console.error(`Failed to fetch data for ${coinId}:`, err);
                setError(err.message || "Failed to load coin details or chart data.");
            } finally {
                setIsLoading(false); // หยุดสถานะการโหลด ไม่ว่าจะสำเร็จหรือล้มเหลว
            }
        };

        fetchDetailsAndChart(); // เรียกใช้ฟังก์ชันดึงข้อมูลเมื่อ coinId หรือ days มีการเปลี่ยนแปลง
    }, [coinId, days]); // Dependency array: Effect นี้จะรันใหม่เมื่อ 'coinId' หรือ 'days' เปลี่ยน

    // Helper function เพื่อ Render HTML จาก Description
    // ***คำเตือน***: การใช้ dangerouslySetInnerHTML อาจมีความเสี่ยง XSS หากเนื้อหาไม่น่าเชื่อถือ
    // สำหรับ CoinGecko API ถือว่าปลอดภัยในระดับหนึ่ง
    const renderDescription = (html: string) => {
        // ลบลิงก์ออกจาก description เพื่อป้องกันการนำทางภายนอกที่ไม่ตั้งใจ
        // นี่เป็น regex ง่ายๆ และอาจไม่ครอบคลุมทุกกรณี
        const sanitizedHtml = html.replace(/<a[^>]*>(.*?)<\/a>/g, '$1');
        return { __html: sanitizedHtml };
    };

    // --- การแสดงผล UI ตามสถานะการโหลด/ข้อผิดพลาด/ข้อมูล ---

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

    // หากไม่มีข้อมูลเหรียญหลังจากโหลด (เช่น coinId ไม่ถูกต้องหรือ API ไม่พบข้อมูล)
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
            <div className="flex flex-col sm:flex-row items-center mb-4">
                {coinData.image.large && (
                    <img src={coinData.image.large} alt={coinData.name} className="w-16 h-16 mr-4 mb-4 sm:mb-0 rounded-full" />
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
                            {new Date(coinData.market_data.ath_date.usd).toLocaleDateString('en-GB')})
                        </li>
                    </ul>
                </div>
            </div>

            {/* กราฟราคา */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-inner mb-8">
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">กราฟราคา {coinData.name}</h3>

                {/* ปุ่มเลือกช่วงเวลาของกราฟ */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {['1', '7', '30', '90', '180', '365', 'max'].map((d) => (
                        <button
                            key={d}
                            onClick={() => setDays(d)}
                            className={`px-4 py-2 rounded-full text-sm font-medium ${days === d
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                                } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        >
                            {d === '1' ? '24h' : d === 'max' ? 'Max' : `${d}D`}
                        </button>
                    ))}
                </div>

                {/* แสดงกราฟด้วย Recharts */}
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={currentTheme === 'dark' ? '#4b5563' : '#e0e0e0'} />
                            <XAxis
                                dataKey="date"
                                stroke={currentTheme === 'dark' ? '#d1d5db' : '#4b5563'}
                                tickFormatter={(tick) => {
                                    const date = new Date(tick);
                                    if (days === '1') { // สำหรับ 24h ให้แสดงเวลา
                                        return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
                                    }
                                    // สำหรับช่วงอื่น ให้แสดงวันที่
                                    return date.toLocaleDateString('en-GB');
                                }}
                            />
                            <YAxis
                                domain={['auto', 'auto']}
                                stroke={currentTheme === 'dark' ? '#d1d5db' : '#4b5563'}
                                tickFormatter={(tick) => `$${tick.toLocaleString()}`}
                            />
                            <Tooltip
                                formatter={(value: number) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`, 'Price']}
                                labelFormatter={(label) => `Date: ${label}`}
                                contentStyle={{
                                    backgroundColor: currentTheme === 'dark' ? '#374151' : '#ffffff',
                                    borderColor: currentTheme === 'dark' ? '#4b5563' : '#e5e7eb',
                                    color: currentTheme === 'dark' ? '#f3f4f6' : '#1f2937'
                                }}
                                labelStyle={{ color: currentTheme === 'dark' ? '#9ca3af' : '#6b7280' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke="#8884d8" // สีเส้นกราฟหลัก
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                        ไม่มีข้อมูลกราฟสำหรับช่วงเวลาที่เลือก
                    </div>
                )}
            </div>

            {/* คำอธิบายเหรียญ */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-inner mb-8">
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">เกี่ยวกับ {coinData.name}</h3>
                {coinData.description.en ? (
                    <p
                        className="text-gray-700 dark:text-gray-300 leading-relaxed description-text"
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
                </div>
            </div>
        </div>
    );
};

export default CoinDetail;
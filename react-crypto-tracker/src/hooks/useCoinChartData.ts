// src/hooks/useCoinChartData.ts
import { useState, useEffect } from 'react';

// กำหนด Type สำหรับข้อมูลราคาประวัติศาสตร์ (สำหรับกราฟ)
interface ChartData {
    timestamp: number; // Unix timestamp
    price: number;
    date: string; // วันที่ในรูปแบบที่อ่านง่าย
}

interface UseCoinChartDataResult {
    chartData: ChartData[];
    isChartLoading: boolean;
    chartError: string | null;
}

/**
 * Custom hook สำหรับดึงข้อมูลกราฟราคาของเหรียญจาก CoinGecko API
 * @param coinId ID ของเหรียญ (เช่น 'bitcoin')
 * @param days ช่วงเวลาของกราฟ ('1', '7', '30', '90', '180', '365', 'max')
 * @returns Object ที่มี chartData, isChartLoading, chartError
 */
const useCoinChartData = (coinId: string | null, days: string): UseCoinChartDataResult => {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [isChartLoading, setIsChartLoading] = useState<boolean>(true);
    const [chartError, setChartError] = useState<string | null>(null);

    useEffect(() => {
        // ถ้าไม่มี coinId หรือ days ไม่ถูกต้อง ให้หยุดการทำงาน
        if (!coinId || !days) {
            setIsChartLoading(false);
            setChartData([]);
            return;
        }

        const fetchChartData = async () => {
            try {
                setIsChartLoading(true); // ตั้งค่าสถานะการโหลดกราฟเป็น true
                setChartError(null);    // ล้างข้อผิดพลาดเก่า
                setChartData([]);       // ล้างข้อมูลกราฟเก่า

                // API URL สำหรับข้อมูลกราฟ (Market Chart)
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
                console.error(`Failed to fetch chart data for ${coinId} (${days} days):`, err);
                setChartError(err.message || "Failed to load chart data."); // ตั้งค่าข้อผิดพลาด
            } finally {
                setIsChartLoading(false); // หยุดสถานะการโหลดกราฟ
            }
        };

        fetchChartData(); // เรียกใช้ฟังก์ชันดึงข้อมูลกราฟเมื่อ coinId หรือ days มีการเปลี่ยนแปลง
    }, [coinId, days]); // Dependency array: Effect นี้จะรันใหม่เมื่อ 'coinId' หรือ 'days' เปลี่ยน

    return { chartData, isChartLoading, chartError };
};

export default useCoinChartData;
import React from 'react';

const Footer: React.FC = () => {
    return (
        // Footer container: กำหนดสีพื้นหลัง, padding, margin-top และการจัดวาง
        <footer className="mt-8 py-4 bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-center text-sm transition-colors duration-300">
            <div className="container mx-auto">
                <p>
                    &copy; {new Date().getFullYear()} CoinWatch. All rights reserved.
                </p>
                <p className="mt-1">
                    Data provided by <a href="https://www.coingecko.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">CoinGecko</a>.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
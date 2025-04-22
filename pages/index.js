import { useState } from 'react'; // Import useState
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

// --- Dữ liệu Game ---
// THAY THẾ bằng URL thực tế của các game bạn đã deploy!
const games = [
  {
    id: 'click-sphere',
    title: 'Click the Sphere',
    engine: 'Babylon.js',
    description: 'Click spheres to score points before time runs out.',
    imageUrl: '/Ransanmoi.PNG', // Vẫn dùng ảnh preview nếu có
    gameUrl: 'https://lppphi.github.io/GameWeb/' // Ví dụ: 'https://your-click-sphere-game.vercel.app'
  },
  {
    id: 'sphere-runner',
    title: 'Sphere Runner',
    engine: 'Babylon.js',
    description: 'Run around and pop spheres by getting close and pressing Space.',
    imageUrl: '/templerun.PNG', 
    gameUrl: 'https://lppphi.github.io/Three/' // Ví dụ: 'https://your-sphere-runner.netlify.app'
  },
  {
    id: 'endless-runner',
    title: 'Endless Runner',
    engine: 'Three.js',
    description: 'Avoid obstacles and run as far as you can!',
    imageUrl: '/Tauvutru.PNG', 
    gameUrl: 'https://lppphi.github.io/Tauvutru/' // Ví dụ: 'http://your-server.com/endless-runner/'
  }
];
// --- ---

export default function Home() {
  // State để lưu URL của game đang được chọn, hoặc null nếu không có game nào
  const [selectedGameUrl, setSelectedGameUrl] = useState(null);

  // Hàm xử lý khi chọn một game
  const handleGameSelect = (url) => {
    // Kiểm tra xem URL có hợp lệ không (đơn giản)
    if (url && typeof url === 'string' && url.startsWith('http')) {
      setSelectedGameUrl(url);
    } else {
      console.error("Invalid game URL:", url);
      // Có thể hiển thị thông báo lỗi cho người dùng
    }
  };

  // Hàm xử lý khi nhấn nút Back
  const handleGoBack = () => {
    setSelectedGameUrl(null); // Reset state để quay lại danh sách
  };

  return (
    <div className={styles.container}>
      <Head>
        {/* Thay đổi title nếu đang xem game */}
        <title>{selectedGameUrl ? 'Playing Game' : 'My Game Hub'}</title>
        <meta name="description" content="A collection of browser games" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {/* --- Hiển thị Game trong iframe HOẶC Danh sách game --- */}
        {selectedGameUrl ? (
          // --- Chế độ hiển thị Game ---
          <div className={styles.gameView}>
             <button onClick={handleGoBack} className={styles.backButton}>
                ← Back to Games
             </button>
             <div className={styles.iframeContainer}>
                 <iframe
                   src={selectedGameUrl}
                   title="Game Window" // Title cho accessibility
                   width="100%"
                   height="100%"
                   frameBorder="0" // Bỏ viền iframe
                   allowFullScreen // Cho phép toàn màn hình (nếu game hỗ trợ)
                   sandbox="allow-scripts allow-same-origin allow-pointer-lock" // Sandbox để tăng bảo mật, tùy chỉnh nếu game cần quyền khác
                 >
                   Your browser does not support iframes. Please use the direct link:
                   <a href={selectedGameUrl} target="_blank" rel="noopener noreferrer">Play Game</a>
                 </iframe>
             </div>
          </div>
        ) : (
          // --- Chế độ hiển thị Danh sách Game ---
          <>
            <h1 className={styles.title}>
              Welcome to My Game Hub!
            </h1>
            <p className={styles.description}>
              Select a game below to play:
            </p>
            <div className={styles.grid}>
              {games.map((game) => (
                <div
                  key={game.id}
                  className={styles.card}
                  onClick={() => handleGameSelect(game.gameUrl)} // Gọi handleGameSelect khi click
                  role="button" // Cho biết đây là phần tử có thể click
                  tabIndex={0} // Cho phép focus bằng bàn phím
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleGameSelect(game.gameUrl)} // Cho phép kích hoạt bằng Enter/Space
                >
                  {game.imageUrl && (
                    <div className={styles.imageWrapper}>
                      <Image
                        src={game.imageUrl}
                        alt={`${game.title} Preview`}
                        width={300}
                        height={180}
                        layout="responsive"
                        objectFit="cover"
                      />
                    </div>
                  )}
                  <h2>{game.title} →</h2>
                  <p className={styles.gameEngine}>Engine: {game.engine}</p>
                  <p>{game.description}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

       {/* Chỉ hiển thị footer khi không xem game */}
       {!selectedGameUrl && (
          <footer className={styles.footer}>
             Powered by Fun
          </footer>
       )}
    </div>
  );
}
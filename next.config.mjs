/** @type {import('next').NextConfig} */

// QUAN TRỌNG: Thay thế 'your-repository-name' bằng tên kho lưu trữ GitHub của bạn
const repositoryName = 'your-repository-name';

const nextConfig = {
  reactStrictMode: true, // Có thể giữ hoặc bỏ tùy theo dự án của bạn

  // --- Cấu hình cho GitHub Pages Static Export ---
  output: 'export', // Bắt buộc: Xuất ra các tệp HTML/CSS/JS tĩnh
  images: {
    unoptimized: true, // Bắt buộc: Tắt tối ưu hóa ảnh tích hợp của Next.js cho môi trường export
  },
  basePath: `/${repositoryName}`, // Bắt buộc: Đặt tiền tố đường dẫn là tên repo của bạn
  // assetPrefix: `/${repositoryName}/`, // Thường không cần thiết nếu đã có basePath
  // --- Kết thúc cấu hình cho GitHub Pages ---
};

export default nextConfig;

// Lưu ý: Nếu bạn deploy trang người dùng/tổ chức (ví dụ: <username>.github.io)
// hoặc sử dụng tên miền tùy chỉnh trỏ trực tiếp vào gốc repo,
// bạn có thể không cần đặt 'basePath'. Trong trường hợp đó, hãy xóa hoặc comment dòng 'basePath'.
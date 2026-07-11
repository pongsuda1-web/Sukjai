import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "../components/Providers";

const inter = Inter({ subsets: ["latin", "thai"] });

export const metadata = {
  title: "MindMap — ระบบสารสนเทศการกำกับติดตามและแผนที่คนไข้จิตเวชในชุมชน",
  description: "ระบบติดตามและแผนที่คนไข้จิตเวชชุมชน น่านสุขใจ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

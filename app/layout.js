import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "../components/Providers";

const inter = Inter({ subsets: ["latin", "thai"] });

export const metadata = {
  title: "Nan Sukjai - น่านสุขใจ",
  description: "ระบบติดตามการรักษาและดูแลสุขภาพแบบองค์รวม สำหรับ อสม. แพทย์ และพยาบาลในจังหวัดน่าน",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "น่านสุขใจ",
  },
  icons: {
    apple: "/icon-192.png",
  }
};

export const viewport = {
  themeColor: "#0277bd"
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

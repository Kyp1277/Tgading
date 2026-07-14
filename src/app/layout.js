import { Playfair_Display, Inter, Caveat } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata = {
  title: "KKN UIN Suska Riau 2026 - Kelurahan Tanjung Gading",
  description: "Website resmi Kuliah Kerja Nyata (KKN) UIN Suska Riau 2026 di Kelurahan Tanjung Gading, Kec. Pasir Penyu, Kab. Indragiri Hulu. Bersatu, Maju, Sejahtera.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${playfair.variable} ${inter.variable} ${caveat.variable} h-full antialiasedScroll`}
    >
      <body className="min-h-full bg-white text-[#111e16] font-sans">
        {children}
      </body>
    </html>
  );
}

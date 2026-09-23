import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atlas データをひとつに",
  description:
    "ユーザー、店舗、企業業績、社員情報を閲覧するサンプルダッシュボード",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}

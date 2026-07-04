import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Code2, Gift, Layers, Mic, Sparkles, Sun } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interview Studio",
  description: "Frontend machine-coding and interview workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="topNav">
          <Link className="brand" href="/">
            <span>IS</span>
            Interview Studio
          </Link>
          <nav>
            <div className="navMenu">
              <button>
                <Code2 size={18} />
                Practice
              </button>
              <div className="navDropdown">
                <Link href="/hld">
                  <Layers size={18} />
                  <span>
                    <strong>System Design (HLD)</strong>
                    <small>High-level design</small>
                  </span>
                </Link>
                <Link href="/lld">
                  <Code2 size={18} />
                  <span>
                    <strong>Low Level Design</strong>
                    <small>OOP & machine coding</small>
                  </span>
                </Link>
                <Link href="/frontend">
                  <BookOpen size={18} />
                  <span>
                    <strong>Frontend Coding</strong>
                    <small>UI/UX challenges</small>
                  </span>
                </Link>
                <Link href="/dsa">
                  <Code2 size={18} />
                  <span>
                    <strong>Online Assessment</strong>
                    <small>DSA problems</small>
                  </span>
                </Link>
              </div>
            </div>
            <span className="navItem">
              <Mic size={18} />
              AI Mock
            </span>
            <span className="navItem">
              <BookOpen size={18} />
              Learn
            </span>
            <span className="navItem premium">
              <Sparkles size={18} />
              Premium
            </span>
            <span className="navItem">
              <Gift size={18} />
              Referrals
            </span>
            <span className="navDivider" />
            <button className="iconControl" aria-label="Theme">
              <Sun size={20} />
            </button>
            <span className="avatar">C</span>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}

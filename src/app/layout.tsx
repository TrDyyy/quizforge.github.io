import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const restoreTheme = `(function(){
  function apply(){
    try {
      var root=document.documentElement;
      var theme=localStorage.getItem("quizforge-theme")||"system";
      var accent=localStorage.getItem("quizforge-accent")||"default";
      var dark=theme==="dark"||(theme==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);
      root.classList.toggle("dark",dark);
      if(["teal","amber","rose"].indexOf(accent)>=0)root.dataset.accent=accent;
      else delete root.dataset.accent;
    } catch(e) {}
  }
  apply();
  window.addEventListener("pageshow",apply);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",function(){
    try { if((localStorage.getItem("quizforge-theme")||"system")==="system")apply(); } catch(e) {}
  });
})()`;

export const metadata: Metadata = {
  title: "QuizForge",
  description: "Tạo và ôn luyện bộ câu hỏi trắc nghiệm trên thiết bị của bạn.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={cn("h-full antialiased", "font-sans", geist.variable)}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: restoreTheme }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

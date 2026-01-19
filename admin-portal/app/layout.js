import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { WalletProvider } from "@/contexts/WalletContext";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RBI Admin Portal | Super Authority",
  description: "Super Admin Portal for MyPersona zk-KYC Registry",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen antialiased`}
      >
        <WalletProvider>
          <div className="min-h-screen flex relative">
            <Sidebar />
            <main className="flex-1 ml-70 min-h-screen relative z-10 transition-all duration-300 bg-slate-50">
              {children}
            </main>
          </div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 5000,
              style: {
                background: "#0F172A",
                color: "#fff",
                borderRadius: "8px",
                padding: "16px",
                fontSize: "14px",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              },
              success: {
                iconTheme: { primary: "#10B981", secondary: "#fff" },
                style: { borderLeft: "4px solid #10B981" },
              },
              error: {
                iconTheme: { primary: "#F43F5E", secondary: "#fff" },
                style: { borderLeft: "4px solid #F43F5E" },
              },
            }}
          />
        </WalletProvider>
      </body>
    </html>
  );
}

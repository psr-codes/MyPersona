import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { WalletProvider } from "@/contexts/WalletContext";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MyPersona | Issuer Portal",
  description:
    "Secure KYC credential management for trusted authorities - RBI HaRBInger 2025",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-slate-50 text-gray-800 min-h-screen antialiased`}
      >
        <WalletProvider>
          <div className="min-h-screen flex relative overflow-hidden">
            <Sidebar />
            <main className="flex-1 ml-70 min-h-screen relative z-10 transition-all duration-300">
              {children}
            </main>

            {/* Decorative background elements */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
              <div className="absolute -top-52 -right-52 w-[600px] h-[600px] bg-gradient-radial from-teal-500/8 to-transparent rounded-full" />
              <div className="absolute -bottom-80 left-1/5 w-[800px] h-[800px] bg-gradient-radial from-indigo-500/6 to-transparent rounded-full" />
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, #CBD5E1 1px, transparent 0)",
                  backgroundSize: "40px 40px",
                }}
              />
            </div>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#fff",
                color: "#1E293B",
                borderRadius: "12px",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                padding: "16px",
                fontSize: "14px",
              },
              success: {
                iconTheme: { primary: "#10B981", secondary: "#fff" },
              },
              error: {
                iconTheme: { primary: "#F43F5E", secondary: "#fff" },
              },
            }}
          />
        </WalletProvider>
      </body>
    </html>
  );
}

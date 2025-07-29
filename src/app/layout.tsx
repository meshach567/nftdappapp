import type { Metadata } from "next";
import "./globals.css";
import { Web3Provider } from "@/contexts/Web3Context";
import { AuthProvider } from "@/contexts/AuthContext";
import ClientOnly from "@/components/ClientOnly";

export const metadata: Metadata = {
  title: "NFT Access DApp",
  description: "A DApp that verifies NFT ownership for premium access",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        <ClientOnly>
          <Web3Provider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </Web3Provider>
        </ClientOnly>
      </body>
    </html>
  );
}

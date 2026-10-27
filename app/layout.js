import { Figtree } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
// import { ThemeProvider } from "@/components/theme-provider";

const figtree = Figtree({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dossier",
  description: "Gestion des dossiers du BESD",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${figtree.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

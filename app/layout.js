import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CraftlyAI - AI-Powered Career Coach",
  description: "AI-Powered Career Coach",
};

export default async function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="min-h-screen">{children}</main>
            <Toaster />
            <footer className="bg-muted/50 py-8">
              <div className="container mx-auto px-4 text-center text-gray-200 space-y-2">
                <p className="text-sm">
                  Developed by{" "}
                  <span className="font-semibold">Ubedullakhan Pathan</span>
                </p>
                <p className="text-sm">
                  <a
                    href="https://github.com/Ubed-pathan/craftlyAI"
                    target="_blank"
                    className="underline hover:text-white"
                  >
                    GitHub Repo
                  </a>{" "}
                  |{" "}
                  <a
                    href="https://www.linkedin.com/in/ubed-pathan-35a715242"
                    target="_blank"
                    className="underline hover:text-white"
                  >
                    LinkedIn
                  </a>
                </p>
                <p className="text-xs text-gray-400">
                  &copy; {new Date().getFullYear()} All rights reserved.
                </p>
              </div>
            </footer>
            {/* <footer className="bg-muted/50 py-12">
              <div className="container mx-auto px-4 text-center text-gray-200">
                <p>Developed by Ubedullakhan Pathan, github repo :- https://github.com/Ubed-pathan/craftlyAI, Linkedin: - https://www.linkedin.com/in/ubed-pathan-35a715242</p>
              </div>
            </footer> */}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

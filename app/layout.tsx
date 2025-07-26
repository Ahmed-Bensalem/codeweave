import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ReactNode, Suspense } from "react";
import FullPageLoader from "./components/FullPageLoader";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "CodeWeave",
  description: "Your DevOps + GenAI Copilot",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.png" />
        </head>
        <body>
          <Toaster position="top-right" />
          <Suspense fallback={<FullPageLoader />}>{children}</Suspense>
        </body>
      </html>
    </ClerkProvider>
  );
}

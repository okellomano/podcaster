import LeftSidebar from "@/components/LeftSidebar";
import type { Metadata } from "next";


export const metadata: Metadata = {
    title: "Podcaster",
    description: "Using the power of AI in your podcasts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        <main>
            <LeftSidebar />
            {children}
            <p className="text-white-1">RIGHT SIDEBAR</p>
            
        </main>
    </div>
  );
}

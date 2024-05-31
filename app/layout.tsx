import type { Metadata } from "next"
import { Inter, DM_Sans } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const dmSans = DM_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Perfect pick",
  description: "Enter a book or movie to get personalized recommendations!",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${dmSans.className} bg-gradient-to-bl from-teal-400 to-gray-700 text-white`}>
        <main className="lg:w-2/5 md:w-2/3 sm:w-4/5 w-full mx-auto flex min-h-screen flex-col items-center gap-4 p-4">
          {children}
        </main>
      </body>
    </html>
  )
}

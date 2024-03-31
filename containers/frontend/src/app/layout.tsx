import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'react page',
  description: 'react page',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}

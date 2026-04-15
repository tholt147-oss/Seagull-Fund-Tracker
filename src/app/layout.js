import './globals.css'

export const metadata = {
  title: 'Sea Gull Fund | Salisbury University',
  description: 'Student-managed investment portfolio at Salisbury University\'s Perdue School of Business. Over $2.5 million in assets under management.',
  icons: {
    icon: '/logo.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}

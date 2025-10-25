import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Theme Color for Mobile Browsers */}
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />

        {/* DNS Prefetch for Performance */}
        <link rel="dns-prefetch" href="https://cloud.umami.is" />
        <link
          rel="dns-prefetch"
          href={
            process.env.NEXT_PUBLIC_BACKEND_URL ||
            "https://ecast-backend.tcioe.edu.np"
          }
        />

        {/* Preconnect to External Resources */}
        <link
          rel="preconnect"
          href="https://cloud.umami.is"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href={
            process.env.NEXT_PUBLIC_BACKEND_URL ||
            "https://ecast-backend.tcioe.edu.np"
          }
          crossOrigin="anonymous"
        />

        {/* Umami Analytics Tracking Script */}
        <script
          async
          src="https://cloud.umami.is/script.js"
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
        />

        {/* Verification Tags (Add your verification codes) */}
        {/* <meta name="google-site-verification" content="your-verification-code" /> */}
        {/* <meta name="facebook-domain-verification" content="your-verification-code" /> */}
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

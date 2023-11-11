import { Html, Head, Main, NextScript } from 'next/document'
import { useTranslation } from 'react-i18next';
import { Analytics } from '@vercel/analytics/react';

export default function Document() {

  const { i18n } = useTranslation()

  return (
    <Html lang={i18n.language}>
      <Head />
      <body>
        <Main />
        <NextScript />
        <Analytics mode={process.env.NODE_ENV} />
      </body>
    </Html>
  )
}
import { AppProps } from 'next/app';
import '@/styles/global.css';
import 'antd/dist/antd.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

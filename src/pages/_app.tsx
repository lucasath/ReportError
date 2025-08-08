import ErrorReport from "@/components/ErrorReport";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <ErrorReport endpoint="/api/logs" >
    <Component {...pageProps} />
  </ErrorReport>
}

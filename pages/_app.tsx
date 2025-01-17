import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "../components/Navbar";

import WalletContextProvider from "../contexts/WalletContextProvider";
import TransitionContextProvider from "../contexts/TransitionContextProvider";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Turbin3</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><text y='12' font-size='12'>⚡</text></svg>"
        />
      </Head>
      <WalletContextProvider>
        <Navbar />
        <ToastContainer />
        <TransitionContextProvider>
          <Component {...pageProps} />
        </TransitionContextProvider>
      </WalletContextProvider>
    </>
  );
}

export default MyApp;

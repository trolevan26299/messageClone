/* eslint-disable @next/next/no-page-custom-font */
import type { NextPage } from "next";
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import "../styles/globals.css";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Message Clone</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />
    </div>
  );
};

export default Home;

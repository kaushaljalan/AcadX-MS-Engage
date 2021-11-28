import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import App from "next/app";
import Head from "next/head";
import Router from "next/router";

import PageChange from "components/PageChange/PageChange.js";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/nextjs-argon-dashboard.scss";
import { Context } from '../context';
import {auth} from '../services/firebase';
import { getIdTokenResult } from 'firebase/auth';

Router.events.on("routeChangeStart", (url) => {
  console.log(`Loading: ${url}`);
  document.body.classList.add("body-page-transition");
  ReactDOM.render(
    <PageChange path={url} />,
    document.getElementById("page-transition")
  );
});
Router.events.on("routeChangeComplete", () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
  document.body.classList.remove("body-page-transition");
});
Router.events.on("routeChangeError", () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
  document.body.classList.remove("body-page-transition");
});

const AppWithContext = (props) => {
  const [user, setUser] = useState({});
    useEffect(() => {
      auth.onAuthStateChanged(user => {
        if (user) {
          console.log('ss', getIdTokenResult(user))
          getIdTokenResult(user).then(res => {
            setUser({
              ...user,
              role: res.claims.role,
            })
          })
          
        }
      })
    }, []);
  return <>
    <Context.Provider value={[user, setUser]}>
      {props.children}
    </Context.Provider>
  </>
}

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }
  render() {
    const { Component, pageProps } = this.props;

    const Layout = Component.layout || (({ children }) => <>{children}</>);

    return (
      <React.Fragment>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <title>AcadX</title>
          <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY_HERE"></script>
        </Head>
        <AppWithContext>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AppWithContext>
      </React.Fragment>
    );
  }
}

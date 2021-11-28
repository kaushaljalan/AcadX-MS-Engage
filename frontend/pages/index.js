import React, { Component } from "react";
import Router from "next/router";
import Spinner from 'reactstrap/lib/Spinner';
import { auth } from '../services/firebase';

export default function Index() {
  React.useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user)
        Router.push("/admin/dashboard");
      else
        Router.push("/auth/login");
    })
  }, []);
  
  return <div> <Spinner /> </div>;
}

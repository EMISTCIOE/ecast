import { useEffect } from "react";
import Router from "next/router";

export default function DashboardIndex() {
  useEffect(() => {
    Router.replace("/me");
  }, []);
  return null;
}

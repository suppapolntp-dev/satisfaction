// import Image from "next/image";
// import styles from "./page.module.css";
import LoginPage  from "./(auth)/login/page";
import CustomerPage from "./(page)/customer/page";
import DashboardPage from "./(page)/dashboard/page";

export default function Home() {
  return (
    <> 
     <DashboardPage></DashboardPage>
    </>
  );
}

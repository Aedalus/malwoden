import NavBar from "./navbar";
import Head from "next/head";

const Layout = (props) => (
  <div
    className="Layout"
    style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      width: "100%",
    }}
  >
    <Head>
      <title>Malwoden</title>
    </Head>
    <div
      className="Content"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    ></div>
    <NavBar />
    {props.children}
  </div>
);

export default Layout;

import "../styles/globals.css";
import "../styles/Politicians.css";
import "bootstrap/dist/css/bootstrap.css";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Link from "next/link";
import Button from "react-bootstrap/Button";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar bg="light" expand="md">
        <Navbar.Brand>
          <h1 className="fs-4 p-2">Political Data Explorer</h1>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Link href="/">
              <Button variant="link">Home</Button>
            </Link>
            <Link href="/elections/senate">
              <Button variant="link">Senate Data</Button>
            </Link>
            <Link href="/elections/house">
              <Button variant="link">House Data</Button>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

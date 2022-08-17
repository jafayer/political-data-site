import styles from "../styles/Home.module.css";
import houseData from "../public/elections/enriched-data-by-state.json";
import senateData from "../public/elections/enriched-senate-data-by-state.json";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="d-flex justify-content-center align-items-center p-4">
      <div className="container">
        <h1 className="text-center">Politican Data Browser</h1>
        <div className="row">
          <div className="col-lg-8 m-auto mt-5 fs-5">
            <p>
              This site contains public data about every 2022 congressional and
              state election in the country.
            </p>
            <p>
              These data include an overview of each candidate&apos;s spending,
              raising, and cash on hand from public FEC filings, as well as up
              to date polls on the race.
            </p>
            <p>
              Polls are sourced courtesy of FiveThirtyEight, and FEC data is
              pulled and cached directly from the{" "}
              <a href="https://api.open.fec.gov/">FEC API endpoint.</a>
            </p>
            <p>
              <Link href="/elections/house">Click here</Link> to browse House
              data.
            </p>
            <p>
              <Link href="/elections/senate">Click here</Link> to browse Senate
              data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { FaArrowLeft } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Rectangle,
} from "recharts";
import {
  convertSenateRatingToWords,
  mapStateCodeToName,
} from "../../helpers/modLegislators";
import { convertDateRangeToString } from "../../helpers/convertDateRangeToString";
import Link from "next/link";
import Head from "next/head";

const colors = {
  "DEMOCRATIC PARTY": {
    total_receipts: "#1565C0",
    cash_on_hand_end_period: "#1E88E5",
    total_disbursements: "#2979FF",
    pct: "#1565C0",
  },
  "REPUBLICAN PARTY": {
    total_receipts: "#D32F2F",
    cash_on_hand_end_period: "#EF5350",
    total_disbursements: "#FF8A80",
    pct: "#D32F2F",
  },
  "GREEN PARTY": {
    total_receipts: "#388E3C",
    cash_on_hand_end_period: "#4CAF50",
    total_disbursements: "#00E676",
    pct: "#388E3C",
  },
  other: {
    total_receipts: "#FFA000",
    cash_on_hand_end_period: "#FFB300",
    total_disbursements: "#FFAB00",
    pct: "#FFA000",
  },
};

export default function DistrictPage({
  data,
  polls,
  results,
  state,
  type,
  district,
}) {
  const [activePoll, setActivePoll] = useState(null);
  useEffect(() => {
    if (polls) {
      setActivePoll(polls[0]);
    }
  });
  console.log(results);
  return (
    <>
      <Head>
        <title>{`Race Overview: ${type === "house" ? district : state}`}</title>
        <meta
          description={`Overview of the 2022 ${type} race in ${
            type === "house" ? district : state
          }. ${results.length > 0 && results[0].candidate_name} (${
            results.length > 0 && results[0].party_full.slice(0, 1)
          }) leads in fundraising. ${
            polls.length
          } polls availble for this race.`}
        />
      </Head>

      <div className="p-4">
        <Link href={`/elections/${type}`}>
          <Button variant="primary">
            <>
              <FaArrowLeft />
              <p className="d-inline p-1">Back</p>
            </>
          </Button>
        </Link>
        <div className="text-center">
          <h1>{type === "house" ? district : state}</h1>
          <p>
            <span className="fw-bold">Incumbent:</span> {data.incumbent} (
            {data.party})
          </p>
          <p>
            <span className="fw-bold">Cook PVI:</span>{" "}
            {type === "house"
              ? data["2022_pvi"]
              : convertSenateRatingToWords(data["2022_pvi"])}
          </p>
          <div>
            <h2 className="text-center">Financial Overview</h2>
            {results && (
              <div
                className="d-flex justify-content-center align-center m-auto"
                style={{ height: 500, width: 900, maxWidth: "100%" }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    width={500}
                    height={300}
                    data={results}
                    margin={{
                      top: 5,
                      right: 0,
                      left: 25,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="candidate_name" fontSize={12} />
                    <YAxis />
                    <Tooltip formatter={formatDollars} />
                    <Legend />
                    <ReferenceLine y={0} stroke="#000" />
                    <Bar dataKey="total_receipts" shape={customBar} />
                    <Bar dataKey="cash_on_hand_end_period" shape={customBar} />
                    <Bar dataKey="total_disbursements" shape={customBar} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          <div className="mt-4">
            <h2 className="text-center">Polling Overview</h2>
            <div className="d-flex justify-content-center align-items-center w-50 m-auto mt-2">
              {activePoll && (
                <select
                  className="form-select"
                  onChange={(e) => {
                    const activePoll = polls.find(
                      (poll) => poll.id === e.target.value
                    );

                    setActivePoll(activePoll);
                  }}
                >
                  {polls.map((poll) => {
                    const candidates = poll.answers
                      .map((answer) => {
                        return answer.choice;
                      })
                      .join(" vs. ");

                    return (
                      <option key={poll.id} value={poll.id}>
                        {`[${convertDateRangeToString(
                          poll.startDate,
                          poll.endDate
                        )}] ${candidates} (${poll.pollster})`}
                      </option>
                    );
                  })}
                </select>
              )}
            </div>
            <div>
              {activePoll && (
                <div
                  className="d-flex justify-content-center align-items-center m-auto"
                  style={{ height: 500, width: 800, maxWidth: "100%" }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={500}
                      height={300}
                      data={activePoll.answers}
                      margin={{
                        top: 5,
                        right: 0,
                        left: 25,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="candidate_name" fontSize={12} />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <ReferenceLine y={0} stroke="#000" />
                      <Bar dataKey="pct" shape={customBar} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              {!activePoll && <p>No polls available</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  function formatDollars(dollars) {
    return "$" + dollars.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  }

  function customBar(props) {
    let party = props["party_full"] || props["party"];

    if (party) {
      party = party.toUpperCase();
      if (party === "DEM") {
        party = "DEMOCRATIC PARTY";
      } else if (party === "REP") {
        party = "REPUBLICAN PARTY";
      } else if (party === "GRN") {
        party = "GREEN PARTY";
      }
    }

    const type = props.tooltipPayload[0].dataKey;

    // select colors based on party and type,
    // or if party is not found, use "other"
    const color = colors[party] ? colors[party][type] : colors["other"][type];
    return <Rectangle {...props} fill={color} />;
  }
}

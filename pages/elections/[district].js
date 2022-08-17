import { useState, useEffect } from "react";
import electionData from "../../public/elections/enriched-data-by-state.json";
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
import { queryHousePollingData } from "../../helpers/pollingData";
import { mapStateCodeToName } from "../../helpers/modLegislators";
import { convertDateRangeToString } from "../../helpers/convertDateRangeToString";

const states = Object.keys(electionData);
const allDistricts = [];
states.forEach((state) => {
  const districts = Object.keys(electionData[state]);
  districts.forEach((district) => {
    allDistricts.push(electionData[state][district]);
  });
});
const allDistrictsSorted = allDistricts.sort((a, b) => {
  const aPvi = a["2022_pvi"];
  const bPvi = b["2022_pvi"];

  const aPviStripped = aPvi === "EVEN" ? 0 : parseInt(aPvi.split("+")[1]);
  const bPviStripped = bPvi === "EVEN" ? 0 : parseInt(bPvi.split("+")[1]);

  // sort by smallest
  return aPviStripped - bPviStripped;
});

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

export default function DistrictPage({ district, data, polls }) {
  const [results, setResults] = useState([]);
  const [activePoll, setActivePoll] = useState(null);

  useEffect(() => {
    const results = data.results;
    // for all results, make result.total_disbursements negative

    const resultsWithNegativeDisbursements = results.map((result) => {
      const { total_disbursements } = result;
      const negativeDisbursements = -total_disbursements;
      return { ...result, total_disbursements: negativeDisbursements };
    });
    setResults(resultsWithNegativeDisbursements);

    if (polls) {
      setActivePoll(polls[0]);
    }
    console.log(polls, activePoll);
  }, []);
  return (
    <div className="p-4">
      <Button href="/elections" variant="primary">
        <>
          <FaArrowLeft />
          <p className="d-inline p-1">Back</p>
        </>
      </Button>
      <div className="text-center">
        <h1>{district}</h1>
        <p>
          <span className="fw-bold">Incumbent:</span> {data.incumbent}
        </p>
        <p>
          <span className="fw-bold">Cook PVI:</span> {data["2022_pvi"]}
        </p>
        <div>
          <h2 className="text-center">Financial Overview</h2>
          {results && (
            <div
              className="d-flex justify-content-center align-center m-auto"
              style={{ height: 500, width: 900 }}
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
                  console.log({ activePoll });
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
                      )}] ${candidates}`}
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
                style={{ height: 500, width: 800 }}
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

export async function getStaticProps({ params }) {
  const data = allDistricts.find(
    (district) => district.dist === params.district
  );

  const [state, district] = params.district.split("-");

  const newPolls = await queryHousePollingData(
    mapStateCodeToName(state),
    district
  );

  // sort by newest date
  const sortedNewPolls = newPolls.sort((a, b) => {
    return b["created_at"] - a["created_at"];
  });

  return {
    props: {
      district: params.district,
      data,
      polls: sortedNewPolls,
    },
  };
}

export async function getStaticPaths() {
  const paths = allDistrictsSorted.map((district) => {
    return {
      params: {
        district: district.dist,
        data: district,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
}

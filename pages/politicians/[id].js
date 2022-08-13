import { useRouter } from "next/router";
import { politicians } from "./index";
import { useEffect, useState } from "react";

export default function Politician({ politician }) {
  const [primaryCampaignCommittee, setPrimaryCampaginCommittee] = useState([]);
  const currentTerm = politician.terms[politician.terms.length - 1];
  const { party, state, type, district } = currentTerm;
  const candidate_id = politician.id.fec[politician.id.fec.length - 1];

  useEffect(() => {
    console.log({ candidate_id });
    const url = `http://localhost:3000/api/fec/committee?candidate_id=${candidate_id}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setPrimaryCampaginCommittee(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <id>
      <h1>Politician</h1>
      <h2>{politician.name.official_full}</h2>
      <h3>{`${party[0]}-${state}`}</h3>
      {primaryCampaignCommittee && (
        <>
          <p>
            Primary committee name: {primaryCampaignCommittee.committee_name}
          </p>
          <p>
            Cash on hand: $
            {primaryCampaignCommittee.last_cash_on_hand_end_period}
          </p>
          <p>Contributions: ${primaryCampaignCommittee.net_contributions}</p>
          <p>Spent: ${primaryCampaignCommittee.disbursements}</p>
          <p>Last Updated: {primaryCampaignCommittee.coverage_end_date}</p>
        </>
      )}
    </id>
  );
}

export async function getStaticProps({ params }) {
  const req = await fetch("http://localhost:3000/legislators-current.json");
  const data = await req.json();
  const politician = data.filter(
    (politician) => politician.id.bioguide === params.id
  )[0];
  return {
    props: {
      politician,
    },
  };
}

export async function getStaticPaths() {
  const req = await fetch("http://localhost:3000/legislators-current.json");
  const data = await req.json();

  const paths = data.map((politician) => ({
    params: { id: politician.id.bioguide },
  }));

  return {
    paths,
    fallback: false,
  };
}

import { useRouter } from "next/router";
import { politicians } from "./index";
import { useEffect, useState } from "react";
import legislatorsCurrent from "../../../public/legislators-current.json";
import PoliticianImage from "../../../helpers/getPoliticianImage";
import { parsePollingData } from "../../../helpers/pollingData";
import { mapStateCodeToName } from "../../../helpers/modLegislators";

export default function Politician({ politician, polls }) {
  const [primaryCampaignCommittee, setPrimaryCampaginCommittee] = useState({});
  const [candidatePolls, setCandidatePolls] = useState([]);
  const currentTerm = politician.terms[politician.terms.length - 1];
  const { party, state, type, district } = currentTerm;
  const candidate_id = politician.id.fec[politician.id.fec.length - 1];

  useEffect(() => {
    const url = `/api/fec/committee?candidate_id=${candidate_id}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setPrimaryCampaginCommittee(data);
      })
      .catch((err) => {
        console.log(err);
      });

    setCandidatePolls(polls);
  }, []);

  return (
    <div className="p-3">
      <h2 className="text-center">{politician.name.official_full}</h2>
      <h3 className="text-center">{`${
        type == "sen" ? "Senator" : "Representative"
      } ${party[0]}-${state}`}</h3>
      <div className="text-center">
        <PoliticianImage
          politician={politician}
          dimensions={{ w: 150, h: 150 }}
        />
      </div>

      <p>Primary committee name: {primaryCampaignCommittee.committee_name}</p>
      <p>
        Cash on hand: ${primaryCampaignCommittee.last_cash_on_hand_end_period}
      </p>
      <p>Contributions: ${primaryCampaignCommittee.net_contributions}</p>
      <p>Spent: ${primaryCampaignCommittee.disbursements}</p>
      <p>Last Updated: {primaryCampaignCommittee.coverage_end_date}</p>
    </div>
  );
}

export async function getStaticProps({ params }) {
  // get polling data

  const politician = legislatorsCurrent.filter(
    (politician) => politician.id.bioguide === params.id
  )[0];

  const polls = parsePollingData(politician);
  return {
    props: {
      politician,
      polls,
    },
  };
}

export async function getStaticPaths() {
  const paths = legislatorsCurrent.map((politician) => ({
    params: { id: politician.id.bioguide },
  }));

  return {
    paths,
    fallback: false,
  };
}

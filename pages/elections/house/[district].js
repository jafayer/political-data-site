import electionData from "../../../public/elections/enriched-data-by-state.json";
import { mapStateCodeToName } from "../../../helpers/modLegislators";
import { sortSenateDistricts } from "../../../helpers/sortDistricts";
import RacePage from "../../../components/elections/RacePage";
import { useEffect, useState } from "react";

const states = Object.keys(electionData);
const allDistricts = [];
states.forEach((state) => {
  const districts = Object.keys(electionData[state]);
  districts.forEach((district) => {
    allDistricts.push(electionData[state][district]);
  });
});
const allDistrictsSorted = sortSenateDistricts(allDistricts);

export default function DistrictPage({ data, type, district }) {
  const [polls, setPolls] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch(`/api/fiveThirtyEight?type=${type}`)
      .then((data) => data.json())
      .then((polls) => {
        const sortedPolls = polls.sort((a, b) => {
          const aDate = new Date(a.created_at);
          const bDate = new Date(b.created_at);
          return bDate - aDate;
        });

        const statePolls = sortedPolls.filter((poll) => {
          const [stateCode, districtNumber] = district.split("-");
          const stateName = mapStateCodeToName(stateCode);
          return (
            poll.state === stateName &&
            parseInt(poll.district) === parseInt(districtNumber)
          );
        });

        console.log(statePolls);

        setPolls(statePolls);
      });
    const results = data.results;
    // for all results, make result.total_disbursements negative

    const resultsWithNegativeDisbursements = results.map((result) => {
      const { total_disbursements } = result;
      const negativeDisbursements = -total_disbursements;
      return { ...result, total_disbursements: negativeDisbursements };
    });
    setResults(resultsWithNegativeDisbursements);
  }, []);

  return (
    <RacePage
      data={data}
      results={results}
      polls={polls}
      type={type}
      district={district ? district : null}
    />
  );
}

export async function getStaticProps({ params }) {
  const data = allDistrictsSorted.find((district) => {
    const [stateCode, districtNumber] = district.dist.split("-");
    const stateName = mapStateCodeToName(stateCode);

    console.log({ stateName, districtNumber, district: district.dist });
    return district.dist === params.district;
  });

  return {
    props: {
      type: "house",
      data,
      district: data.dist,
    },
  };
}

export async function getStaticPaths() {
  const paths = allDistrictsSorted.map((district) => {
    return {
      params: {
        district: district.dist,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
}

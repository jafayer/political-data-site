import electionData from "../../../public/elections/enriched-senate-data-by-state.json";
import ElectionsHome from "../../../components/elections/ElectionsHome";
import { useEffect, useState } from "react";

export default function HouseHome(props) {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    fetch("/api/fiveThirtyEight?type=senate")
      .then((res) => {
        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        setPolls(data);
        console.log("what about this?", data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return <ElectionsHome type="senate" data={props.data} polls={polls} />;
}

export async function getStaticProps() {
  return {
    props: {
      data: electionData,
    },
  };
}

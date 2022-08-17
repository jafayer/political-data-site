import List from "../../politicians/List";
import { useState, useEffect } from "react";
import { getFormattedLegislators } from "../../../helpers/modLegislators";
import Fuse from "fuse.js";

export default function Politicians({ politicians }) {
  const [filterText, setFilterText] = useState("");
  const [filteredPoliticians, setFilteredPoliticians] = useState([]);

  useEffect(() => {
    setFilteredPoliticians(politicians);
  }, []);

  const fuse = new Fuse(politicians, {
    keys: [
      { name: "name", getFn: (politician) => politician.name.official_full },
      {
        name: "state",
        getFn: (politician) => {
          const currentTerm = politician?.terms[politician?.terms?.length - 1];
          const { party, state, type } = currentTerm;
          return state;
        },
      },
      {
        name: "party",
        getFn: (politician) => {
          const currentTerm = politician?.terms[politician?.terms?.length - 1];
          const { party, state, type } = currentTerm;
          return party;
        },
      },
    ],
    threshold: 0.4,
  });

  const senators = filteredPoliticians.filter(
    (politician) => politician.terms[politician.terms.length - 1].type === "sen"
  );
  const representatives = filteredPoliticians.filter(
    (politician) => politician.terms[politician.terms.length - 1].type === "rep"
  );

  return (
    <div className="container">
      <h1 className="title">Politicians</h1>
      <div className="searchbar">
        <input
          type="text"
          placeholder="Search by name, state, or party"
          value={filterText}
          onChange={(e) => {
            setFilterText(e.target.value);
            const result = fuse.search(e.target.value).map((item) => item.item);
            if (e.target.value === "") {
              setFilteredPoliticians(politicians);
            } else {
              setFilteredPoliticians(result);
            }
          }}
        />
      </div>
      <div className="subtitle">Senators</div>
      <List politicians={senators} type={"sens"} />
      <div className="subtitle">Representative</div>
      <List politicians={representatives} type={"reps"} />
    </div>
  );
}

export async function getStaticProps({ params }) {
  return {
    props: {
      politicians: getFormattedLegislators(),
    },
  };
}

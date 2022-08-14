import List from "../../components/politicians/List";
import legislatorsCurrent from "../../public/legislators-current.json";
import { useState, useEffect } from "react";

import Fuse from "fuse.js";
const usStates = [
  ["Alabama", "AL"],
  ["Alaska", "AK"],
  ["Arizona", "AZ"],
  ["Arkansas", "AR"],
  ["California", "CA"],
  ["Colorado", "CO"],
  ["Connecticut", "CT"],
  ["Delaware", "DE"],
  ["Florida", "FL"],
  ["Georgia", "GA"],
  ["Hawaii", "HI"],
  ["Idaho", "ID"],
  ["Illinois", "IL"],
  ["Indiana", "IN"],
  ["Iowa", "IA"],
  ["Kansas", "KS"],
  ["Kentucky", "KY"],
  ["Louisiana", "LA"],
  ["Maine", "ME"],
  ["Maryland", "MD"],
  ["Massachusetts", "MA"],
  ["Michigan", "MI"],
  ["Minnesota", "MN"],
  ["Mississippi", "MS"],
  ["Missouri", "MO"],
  ["Montana", "MT"],
  ["Nebraska", "NE"],
  ["Nevada", "NV"],
  ["New Hampshire", "NH"],
  ["New Jersey", "NJ"],
  ["New Mexico", "NM"],
  ["New York", "NY"],
  ["North Carolina", "NC"],
  ["North Dakota", "ND"],
  ["Ohio", "OH"],
  ["Oklahoma", "OK"],
  ["Oregon", "OR"],
  ["Pennsylvania", "PA"],
  ["Rhode Island", "RI"],
  ["South Carolina", "SC"],
  ["South Dakota", "SD"],
  ["Tennessee", "TN"],
  ["Texas", "TX"],
  ["Utah", "UT"],
  ["Vermont", "VT"],
  ["Virginia", "VA"],
  ["Washington", "WA"],
  ["West Virginia", "WV"],
  ["Wisconsin", "WI"],
  ["Wyoming", "WY"],
];

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
  const politicians = legislatorsCurrent.map((politician) => {
    // convert state into an array of both state prefix and state name
    return {
      ...politician,
      terms: politician.terms.map((term) => {
        const { state } = term;
        const statePrefix = usStates.find((item) => item[1] === state);
        return {
          ...term,
          state: statePrefix ? statePrefix : state,
        };
      }),
    };
  });
  return {
    props: {
      politicians,
    },
  };
}

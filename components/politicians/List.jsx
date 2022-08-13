import { useEffect, useState } from "react";
import styles from "../../styles/Politicians.module.css";
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

export default function List({ politicians, type }) {
  const [offset, setOffset] = useState(0);
  const [activeState, setActiveState] = useState("");
  const [politicianList, setPoliticianList] = useState([]);

  const fuse = new Fuse(politicians, {
    keys: [
      { name: "full_name", getFn: (item) => item.name.official_full },
      {
        name: "state",
        getFn: (item) => {
          const currentTerm = item.terms[item.terms.length - 1];
          const { state } = currentTerm;
          return state;
        },
      },
    ],
    ignoreLocation: true,
    threshold: 0.5,
  });

  useEffect(() => {
    setPoliticianList(politicians);
  }, []);

  return (
    <div className={styles.list}>
      <div className={styles.selectState}>
        <input
          className={styles.selector}
          placeholder="Type a state to filter by state"
          onChange={(e) => {
            handleFilterByState(e.target.value);
          }}
          value={activeState}
        />
      </div>
      <ul className={styles.ul}>
        {politicianList.map((politician) => {
          const currentTerm = politician?.terms[politician?.terms?.length - 1];
          const { party, state, type } = currentTerm;
          return (
            <li className={styles.li} key={`${politician.id.bioguide}-${type}`}>
              <a href={`/politicians/${politician.id.bioguide}`}>
                <img
                  style={{ width: "300px" }}
                  src={`https://theunitedstates.io/images/congress/original/${politician.id.bioguide}.jpg`}
                  alt={politician.name.official_full}
                />
                <div>
                  <h2>{politician.name.official_full}</h2>
                </div>
              </a>
            </li>
          );
        })}
      </ul>
      <div className={styles.controls}>
        <button
          className={styles.control}
          onClick={back}
          disabled={offset - 5 < 0}
        >
          Back
        </button>
        <button
          className={styles.control}
          onClick={forward}
          disabled={offset + 5 >= politicianList.length}
        >
          Forward
        </button>
      </div>
    </div>
  );

  function back() {
    if (offset > 0) {
      setOffset(offset - 5);
    } else {
      setOffset(0);
    }
  }

  function forward() {
    if (offset + 5 < politicianList.length) {
      setOffset(offset + 5);
      // preload images for the next 5 politicians
      const nextPoliticians = politicianList.slice(offset + 5, offset + 10);
      nextPoliticians.forEach((politician) => {
        if (politician) {
          preloadImages(politician);
        }
      });
    } else {
      setOffset(offset);
    }
  }

  function preloadImages(politician) {
    const { id } = politician;
    const img = new Image();
    img.src = `https://theunitedstates.io/images/congress/original/${id.bioguide}.jpg`;
    return img;
  }

  function handleFilterByState(value) {
    const result = fuse.search(value);
    console.log(result);
    setPoliticianList(result);
    setActiveState(value);

    const newPoliticianList = politicians.filter((politician) => {
      const currentTerm = politician.terms[politician.terms.length - 1];
      const { state } = currentTerm;
      return state === value;
    });
    setPoliticianList(newPoliticianList);
  }
}

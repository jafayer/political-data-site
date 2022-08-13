import styles from "../../styles/Politicians.module.css";

export default function Politicians({ politicians }) {
  const senators = politicians.filter(
    (politician) => politician.terms[politician.terms.length - 1].type === "sen"
  );
  const representatives = politicians.filter(
    (politician) => politician.terms[politician.terms.length - 1].type === "rep"
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Politicians</h1>
      <div>
        <button></button>
      </div>
      <div className={styles.subtitle}>Senators</div>
      <ul className={styles.ul}>
        {senators.slice(0, 5).map((politician) => {
          const currentTerm = politician.terms[politician.terms.length - 1];
          const { party, state, type } = currentTerm;
          if (type === "sen") {
            return (
              <li className={styles.li} key={politician.name.official_full}>
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
          }
        })}
      </ul>
      <div className={styles.subtitle}>Representative</div>
      <ul className={styles.ul}>
        {representatives.slice(0, 5).map((politician) => {
          const currentTerm = politician.terms[politician.terms.length - 1];
          const { party, state, type } = currentTerm;
          if (type === "rep") {
            return (
              <li className={styles.li} key={politician.name.official_full}>
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
          }
        })}
      </ul>
    </div>
  );
}

export async function getStaticProps() {
  const req = await fetch("http://localhost:3000/legislators-current.json");
  const data = await req.json();
  return {
    props: {
      politicians: data,
    },
  };
}

import styles from "../../styles/Politicians.module.css";
import List from "../../components/politicians/List";
import legislatorsCurrent from "../../public/legislators-current.json";

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
      <div className={styles.subtitle}>Senators</div>
      <List politicians={senators} type="sens" />
      <div className={styles.subtitle}>Representative</div>
      <List politicians={representatives} type="reps" />
    </div>
  );
}

export async function getStaticProps({ params }) {
  return {
    props: {
      politicians: legislatorsCurrent,
    },
  };
}

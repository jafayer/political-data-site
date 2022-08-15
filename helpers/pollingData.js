import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";

export function parsePollingData(politician) {
  const currentTerm = politician.terms[politician.terms.length - 1];
  const { party, state, type, district } = currentTerm;
  const name = politician.name.official_full;

  const path = type === "sen" ? "senator" : "representative";

  const paths = {
    senator: {
      historic: "public/polls/senate_polls_historical.csv",
      recent: "public/polls/house_polls.csv",
    },
    representative: {
      historic: "public/polls/house_polls_historical.csv",
      recent: "public/polls/house_polls.csv",
    },
  };
  const historic = readFileSync(paths[path].historic, "utf8");

  const recent = readFileSync(paths[path].recent, "utf8");

  const historicPolls = parse(historic, {
    columns: true,
  });
  const recentPolls = parse(recent, {
    columns: true,
  });

  const allPolls = [...historicPolls, ...recentPolls];

  const candidatePolls = allPolls.reduce((accu, poll) => {
    // if (poll.candidate_name === name), group all polls with same poll_id
    if (poll.candidate_name === name) {
      const sameID = allPolls
        .filter((p) => p.poll_id === poll.poll_id)
        .sort((a, b) => {
          return new Date(a.created_at) - new Date(b.created_at);
        });

      const grouped = {
        pollID: poll.poll_id,
        polls: sameID,
        createdAt: poll.created_at,
      };

      console.log(grouped);

      return [...accu, grouped];
    } else {
      return accu;
    }
  }, []);

  console.log(candidatePolls);
  return candidatePolls;
}

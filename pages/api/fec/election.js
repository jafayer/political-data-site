export default async function handler(req, res) {
  const { state, district, type } = req.query;
  const results = await getElectionResults(state, district, type);
  res.status(200).json(results);
}

async function getElectionResults(state, district, type) {
  const url = `https://api.open.fec.gov/v1/elections/?sort_null_only=false&page=1&election_full=false&state=${state}&per_page=20&sort_nulls_last=false&district=${district}&cycle=2022&api_key=${
    process.env.FEC_API_KEY
  }&sort=-total_receipts&office=${
    type === "rep" ? "house" : "senate"
  }&sort_hide_null=false`;
  const response = await fetch(url);
  const data = await response.json();
  const { results } = data;
  return results;
}

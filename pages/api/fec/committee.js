export default async function handler(req, res) {
  const { candidate_id } = req.query;

  const result = await getFinancialResultsForCommittee(candidate_id);
  res.status(200).json(result);
}

async function getFinancialResultsForCommittee(candidate_id) {
  const committeeURL = `https://api.open.fec.gov/v1/candidate/${candidate_id}/committees/?sort_null_only=false&page=1&sort_nulls_last=false&per_page=20&api_key=${process.env.FEC_API_KEY}&sort=name&sort_hide_null=false`;
  const response = await fetch(committeeURL);
  const data = await response.json();
  const { results } = data;
  // get result where designation = "P"
  const committee = results.filter(
    (committee) => committee.designation === "P"
  )[0];

  // now that we have committee,
  // get financial results for committee
  const financialURL = `https://api.open.fec.gov/v1/committee/${committee.committee_id}/totals/?sort_null_only=false&api_key=${process.env.FEC_API_KEY}&sort=-cycle&sort_nulls_last=false&per_page=20&page=1&sort_hide_null=false`;
  const financialResponse = await fetch(financialURL);
  const financialData = await financialResponse.json();
  const result = financialData.results[0];
  return result;
}

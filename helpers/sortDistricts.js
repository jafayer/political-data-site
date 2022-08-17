export function sortHouseDistricts(districts) {
  return districts.sort((a, b) => {
    const aPvi = a["2022_pvi"];
    const bPvi = b["2022_pvi"];

    const aPviStripped = aPvi === "EVEN" ? 0 : parseInt(aPvi.split("+")[1]);
    const bPviStripped = bPvi === "EVEN" ? 0 : parseInt(bPvi.split("+")[1]);

    // sort by smallest
    return aPviStripped - bPviStripped;
  });
}

export function sortSenateDistricts(districts) {
  return districts.sort((a, b) => {
    const aPvi = parseInt(a["2022_pvi"]);
    const bPvi = parseInt(b["2022_pvi"]);

    // aPvi and bPvi are integers from -3 to 3

    // sort by closest to 0
    return Math.abs(aPvi) - Math.abs(bPvi);
  });
}

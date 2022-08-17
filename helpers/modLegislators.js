import legislatorsCurrent from "../public/legislators-current.json";

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

export function getFormattedLegislators() {
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

  return politicians;
}

export function mapStateCodeToName(code) {
  const state = usStates.find((item) => item[1] === code);
  return state ? state[0] : code;
}

export function mapStateNameToCode(name) {
  const state = usStates.find((item) => item[0] === name);
  return state ? state[1] : name;
}

export function convertSenateRatingToWords(cookPVI) {
  const rating = parseInt(cookPVI);
  switch (rating) {
    case 0:
      return "Toss-up";
    case 1:
      return "Lean D";
    case 2:
      return "Likely D";
    case 3:
      return "Solid D";
    case -1:
      return "Lean R";
    case -2:
      return "Likely R";
    case -3:
      return "Solid R";
  }
}

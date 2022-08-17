import { parse } from "csv-parse/sync";
import houseData from "../public/polls/house_polls_08162022.json";

export function queryHousePollingData(state, district) {
  const filtered = houseData.filter((poll) => {
    const seatNumber = poll["seat_name"].split(" ")[1].trim();

    return (
      poll.state === state && parseInt(poll.district) === parseInt(district)
    );
  });

  console.log({ state, district, filtered });

  return filtered;
}

export function hasPollsForDistrict(state, district) {
  const filtered = houseData.filter((poll) => {
    return (
      poll.state === state && parseInt(poll.district) === parseInt(district)
    );
  }).length;

  console.log({ state, district, filtered });

  return filtered > 0;
}

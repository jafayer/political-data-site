import houseData from "../public/polls/house_polls_08162022.json";

export function queryHousePollingData(state, district) {
  const filtered = houseData.filter((poll) => {
    const seatNumber = poll["seat_name"].split(" ")[1].trim();

    return (
      poll.state === state && parseInt(poll.district) === parseInt(district)
    );
  });

  return filtered;
}

export function hasPollsForDistrict(state, district) {
  const filtered = houseData.filter((poll) => {
    return (
      poll.state === state && parseInt(poll.district) === parseInt(district)
    );
  }).length;

  return filtered > 0;
}

export function hasPolls(polls, state, type, district = null) {
  // if senate, just check state for equality
  // if house, check state and district for equality
  if (type === "senate") {
    return (
      polls.filter((poll) => {
        return poll.state === state;
      }).length > 0
    );
  } else if (type === "house") {
    const matchedPolls = polls.filter((poll) => {
      return (
        poll.state === state && parseInt(poll.district) === parseInt(district)
      );
    });
    return matchedPolls.length > 0;
  }
}

export function queryPollingData(polls, state, type, district = null) {
  // if senate, just check state for equality
  // if house, check state and district for equality
  if (type === "senate") {
    return polls.filter((poll) => {
      return poll.state === state;
    });
  } else if (type === "house") {
    const matchedPolls = polls.filter((poll) => {
      return (
        poll.state === state && parseInt(poll.district) === parseInt(district)
      );
    });
    return matchedPolls;
  }
}

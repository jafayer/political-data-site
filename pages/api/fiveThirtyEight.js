// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import cache from "memory-cache";

export default async function handler(req, res) {
  // first check cache for type. If we have the data in cache, don't fetch it agai
  const { type } = req.query;
  const cached = cache.get(type);
  if (cached) {
    console.log("serving from cache");
    return res.status(200).json(cached);
  }

  if (type === "senate") {
    const senateData = await getFiveThirtyEightData("senate");
    cache.put(type, senateData, 1000 * 60 * 60 * 24);
    return res.status(200).json(senateData);
  } else if (type === "house") {
    const houseData = await getFiveThirtyEightData("house");
    cache.put(type, houseData, 1000 * 60 * 60 * 24);
    return res.status(200).json(houseData);
  }
}

async function getFiveThirtyEightData(type) {
  const response = fetch(
    `https://projects.fivethirtyeight.com/polls/${type}/2022/polls.json`
  ).then((data) => data.json());
  console.log({ response });
  return response;
}

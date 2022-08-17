import { useState, useEffect } from "react";
import { hasPollsForDistrict, hasPolls } from "../../helpers/pollingData";
import {
  mapStateCodeToName,
  convertSenateRatingToWords,
} from "../../helpers/modLegislators";
import StateData from "../../components/elections/StateData";
import Accordion from "react-bootstrap/Accordion";
import Table from "react-bootstrap/Table";
import { Button } from "react-bootstrap";
import {
  sortHouseDistricts,
  sortSenateDistricts,
} from "../../helpers/sortDistricts";
import Link from "next/link";

export default function ElectionsHome({ data, polls, type }) {
  const states = Object.keys(data);

  const [closestDistricts, setClosestDistricts] = useState([]);

  useEffect(() => {
    const allDistricts = [];
    states.forEach((state) => {
      const districts = Object.keys(data[state]);
      districts.forEach((district) => {
        allDistricts.push(data[state][district]);
      });
    });
    const allDistrictsSorted =
      type === "house"
        ? sortHouseDistricts(allDistricts)
        : sortSenateDistricts(allDistricts);

    setClosestDistricts(allDistrictsSorted.slice(0, 50));
  }, []);

  return (
    <div>
      <h1 className="text-center">Elections</h1>
      <div className="container mt-5">
        <div className="row text-center">
          <h2>Closest Races</h2>
        </div>
        <div className="row d-flex align-items-center justify-content-center">
          <div
            className="col-lg-8 col-md-12"
            style={{ maxHeight: 500, overflowY: "scroll" }}
          >
            <Table>
              <thead>
                <tr>
                  <th>district</th>
                  <th>Cook PVI</th>
                  <th>Incumbent</th>
                  <th>Top Candidate By Fundraising</th>
                  <th>Polling Available?</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {closestDistricts.map((district) => {
                  const { dist, incumbent } = district;
                  const topCandidate = district["results"][0].candidate_name;
                  const cookPVI = district["2022_pvi"];
                  const [state, districtNumber] = dist.split("-");
                  const stateName = mapStateCodeToName(state);
                  const hasPollsForRace = hasPolls(
                    polls,
                    stateName,
                    type,
                    type === "house" ? districtNumber : null
                  );

                  return (
                    <tr key={`top-table-${dist}`}>
                      <td>{type === "house" ? dist : stateName}</td>
                      <td>
                        {type === "house"
                          ? cookPVI
                          : convertSenateRatingToWords(cookPVI)}
                      </td>
                      <td>{incumbent}</td>
                      <td>{topCandidate}</td>
                      <td>{hasPollsForRace ? "Yes" : "No"}</td>
                      <td>
                        <Link
                          href={`/elections/${type}/${
                            type === "house"
                              ? dist
                              : stateName.toLowerCase().replace(" ", "-")
                          }`}
                        >
                          <Button variant="primary">Link</Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
      {type === "house" && (
        <div className="container mt-5">
          <div className="row">
            <h2 className="text-center">All Districts</h2>
          </div>
          <div className="row d-flex align-items-center justify-content-center ">
            <div className="col-lg-8 col-md-12">
              <Accordion alwaysOpen>
                {states.map((stateCode, index) =>
                  StateData(polls, stateCode, data[stateCode], type, index)
                )}
              </Accordion>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

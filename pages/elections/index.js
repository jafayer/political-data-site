import electionData from "../../public/elections/enriched-data-by-state.json";
import { useState, useEffect } from "react";
import { queryHousePollingData } from "../../helpers/pollingData";
import { mapStateCodeToName } from "../../helpers/modLegislators";
import * as d3 from "d3";
import StateData from "../../components/politicians/elections/StateData";
import Accordion from "react-bootstrap/Accordion";
import Table from "react-bootstrap/Table";
import { Button } from "react-bootstrap";

export default function ElectionsHome(props) {
  const states = Object.keys(electionData);

  const [closestDistricts, setClosestDistricts] = useState([]);

  useEffect(() => {
    const allDistricts = [];
    states.forEach((state) => {
      const districts = Object.keys(electionData[state]);
      districts.forEach((district) => {
        allDistricts.push(electionData[state][district]);
      });
    });
    const allDistrictsSorted = allDistricts.sort((a, b) => {
      const aPvi = a["2022_pvi"];
      const bPvi = b["2022_pvi"];

      const aPviStripped = aPvi === "EVEN" ? 0 : parseInt(aPvi.split("+")[1]);
      const bPviStripped = bPvi === "EVEN" ? 0 : parseInt(bPvi.split("+")[1]);

      // sort by smallest
      return aPviStripped - bPviStripped;
    });
    setClosestDistricts(allDistrictsSorted.slice(0, 50));
  }, []);

  return (
    <div>
      <h1 className="text-center">Elections</h1>
      <div className="container mt-5">
        <div className="row text-center">
          <h2>Closest Districts</h2>
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
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {closestDistricts.map((district) => {
                  const { dist, incumbent } = district;
                  const topCandidate = district["results"][0].candidate_name;
                  const cookPVI = district["2022_pvi"];
                  return (
                    <tr key={`top-table-${dist}`}>
                      <td>{dist}</td>
                      <td>{cookPVI}</td>
                      <td>{incumbent}</td>
                      <td>{topCandidate}</td>
                      <td>
                        <Button href="#" variant="primary">
                          Link
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
      <div className="container mt-5">
        <div className="row">
          <h2 className="text-center">All Districts</h2>
        </div>
        <div className="row d-flex align-items-center justify-content-center ">
          <div className="col-lg-8 col-md-12">
            <Accordion>
              {states.map((stateCode, index) =>
                StateData(stateCode, electionData[stateCode], index)
              )}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}

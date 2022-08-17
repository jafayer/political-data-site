import { useState, useEffect } from "react";
import { FaCaretRight } from "react-icons/fa";
import { mapStateCodeToName } from "../../helpers/modLegislators";
import Accordion from "react-bootstrap/Accordion";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { hasPolls } from "../../helpers/pollingData";
import Link from "next/link";

export default function StateData(polls, stateCode, stateData, type, index) {
  const [isOpen, setIsOpen] = useState(false);
  const districts = Object.keys(stateData).sort((a, b) => a - b);

  return (
    <Accordion.Item key={`accordion-${stateCode}`} eventKey={index}>
      <Accordion.Header onClick={onClick}>
        {mapStateCodeToName(stateCode)}
      </Accordion.Header>
      <Accordion.Body>
        {isOpen && (
          <div className="overflow-scroll">
            <Table striped bordered>
              <thead>
                <tr>
                  <th>District</th>
                  <th>Cook PVI</th>
                  <th>Incumbent</th>
                  <th>Top candidate by fundraising</th>
                  <th>Polling data available?</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {districts.map((distCode, index) => {
                  const district = stateData[distCode];
                  const stateName = mapStateCodeToName(stateCode);
                  const hasPollsForDistrict = hasPolls(
                    polls,
                    stateName,
                    type,
                    type === "house" ? distCode : null
                  );

                  return (
                    <tr key={`${stateCode}-${index}-row`}>
                      <td>{`${stateCode}-${distCode}`}</td>
                      <td>{district["2022_pvi"]}</td>
                      <td>{district["incumbent"] + `(${district.party})`}</td>
                      <td>{district.results[0]["candidate_name"]}</td>
                      <td>{hasPollsForDistrict ? "Yes" : "No"}</td>
                      <td>
                        <Link
                          href={`/elections/${type}/${stateCode}-${distCode}`}
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
        )}
      </Accordion.Body>
    </Accordion.Item>
  );

  function onClick() {
    setIsOpen(!isOpen);
  }
}

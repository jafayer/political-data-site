import { useState } from "react";
import PoliticianImage from "../../helpers/getPoliticianImage";

export default function List({ politicians, type }) {
  const [scrollTop, setScrollTop] = useState(0);
  const TableRow = ({ politician, rowIndex, isInViewport }) => {
    //caluclate card given rowIndex % 3 and columnIndex
    const currentTerm = politician?.terms[politician?.terms?.length - 1];
    const { state, district, party } = currentTerm;
    return (
      <tr key={`${politician.id.bioguide}-${type}`}>
        <td>
          <PoliticianImage
            politician={politician}
            dimensions={{ w: 75, h: 75 }}
          />
        </td>
        <td>{politician.name.official_full}</td>
        <td>{state[1]}</td>
        <td>{party}</td>
        <td>{district ? district : "N/A"}</td>
        <td>{isInViewport ? "true" : "false"}</td>
        <td>
          <a
            className="btn btn-primary"
            href={`/politicians/${politician.id.bioguide}`}
          >
            Link
          </a>
        </td>
      </tr>
    );
  };

  return (
    <div className="table-container" onScroll={handleScroll}>
      <table className="table table-striped align-middle">
        <thead>
          <tr>
            <th>Picture</th>
            <th>Name</th>
            <th>State</th>
            <th>Party</th>
            <th>District</th>
            <th>{scrollTop}</th>
            <th>link</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ height: Math.max(scrollTop - 23.5, 0) }}></tr>
          {politicians.map((politician, rowIndex) => {
            if (isItemInViewport(rowIndex)) {
              return (
                <TableRow
                  politician={politician}
                  rowIndex={rowIndex}
                  isInViewport={isItemInViewport(rowIndex)}
                />
              );
            }
          })}
          <tr
            style={{
              height: Math.max(
                81 * politicians.length - (500 + scrollTop + 23.5),
                0
              ),
            }}
          ></tr>
        </tbody>
      </table>
    </div>
  );

  function isItemInViewport(rowIndex) {
    const headerRowHeight = 23.5;
    const rowHeight = 81;
    const viewportHeight = 500;
    const depthOfRow = rowIndex * rowHeight + headerRowHeight;
    return depthOfRow > scrollTop && depthOfRow < scrollTop + viewportHeight;
  }

  function handleScroll(e) {
    setScrollTop(e.target.scrollTop);
  }
}

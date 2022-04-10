import React, { useState, useEffect } from "react";
import { CircularProgress } from "@material-ui/core";
import { Table } from "react-bootstrap";
import { API_URL_TEAMS } from "../config";
import _ from "lodash";
import "./Teams.css";

// Number of results per page
const pageSize = 7;

function Teams(props) {
  const [data, setData] = useState([]);
  const [paginatedData, setPaginatedData] = useState()
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch data from API
  useEffect(() => {
    fetch(API_URL_TEAMS)
      .then((res) => res.json())
      .then((json) => {
        console.log(data);
        setData(json.data);
        setPaginatedData(_(json.data).slice(0).take(pageSize).value())
      })
      .catch(console.error);
  }, []);

  // Calculate # of pages
  const pageCount = data ? Math.ceil(data.length / pageSize) : 0;
  if (pageCount === 1) return null;
  const pages = _.range(1, pageCount + 1);

  const pagination = (pageNum=>{
    setCurrentPage(pageNum)
    const startIndex = (pageNum - 1) * pageSize
    const paginatedData = _(data).slice(startIndex).take(pageSize).value()
    setPaginatedData(paginatedData)

  })

  // If data equals undefined (not yet loaded) render loading animation
  if(data === undefined || paginatedData === undefined)
    return(
      <div className = "d-flex justify-content-center mt-5 mb-5">
        <CircularProgress/>
      </div>
    )

  return (
    <div className="teams">
      <Table responsive hover className="table">
        <thead className="tableHead">
          <tr>
            <th className="pt-3 pb-3">Team Name</th>
            <th className="pt-3 pb-3">City</th>
            <th className="pt-3 pb-3">Abbreviation</th>
            <th className="pt-3 pb-3">Conference</th>
            <th className="pt-3 pb-3">Division</th>
          </tr>
        </thead>
        <tbody>
          {/* Map through data and display row & data for each team */}
          {paginatedData.map((team) => (
            <tr>
              <td className="pt-3 pb-3">{team.name}</td>
              <td className="pt-3 pb-3">{team.city}</td>
              <td className="pt-3 pb-3">{team.abbreviation}</td>
              <td className="pt-3 pb-3">{team.conference}</td>
              <td className="pt-3 pb-3">{team.division}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      {/* Display Pagination buttons */}
      <nav>
        <ul className = "pagination">
          {
            pages.map((page) => (
              <li className = {
                page === currentPage ? "page-item active" : "page-item"
              }
              >
                <p className = "page-link"
                onClick = {()=> pagination(page)}
                >{page}</p>
              </li>
            ))
          }

        </ul>
      </nav> 


    </div>
  );
}

export default Teams;
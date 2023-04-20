import React from "react";
import { useState } from "react";

// importing the query and mutaions from apiSlice
import { useGetAlldataQuery, useDeletedataMutation } from "../api/ApiSlice.jsx";

// rsuite icons
import SearchPeopleIcon from "@rsuite/icons/SearchPeople";
import CloseIcon from "@rsuite/icons/Close";

import {
  Table,
  Pagination,
  Avatar,
  Checkbox,
  Badge,
  Loader,
  Button,
  Popover,
  Whisper,
  Tooltip,
  Dropdown,
  Input,
} from "rsuite";
import "./tablestyle.css";

// table components
const { Column, HeaderCell, Cell } = Table;

const Tasktable = () => {

  // ***************** use states ***********************
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [id, setId] = useState(" ");
  const [searchValue, setSearchValue] = useState("");

  // *******************pagination states*****************************

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);

  // **********************calling useGetAllDatequery  and  deletedata**********************
  const { data: skills, isLoading, isError, error } = useGetAlldataQuery();
  const [deletedata, { isLoading: isDeleting }] = useDeletedataMutation();

  const total = skills?.length;
  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setPage(1);
    setLimit(newLimit);
  };

  const handleJumpToPage = () => {
    const inputPage = parseInt(document.getElementById("jump-page").value);
    if (inputPage && inputPage > 0 && inputPage <= totalPages) {
      setPage(inputPage);
    }
  };

  // to pass multiple
  const handleSkillSelection = (skill, _id, deleted) => {
    console.log("skill", skill);
    console.log("id", _id);
    console.log("deleted", deleted);

    if (selectedSkills.includes(_id)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== _id));
    } else {
      setSelectedSkills([...selectedSkills, _id]);
    }
  };

  const handleDeleteClick = () => {
    if (selectedSkills.length > 0) {
      deletedata(selectedSkills);
      setSelectedSkills([]);
    }
  };

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  let filteredData = [];
  if (skills) {
    filteredData = skills.filter((item) =>
      item?.skill?.toLowerCase().includes(searchValue?.toLowerCase())
    );
  }

  const pagedData = filteredData.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-item-senter mt-5">
        {" "}
        <Loader content="Loading..." />
      </div>
    );
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (!skills) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{ height: "500px" }}
      className="container-fluid mt-3 d-flex flex-column "
    >
      <div className="d-flex justify-content-between align-item-center mx-3">
        <div className="text-primary">
          <h2>Skill List Table</h2>
        </div>
        <div className="search">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />

          <span>
            <SearchPeopleIcon />
          </span>

          <span
            onClick={() => {
              setSearchValue("");
              setSelectedSkills([]);
              setId(null);
            }}
          >
            <CloseIcon />
          </span>
        </div>

        <div>
          <Button
            color="red"
            appearance="primary"
            onClick={handleDeleteClick}
            // disabled={selectedSkills.length === 0}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="container-fluid mt-2 mx-2 ">
        <Table
          className="d-flex justify-content-center align-item-center flex-column"
          height={660}
          rowHeight={60}
          headerHeight={60}
          data={pagedData}
        >
          {/* -----------------Actions---------------------------------------------- */}
          <Column width={80}>
            <HeaderCell>
              <Whisper
                placement="top"
                followCursor
                speaker={<Tooltip>Actions</Tooltip>}
              >
                <Button>Actions</Button>
              </Whisper>
            </HeaderCell>
            <Cell>
              {(rowData) => (
                <Checkbox
                  checked={selectedSkills.includes(rowData._id)}
                  onChange={() =>
                    handleSkillSelection(
                      rowData.skill,
                      rowData._id,
                      rowData.deleted
                    )
                  }
                />
              )}
            </Cell>
          </Column>
          {/* -------------------------skill---------------------------------------- */}
          <Column width={200}>
            <HeaderCell>
              <Whisper
                placement="top"
                followCursor
                speaker={<Tooltip>skill</Tooltip>}
              >
                <Button>Skill</Button>
              </Whisper>
            </HeaderCell>
            <Cell dataKey="skill" />
          </Column>

          {/* -------------------------Avatar------------------------------------- */}
          <Column width={100} align="center">
            <HeaderCell>
              <Whisper
                placement="top"
                followCursor
                speaker={<Tooltip>Avatar</Tooltip>}
              >
                <Button>Avatar</Button>
              </Whisper>
            </HeaderCell>
            <Cell>
              {(rowData) => (
                <Avatar
                  circle
                  style={{
                    width: "25px",
                    height: "25px",
                    backgroundColor: "#3498db",
                    color: "white",
                    fontSize: "12px",
                    textTransform: "uppercase",
                  }}
                >
                  {rowData.skill?.slice(0, 2)}
                  {/* {rowData.skill.charAt(0)} */}
                </Avatar>
              )}
            </Cell>
          </Column>

          {/* -------------------------Category----------------------------- */}
          <Column width={300}>
            <HeaderCell>
              <Whisper
                placement="top"
                followCursor
                speaker={<Tooltip>Category</Tooltip>}
              >
                <Button>Category</Button>
              </Whisper>
            </HeaderCell>
            <Cell dataKey="category" />
          </Column>

          {/* ------------------------Subcategory--------------------------- */}
          <Column flexGrow={2}>
            <HeaderCell>
              <Whisper
                placement="top"
                followCursor
                speaker={<Tooltip>Subcategory</Tooltip>}
              >
                <Button>Subcategory</Button>
              </Whisper>
            </HeaderCell>
            <Cell dataKey="subcategory" />
          </Column>

          {/* ------------------------------Used by-------------------------- */}

          <Column className="mb-2" flexGrow={4}>
            <HeaderCell>
              <Whisper
                placement="top"
                followCursor
                speaker={<Tooltip>Used_by</Tooltip>}
              >
                <Button>Used_by</Button>
              </Whisper>
            </HeaderCell>
            <Cell>
              {(rowData) =>
                rowData.used_by && rowData.used_by.length > 0 ? (
                  <div className="d-flex justify-content-start align-item-center">
                    <Badge
                      className="py-2  mx-2 "
                      color="cyan"
                      content={`${rowData.used_by[0]?.job_title} `}
                    />

                    <Whisper
                      placement="top"
                      trigger="hover"
                      speaker={
                        <Popover>
                          <div>{`${rowData.used_by.length} job titles`}</div>
                          {rowData.used_by
                            .filter((item) => item !== null)
                            .map((item) => (
                              <div key={item.job_title}>
                                {item.job_title || ""}
                              </div>
                            ))}
                        </Popover>
                      }
                    >
                      <Badge
                        className="py-2 mx-2"
                        color="red"
                        content={
                          rowData.used_by.length > 1
                            ? `  +  ${rowData.used_by.length - 1}`
                            : "have only 1"
                        }
                      />
                    </Whisper>
                  </div>
                ) : null
              }
            </Cell>
          </Column>
        </Table>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="pagination" >
          <span style={{ marginRight: "10px" }}>
            {/* Showing {pagedData?.length} of {total} rows */}
            Total:{pagedData?.length} of {total}
          </span>
          <Dropdown title={` page: ${limit}`} placement="topStart">
            {[10,15, 20, 25, 50].map((value) => (
              <Dropdown.Item
                key={value}
                onClick={() => handleLimitChange(value)}
              >
                {`${value}/page`}
              </Dropdown.Item>
            ))}
          </Dropdown>

          <div className="d-flex justify-content-between align-item-center"><Pagination
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            activePage={page}
            pages={totalPages}
            maxButtons={5}
            onSelect={handlePageChange}
            style={{ alignSelf: "center" }}
          />

          <div className="d-flex " style={{ marginLeft: "10px" }}>
            <Button
              appearance="primary"
              style={{ marginLeft: "10px",width: "20px" ,height: "20px" }}
              onClick={handleJumpToPage}
            >
              Go
            </Button>
            <Input
              id="jump-page"
              placeholder={`${1}-${totalPages}`}
              style={{ width: "60px" ,height: "20px"}}
            />
          </div></div>
        </div>
      </div>
    </div>
  );
};

export default Tasktable;



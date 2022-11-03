import React, { useState, useEffect } from "react";

// components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CardLineChart from "components/Cards/CardBarChart.js";
import Axios from "axios";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Button from "react-bootstrap/Button";
import * as TbIcons from "react-icons/tb";
import * as AiIcons from "react-icons/ai";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import { ROOT_SERVER } from "layouts/rootServer.js";

export default function StudentLoanFundForOfficer() {
  const [userDataList, setUserDataList] = useState([]);
  const [eventRoleList, setEventRoleList] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [branchList, setBranchList] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [userData, setUserData] = useState([]);
  const [optionFacultyData, setOptionFacultyData] = useState(-1);
  const [optionBranchData, setOptionBranchData] = useState(-1);
  const [optionTermData, setOptionTermData] = useState(0);
  const [optionYearData, setOptionYearData] = useState(0);
  const [optionEventRoleData, setOptionEventRoleData] = useState(-1);
  const [eventYearList, setEventYearList] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);

  const user_id_login = parseInt(
    localStorage.getItem("user_id_login").split(",")[0]
  );
  const user_role_id_login = parseInt(
    localStorage.getItem("user_id_login").split(",")[1]
  );

  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    Axios.post(
      ROOT_SERVER+"/authen",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((response) => {
      if (response.data.status === "ok") {
        Axios.post(ROOT_SERVER+"/queryUserDataByID", {
          user_id: user_id_login,
        }).then((response) => {
          if (response.data.status === 1) {
            setUserData(response.data.userData);
            console.log(response.data.userData);

            Axios.post(ROOT_SERVER+"/queryEventRoleList", {
              er_id: response.data.userData[0].er_id,
            }).then((responses) => {
              if (responses.data.status === 1) {
                setEventRoleList(responses.data.eventRoleList);
              }
            });

            let f_id_check = -1;
            if (user_role_id_login < 5) {
              f_id_check = parseInt(response.data.userData[0].f_id);
            }
            Axios.post(ROOT_SERVER+"/queryFaculty", {
              f_id: f_id_check,
            }).then((responses) => {
              if (responses.data.status === 1) {
                setFacultyList(responses.data.facultyList);
                if (user_role_id_login < 5) {
                  setOptionFacultyData(responses.data.facultyList[0].id);
                }
              }

              if (user_role_id_login < 4) {
                Axios.post(ROOT_SERVER+"/queryBranch", {
                  b_id: response.data.userData[0].b_id,
                }).then((responses) => {
                  if (responses.data.status === 1) {
                    setBranchList(responses.data.branchList);
                    if (user_role_id_login < 4) {
                      setOptionBranchData(responses.data.branchList[0].id);
                    }
                  }
                });
              } else {
                Axios.post(ROOT_SERVER+"/queryBranchByFacultyID", {
                  f_id: responses.data.facultyList[0].id,
                }).then((responsess) => {
                  if (responsess.data.status === 1) {
                    if (user_role_id_login < 5) {
                      setBranchList(responsess.data.branchList);
                    } else {
                      setBranchList([]);
                    }
                  }
                });
              }
            });
          }
        });

        Axios.get(ROOT_SERVER+"/queryAllEventYear").then(
          (response) => {
            if (response.data.status === 1) {
              setEventYearList(response.data.allEventYear);
            }
          }
        );
      } else {
        localStorage.removeItem("token");
        window.location = "/auth/login";
      }
    });
  }, []);

  const onChangeHandlerFaculty = async (e) => {
    setBranchList([]);
    const optionHandlerData =
      e.target.childNodes[e.target.selectedIndex].getAttribute("id");
    setOptionFacultyData(optionHandlerData);

    if (optionHandlerData != -1) {
      try {
        const { data } = await Axios.post(
          ROOT_SERVER+"/queryBranchByFacultyID",
          {
            f_id: parseInt(optionHandlerData),
          }
        );
        if (data.status === 1) {
          setBranchList(data.branchList);
        }
      } catch (error) {
        this.setState({ error });
      }
    } else {
      setBranchList([]);
    }
  };

  const onChangeHandlerBranch = async (e) => {
    const optionHandlerData =
      e.target.childNodes[e.target.selectedIndex].getAttribute("id");
    setOptionBranchData(optionHandlerData);
  };

  const onChangeHandlerTerm = async (e) => {
    const optionHandlerData =
      e.target.childNodes[e.target.selectedIndex].getAttribute("id");
    setOptionTermData(optionHandlerData);
  };
  const onChangeHandlerYear = async (e) => {
    const optionHandlerData =
      e.target.childNodes[e.target.selectedIndex].getAttribute("id");
    setOptionYearData(optionHandlerData);
  };

  const searchUserBtn = async () => { 
    if (parseInt(optionFacultyData) === -1 || parseInt(optionBranchData) === -1 || parseInt(optionTermData) === 0 || parseInt(optionYearData) === 0) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "ข้อมูลไม่ครบ",
        showConfirmButton: false,
        timer: 3000,
      });
      setUserDataList([]);
      return;
    }
    try {
      const { data } = await Axios.post(
        ROOT_SERVER+"/queryAllUserSlf",
        {
          term: optionTermData,
          year: optionYearData,
          f_id: optionFacultyData,
          b_id: optionBranchData,
        }
      );
      if (data.status === 1) {
        setUserDataList(data.userDataList);
      }
    } catch (error) {
      this.setState({ error });
    }
  };

  const pageCount = Math.ceil(userDataList.length / usersPerPage);
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        {/* Header */}
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <div className="flex flex-wrap mt-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
              <div className="rounded-t bg-white mb-0 px-3 py-3">
                <div className="text-center flex justify-between">
                  <h3 className="text-blueGray-700 text-xl font-bold">
                    ข้อมูล กยศ.
                  </h3>
                  <p>
                    <InputGroup size="sm">
                    <h6 className="mr-1">ภาคเรียน :</h6> 
                      <Form.Select size="sm" onChange={onChangeHandlerTerm}>
                        <option id={0}>เทอม</option>
                        <option id={1}>1</option>
                        <option id={2}>2</option>
                        <option id={3}>3</option>
                      </Form.Select>
                      <Form.Select size="sm" onChange={onChangeHandlerYear}>
                        <option id={0}>ปี</option>
                        {eventYearList.length <= 0
                          ? null
                          : eventYearList.map((val, key) => {
                              return <option id={val.year}>{val.year}</option>;
                            })}
                      </Form.Select>
                    </InputGroup>
                  </p>
                </div>
              </div>
              <div
                className="mt-4 flex-auto px-4 lg:px-8 py-2  pt-0 "
                style={{ textDecoration: "inline" }}
              >
                <Form.Group className="mb-3">
                  <FloatingLabel label="คณะ">
                    <Form.Select
                      aria-label="Floating label select example"
                      disabled={user_role_id_login < 5 ? true : false}
                      onChange={onChangeHandlerFaculty}
                    >
                      {user_role_id_login < 5 ? null : (
                        <option id={-1}>เลือก</option>
                      )}
                      {facultyList.map((val, key) => {
                        return <option id={val.id}>{val.name}</option>;
                      })}
                    </Form.Select>
                  </FloatingLabel>
                </Form.Group>
                <Form.Group className="mb-3">
                  <FloatingLabel label="สาขา">
                    <Form.Select
                      aria-label="Floating label select example"
                      onChange={onChangeHandlerBranch}
                      disabled={user_role_id_login < 4 ? true : false}
                    >
                      {user_role_id_login < 4 ? null : (
                        <option id={-1}>เลือก</option>
                      )}
                      {branchList.map((val, key) => {
                        return <option id={val.id}>{val.name}</option>;
                      })}
                    </Form.Select>
                  </FloatingLabel>
                </Form.Group>

                <Form.Group className="mb-3 d-flex justify-content-center ">
                  <Button
                    variant="success"
                    className=" float-center"
                    onClick={() => searchUserBtn()}
                  >
                    ค้นหา{" "}
                    <AiIcons.AiOutlineSearch style={{ display: "inline" }} />
                  </Button>
                </Form.Group>
              </div>
            </div>
            <div className="w-full ">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white ">
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                  <div className="flex flex-wrap items-center">
                    <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap ">
                      <div className="sm:w-6/12 lg:w-6/12 xl:w-8/12 ">
                        <h3 className="font-semibold text-lg text-blueGray-700">
                          รายชื่อนิสิต {"(" + userDataList.length + ")"}
                        </h3>
                      </div>
                      <div className="sm:w-6/12 lg:w-6/12 xl:w-4/12 ">
                        <form className="md:flex flex-row flex-wrap items-center lg:ml-auto mr-3">
                          <div className="relative flex w-full flex-wrap items-stretch">
                            <span className="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 bg-transparent rounded text-base items-center justify-center w-8 pl-2 py-1">
                              <i className="fas fa-search"></i>
                            </span>
                            <input
                              type="text"
                              placeholder="ค้นหาชื่อคณะ... "
                              className="border-0 px-4 py-1 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
                              onChange={(e) => {
                                setSearchUser(e.target.value);
                              }}
                            />
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="block w-full overflow-x-auto">
                  {/* Projects table */}
                  <table className="items-center w-full bg-transparent border-collapse">
                    <thead>
                      <tr>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          #
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          รหัสนิสิต
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          ชื่อจริง/นามสกุล
                        </th>

                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          จำนวนกิจกรรมที่เข้าร่วมทั้งหมด
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          ชั่วโมง กยศ. ทั้งหมด
                        </th>

                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {userDataList.length <= 0 ? (
                        <td
                          className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
                          colSpan={6}
                        >
                          ไม่มีข้อมูล
                        </td>
                      ) : (
                        userDataList
                          .slice(pagesVisited, pagesVisited + usersPerPage)
                          .filter((val) => {
                            if (searchUser === "") {
                              return val;
                            } else if (
                              val.fullName
                                .toLowerCase()
                                .includes(searchUser.toLowerCase())
                            ) {
                              return val;
                            }
                          })
                          .map((val, key) => {
                            return (
                              <tr>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {pagesVisited + key + 1}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.user_code}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.fullName}
                                </td>

                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.allEventParticipation}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.allSlfHour}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1 text-right">
                                  <Link to={"/admin/studentLoanFund/" + val.id}>
                                    <button
                                      className="bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                      type="button"
                                    >
                                      <TbIcons.TbFileSearch />
                                    </button>
                                  </Link>
                                </td>
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                  <div class="h-0 my-0 border border-solid border-blueGray-100 "></div>
                  {userDataList.length <= 0 ? null : (
                    <div className="d-flex justify-content-center py-3">
                      <ReactPaginate
                        previousLabel={"<"}
                        nextLabel={">"}
                        pageCount={pageCount}
                        onPageChange={changePage}
                        containerClassName={"paginationBttns"}
                        previousLinkClassName={"previousBttn"}
                        nextLinkClassName={"nextBttn"}
                        disabledClassName={"paginationDisabled"}
                        activeClassName={"paginationActive"}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import React, { useState, useEffect } from "react";

// components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CardLineChart from "components/Cards/CardBarChart.js";
import Axios from "axios";
import * as TbIcons from "react-icons/tb";
import { Link, useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import * as AiIcons from "react-icons/ai";
import Swal from "sweetalert2";
import { ROOT_SERVER } from "layouts/rootServer.js";

export default function UserCheckNameList() {
  const { event_id } = useParams();
  const user_id_login = localStorage.getItem("user_id_login").split(",")[0];
  const [SLFEventList, setSLFEventList] = useState([]);
  const [searchUserCheckNameListByName, setSearchUserCheckNameListByName] =
    useState("");
    const [eventData, setEventData] = useState([]);
  const [optionTimesData, setOptionTimesData] = useState(0);
  let total_slf_hour = 0;
  const [pageNumber, setPageNumber] = useState(0);
  const [checkNameCreatedList, setCheckNameCreatedList] = useState([]);
  const [userCheckNameList, setUserCheckNameList] = useState([]);
  const usersPerPage = 5;
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
        Axios.post(ROOT_SERVER+"/queryEventByEventID", {
          user_participation_id: user_id_login,
          event_id: event_id,
        }).then((response) => {
          if (response.data.status === 1) {
            setEventData(response.data.eventData);
          }
        });


        Axios.post(ROOT_SERVER+"/queryCheckNameCreatedListByEventID", {
          event_id: event_id,
          event_participation_id:0,
        }).then((response) => {
          console.log(response.data.checkNameCreatedList)
          if (response.data.status === 1) {
            setCheckNameCreatedList(response.data.checkNameCreatedList);
          }
        });
      } else {
        localStorage.removeItem("token");
        window.location = "/auth/login";
      }
    });
  }, []);

  const pageCount = Math.ceil(setSLFEventList.length / usersPerPage);

  const onChangeHandlerTimes = async (e) => {
    try {
      const optionHandlerData =
        e.target.childNodes[e.target.selectedIndex].getAttribute("id");
      setOptionTimesData(optionHandlerData);

      if (optionHandlerData == 0) {
        setUserCheckNameList([]);
        return;
      }

      const { data } = await Axios.post(
        ROOT_SERVER+"/queryUserCheckNameList",
        {
          times: optionHandlerData,
          event_id: event_id,
        }
      );
      if (data.status === 1) {
        setUserCheckNameList(data.userCheckNameList);
      }
    } catch (error) {
      this.setState({ error });
    }
  };

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
                    ชื่อกิจกรรม : {" "+eventData.length <= 0 ? "" : eventData[0].name}
                  </h3>
                  <p>
                    <InputGroup size="sm">
                      <h6 className="mr-1">ครั้งที่การเช็คชื่อ :</h6>

                      <Form.Select size="sm" onChange={onChangeHandlerTimes}>
                        <option id={0}>เลือก</option>
                        {checkNameCreatedList.length <= 0
                          ? null
                          : checkNameCreatedList.map((val, key) => {
                              return (
                                <option id={val.times}>{val.times}</option>
                              );
                            })}
                      </Form.Select>
                    </InputGroup>
                  </p>
                </div>
              </div>
              <div className="mt-3 flex-auto px-4 lg:px-8 py-2 pt-0 flex justify-between"></div>
            </div>
            <div className="w-full ">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white ">
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                  <div className="flex flex-wrap items-center">
                    <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap ">
                      <div className="sm:w-6/12 lg:w-6/12 xl:w-8/12 ">
                        <h3 className="font-semibold text-lg text-blueGray-700">
                          รายชื่อผู้เข้าร่วมกิจกรรม
                          {"(" + userCheckNameList.length + ")"}
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
                              placeholder="ค้นหาชื่อกิจกรรม... "
                              className="border-0 px-4 py-1 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
                              onChange={(e) => {
                                setSearchUserCheckNameListByName(
                                  e.target.value
                                );
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
                          รหัสผู้ใช้
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          ชื่อจริง นามสกุล
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          ระดับผู้ใช้
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          สถานะการเช็คชื่อ
                        </th>
                         </tr>
                    </thead>
                    <tbody>
                      {userCheckNameList.length <= 0 ? (
                        <td
                          className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
                          colSpan={5}
                        >
                          ไม่มีข้อมูล
                        </td>
                      ) : (
                        userCheckNameList
                          .slice(pagesVisited, pagesVisited + usersPerPage)
                          .filter((val) => {
                            if (searchUserCheckNameListByName === "") {
                              return val;
                            } else if (
                              val.fullName
                                .toLowerCase()
                                .includes(
                                  searchUserCheckNameListByName.toLowerCase()
                                )
                            ) {
                              return val;
                            }
                          })
                          .map((val, key) => {
                            return (
                              <tr>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {pagesVisited + (key + 1)}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.user_code}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.fullName}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.ur_name}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                  {val.ch_n_status}
                                </td>

                               
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                  <div class="h-0 my-0 border border-solid border-blueGray-100 "></div>
                  {SLFEventList.length <= 0 ? null : (
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

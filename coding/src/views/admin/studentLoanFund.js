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
import Chart from "chart.js";
import { ROOT_SERVER } from "layouts/rootServer.js";

export default function StudentLoanFund() {
  const { user_id } = useParams();
  const user_id_login = localStorage.getItem("user_id_login").split(",")[0];
  const [userData, setUserData] = useState([]);
  const [eventYearList, setEventYearList] = useState([]);
  const [SLFEventList, setSLFEventList] = useState([]);
  const [SLFEventMonthCountList, setSLFEventMonthCountList] = useState(0);
  const [searchEventSlfByName, setSearchEventSlfByName] = useState("");
  const [optionTermData, setOptionTermData] = useState(0);
  const [optionYearData, setOptionYearData] = useState(0);
  let total_slf_hour = 0;
  const [pageNumber, setPageNumber] = useState(0);

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

    Axios.post(ROOT_SERVER+"/queryUserDataByID", {
      user_id: user_id,
    }).then((response) => {
      if (response.data.status === 1) {
        setUserData(response.data.userData);
      }
    });

    new Chart(document.getElementById("bar-chart"), {
      type: "bar",
      data: {
        labels: [
          "ม.ค.",
          "ก.พ.",
          "มี.ค.",
          "เม.ย.",
          "พ.ค",
          "มิ.ย.",
          "ก.ค.",
          "ส.ค.",
          "ก.ย.",
          "ต.ค.",
          "พ.ย.",
          "ธ.ค.",
        ],
        datasets: [
          {
            label: "จำนวนกิจกรรม",
            borderColor: [
              "rgba(201, 203, 207, 0.2)",
              "rgba(201, 203, 207, 0.2)",
              "rgba(201, 203, 207, 0.2)",
              "rgba(201, 203, 207, 0.2)",
              "rgba(201, 203, 207, 0.2)",
              "rgba(201, 203, 207, 0.2)",
              "rgba(201, 203, 207, 0.2)",
              "rgba(201, 203, 207, 0.2)",
              "rgba(201, 203, 207, 0.2)",
              "rgba(201, 203, 207, 0.2)",
              "rgba(201, 203, 207, 0.2)",
              "rgba(201, 203, 207, 0.2)",
            ],
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(255, 159, 64)",
              "rgb(255, 205, 86)",
              "rgb(75, 192, 192)",
              "rgb(54, 162, 235)",
              "rgb(153, 102, 255)",
              "rgb(201, 203, 207)",

              "rgb(128, 128, 128)",
              "rgb(255, 209, 219)",
              "RGB(186, 226, 250)",
              "RGB(212, 225, 192)",
              "RGB(255, 239, 230)",
            ],
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
        ],
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: "จำนวนกิจกรรมทั้งหมดที่ได้รับชั่วโมงจิตอาสา กยศ.",
        },
      },
    });
  }, []);

  const pageCount = Math.ceil(setSLFEventList.length / usersPerPage);

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

  const searchEventSlfBtn = async () => { 
    let setJan = 0;
    let setFeb = 0;
    let setMar = 0;
    let setApr = 0;
    let setMay = 0;
    let setJun = 0;
    let setJul = 0;
    let setAug = 0;
    let setSep = 0;
    let setOct = 0;
    let setNov = 0;
    let setDec = 0;
    if (parseInt(optionTermData) === 0 || parseInt(optionYearData) === 0) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "ข้อมูลไม่ครบ",
        showConfirmButton: false,
        timer: 3000,
      }); 
      return;
    }
    try {
      const { data } = await Axios.post(
        ROOT_SERVER+"/querySLFEventByUserID",
        {
          term: optionTermData,
          year: optionYearData,
          user_participation_id: user_id,
        }
      );
      
      new Chart(document.getElementById("bar-chart"), {
        type: "bar",
        data: {
          labels: [
            "ม.ค.",
            "ก.พ.",
            "มี.ค.",
            "เม.ย.",
            "พ.ค",
            "มิ.ย.",
            "ก.ค.",
            "ส.ค.",
            "ก.ย.",
            "ต.ค.",
            "พ.ย.",
            "ธ.ค.",
          ],
          datasets: [
            {
              label: "จำนวนกิจกรรม",
              borderColor: [
                "rgba(201, 203, 207, 0.2)",
                "rgba(201, 203, 207, 0.2)",
                "rgba(201, 203, 207, 0.2)",
                "rgba(201, 203, 207, 0.2)",
                "rgba(201, 203, 207, 0.2)",
                "rgba(201, 203, 207, 0.2)",
                "rgba(201, 203, 207, 0.2)",
                "rgba(201, 203, 207, 0.2)",
                "rgba(201, 203, 207, 0.2)",
                "rgba(201, 203, 207, 0.2)",
                "rgba(201, 203, 207, 0.2)",
                "rgba(201, 203, 207, 0.2)",
              ],
              backgroundColor: [
                "rgb(255, 99, 132)",
                "rgb(255, 159, 64)",
                "rgb(255, 205, 86)",
                "rgb(75, 192, 192)",
                "rgb(54, 162, 235)",
                "rgb(153, 102, 255)",
                "rgb(201, 203, 207)",
  
                "rgb(128, 128, 128)",
                "rgb(255, 209, 219)",
                "RGB(186, 226, 250)",
                "RGB(212, 225, 192)",
                "RGB(255, 239, 230)",
              ],
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
          ],
        },
        options: {
          legend: { display: false },
          title: {
            display: true,
            text: "จำนวนกิจกรรมทั้งหมดที่ได้รับชั่วโมงจิตอาสา กยศ.",
          },
        },
      });
      
      if (data.status === 1) {
        Axios.post(ROOT_SERVER+"/querySLFEventMonthCountList", {
          term: optionTermData,
          year: optionYearData,
          user_participation_id: user_id,
        }).then((response) => {
          console.log(">>>>>>" + response.data.status);
          if (response.data.status === 1) {
            response.data.SLFEventMonthCountList.map((val, key) => {
              console.log(val.month_count);
              if (val.month_name == 1) {
                setJan = val.month_count;
              } else if (val.month_name == 2) {
                setFeb(val.month_count);
              } else if (val.month_name == 3) {
                setMar = val.month_count;
              } else if (val.month_name == 4) {
                setApr = val.month_count;
              } else if (val.month_name == 5) {
                setMay = val.month_count;
              } else if (val.month_name == 6) {
                setJun = val.month_count;
              } else if (val.month_name == 7) {
                setJul = val.month_count;
              } else if (val.month_name == 8) {
                setAug = val.month_count;
              } else if (val.month_name == 9) {
                setSep = val.month_count;
              } else if (val.month_name == 10) {
                setOct = val.month_count;
              } else if (val.month_name == 11) {
                setNov = val.month_count;
              } else if (val.month_name == 112) {
                setDec = val.month_count;
              }
            });

            console.log("<<<<"+setOct)
            new Chart(document.getElementById("bar-chart"), {
              type: "bar",
              data: {
                labels: [
                  "ม.ค.",
                  "ก.พ.",
                  "มี.ค.",
                  "เม.ย.",
                  "พ.ค",
                  "มิ.ย.",
                  "ก.ค.",
                  "ส.ค.",
                  "ก.ย.",
                  "ต.ค.",
                  "พ.ย.",
                  "ธ.ค.",
                ],
                datasets: [
                  {
                    label: "จำนวนกิจกรรม",
                    borderColor: [
                      "rgba(201, 203, 207, 0.2)",
                      "rgba(201, 203, 207, 0.2)",
                      "rgba(201, 203, 207, 0.2)",
                      "rgba(201, 203, 207, 0.2)",
                      "rgba(201, 203, 207, 0.2)",
                      "rgba(201, 203, 207, 0.2)",
                      "rgba(201, 203, 207, 0.2)",
                      "rgba(201, 203, 207, 0.2)",
                      "rgba(201, 203, 207, 0.2)",
                      "rgba(201, 203, 207, 0.2)",
                      "rgba(201, 203, 207, 0.2)",
                      "rgba(201, 203, 207, 0.2)",
                    ],
                    backgroundColor: [
                      "rgb(255, 99, 132)",
                      "rgb(255, 159, 64)",
                      "rgb(255, 205, 86)",
                      "rgb(75, 192, 192)",
                      "rgb(54, 162, 235)",
                      "rgb(153, 102, 255)",
                      "rgb(201, 203, 207)",

                      "rgb(128, 128, 128)",
                      "rgb(255, 209, 219)",
                      "RGB(186, 226, 250)",
                      "RGB(212, 225, 192)",
                      "RGB(255, 239, 230)",
                    ],
                    data: [
                      setJan,
                      setFeb,
                      setMar,
                      setApr,
                      setMay,
                      setJun,
                      setJul,
                      setAug,
                      setSep,
                      setOct,
                      setNov,
                      setDec,
                    ],
                  },
                ],
              },
              options: {
                legend: { display: false },
                title: {
                  display: true,
                  text: "จำนวนกิจกรรมทั้งหมดที่ได้รับชั่วโมงจิตอาสา กยศ.",
                },
              },
            });
          } else {
            console.log(444444444)
          }
        });

        setSLFEventList(data.SLFEventList);
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
                      <Button
                        variant="success"
                        onClick={() => searchEventSlfBtn()}
                      >
                        ค้นหา{" "}
                        <AiIcons.AiOutlineSearch
                          style={{ display: "inline" }}
                        />
                      </Button>
                    </InputGroup>
                  </p>
                </div>
              </div>
              <div className="mt-3 flex-auto px-4 lg:px-8 py-2 pt-0 flex justify-between">
                <h6 className="text-blueGray-700 text-lg ">
                  {userData.length <= 0
                    ? null
                    : userData[0].name_prefix +
                      "" +
                      userData[0].name +
                      " " +
                      userData[0].surname}
                </h6>
                <h6 className="text-blueGray-700 text-lg ">
                  ชั่วโมง กยศ. รวม
                  {SLFEventList.length <= 0
                    ? null
                    : SLFEventList.map((val, key) => {
                        total_slf_hour += val.slf_hour;
                      })}{" "}
                  {total_slf_hour+"/18 "} ชม.
                </h6>
              </div>
              <h6 className="mt-3 flex-auto px-4  text-blueGray-700 text-lg ">
                {userData.length <= 0
                  ? null
                  : "รหัสประจำตัวนิสิต : " + userData[0].user_code}
              </h6>
              <div className="mt-2 flex-auto px-4 lg:px-8 py-2  pt-0">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                  <div className="p-4 flex-auto">
                    {/* Chart */}
                    <div className="relative  ">
                      <canvas id="bar-chart"></canvas>
                    </div>
                  </div>
                </div>
                {/* <CardLineChart data={SLFEventMonthCountList} /> */}
              </div>
            </div>
            <div className="w-full ">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white ">
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                  <div className="flex flex-wrap items-center">
                    <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap ">
                      <div className="sm:w-6/12 lg:w-6/12 xl:w-8/12 ">
                        <h3 className="font-semibold text-lg text-blueGray-700">
                          กิจกรรม{"(" + SLFEventList.length + ")"}
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
                                setSearchEventSlfByName(e.target.value);
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
                          ชื่อกิจกรรม
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          ระดับกิจกรรม
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          ชั่วโมง กยศ.
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          จำนวนผู้เข้าร่วม
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          สถานะกิจกรรม
                        </th>

                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {SLFEventList.length <= 0 ? (
                        <td
                          className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
                          colSpan={7}
                        >
                          ไม่มีกิจกรรม
                        </td>
                      ) : (
                        SLFEventList.slice(
                          pagesVisited,
                          pagesVisited + usersPerPage
                        )
                          .filter((val) => {
                            if (searchEventSlfByName === "") {
                              return val;
                            } else if (
                              val.name
                                .toLowerCase()
                                .includes(searchEventSlfByName.toLowerCase())
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
                                  {val.name}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.er_name}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.slf_hour}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.members_number + "/" + val.quantity}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  <i
                                    className={
                                      val.pass_status === 1
                                        ? "fas fa-circle text-teal-500 mr-2 "
                                        : val.pass_status === 2
                                        ? "fas fa-circle text-red-500 mr-2 "
                                        : "fas fa-circle text-orange-500 mr-2 "
                                    }
                                  ></i>{" "}
                                  {val.pass_status_result}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1 text-right">
                                  <Link
                                    to={"/admin/detailEventAttend/" + val.id}
                                  >
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

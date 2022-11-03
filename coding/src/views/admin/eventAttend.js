import React, { useState, useEffect } from "react";

// components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";

import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import * as TbIcons from "react-icons/tb";
import * as AiIcons from "react-icons/ai";
import * as GrIcons from "react-icons/gr";
import * as ImIcons from "react-icons/im";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import Axios from "axios";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import { ROOT_SERVER } from "layouts/rootServer.js";

export default function EventAttend() {
  const user_id_login = localStorage.getItem("user_id_login").split(",")[0];
  const [eventParticipationWaitingShow, setEventParticipationWaitingShow] =
    useState(false);
  const [eventParticipationWaitingList, setEventParticipationWaitingList] =
    useState([]);
  const [eventParticipationWorkingList, setEventParticipationWorkingList] = useState([]);
  const [eventParticipationEndedList, setEventParticipationEndedList] = useState([]);
  const [searchEventWorkingByName, setSearchEventWorkingByName] = useState("");
  const [searchEventEndedByName, setSearchEventEndedByName] = useState(""); 
  const [pageNumber, setPageNumber] = useState(0);
  const [pageNumber2, setPageNumber2] = useState(0);

  const usersPerPage = 5;
  const pagesVisited = pageNumber * usersPerPage;
  const pagesVisited2 = pageNumber2 * usersPerPage;

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const changePage2 = ({ selected }) => {
    setPageNumber2(selected);
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
        //alert("ok555");
      } else {
        localStorage.removeItem("token");
        window.location = "/auth/login";
      }
    });

    Axios.post(ROOT_SERVER+"/queryEventParticipationByUserParticipationID", {
      user_participation_id: user_id_login,
      event_status:"working"
    }).then((response) => { 
      if (response.data.status === 1) { 
        
        setEventParticipationWorkingList(response.data.eventParticipationList); 
      }  
    });

    Axios.post(ROOT_SERVER+"/queryEventParticipationByUserParticipationID", {
      user_participation_id: user_id_login,
      event_status:"ended"
    }).then((response) => { 
      if (response.data.status === 1) { 
         
        setEventParticipationEndedList(response.data.eventParticipationList);
      }  
    });
  }, []);

  const pageCount = Math.ceil(
    setEventParticipationWorkingList.length / usersPerPage
  );

  const pageCount2 = Math.ceil(
    setEventParticipationEndedList.length / usersPerPage
  );

  const deleteEventParticipationWaitingByEventID = async (user_participation_id,event_id) => {
    console.log(user_participation_id,event_id)
    Swal.fire({
      title: "คุณต้องการยกเลิกคำขอเข้าร่วมกิจกรรมหรือไม่?",
      text: " ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "	#198754",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await Axios.post(
            ROOT_SERVER+"/deleteEventParticipationWaitingByEventID",
            {
              user_participation_id: user_participation_id,
              event_id: event_id,
            }
          );
          if (data) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "ยกเลิกคำขอสำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "ยกเลิกคำขอไม่สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
          }
        } catch (error) {
          this.setState({ error });
        }
      }
    });
  };

  const showEventParticipationWaitingModal = () => {
    setEventParticipationWaitingShow(true);
    try {
      Axios.post(
        ROOT_SERVER+"/queryEventParticipationWaitingByUserID",
        {
          user_participation_id: user_id_login,
        }
      ).then((response) => {
        if (response.data.status === 1) {
          setEventParticipationWaitingList(
            response.data.eventParticipationWaitingList
          );
        } 
      });
    } catch (error) {
      this.setState({ error });
    }
  };

  const deleteEventAttend = async (e_id) => { 
    Swal.fire({
      title: "ต้องการลบกิจกรรมที่เข้าร่วมหรือไม่?",
      text: " ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "	#198754",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        
        try {
          const { data } = await Axios.post(
            ROOT_SERVER+"/deleteEventParticipation",
            {
              u_id: user_id_login,
              e_id: e_id,  
            }
          );
          if (data) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "ลบกิจกรรมที่เข้าร่วมสำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            }); 
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "ลบกิจกรรมที่เข้าร่วมไม่สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            }); 
            window.location.reload(false);
          }
        } catch (error) {
          this.setState({ error });
        }
      }
    });
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
                    กิจกรรมที่รอการอนุมัติ
                  </h3>
                </div>
              </div>
              <div className="flex-auto px-4 lg:px-8 py-2  pt-0">
                <button
                  className="mt-3 bg-orange-500 text-white active:bg-orange-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => showEventParticipationWaitingModal()}
                >
                  กิจกรรมที่รอการอนุมัติ{" "}
                  <AiIcons.AiOutlineFieldTime style={{ display: "inline" }} />
                </button>
              </div>
            </div>

            <div className="w-full ">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white ">
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                  <div className="flex flex-wrap items-center">
                    <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap ">
                      <div className="sm:w-6/12 lg:w-6/12 xl:w-8/12 ">
                        <h3 className="font-semibold text-lg text-blueGray-700">
                          กิจกรรมที่เข้าร่วมล่าสุด{"("+eventParticipationWorkingList.length+")"}
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
                                setSearchEventWorkingByName(e.target.value);
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
                    {eventParticipationWorkingList.length <= 0 ? (
                        <td
                          className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
                          colSpan={7}
                        >
                          ไม่มีกิจกรรม
                        </td>
                      ) : (
                        
                        eventParticipationWorkingList
                        .slice(pagesVisited, pagesVisited + usersPerPage)
                        .filter((val) => {
                          if (searchEventWorkingByName === "") {
                            return val;
                          } else if (
                            val.name
                              .toLowerCase()
                              .includes(
                                searchEventWorkingByName.toLowerCase()
                              )
                          ) {
                            return val;
                          }
                        }).map((val, key) => {
                          
                        return ( 
                          <tr>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                              {pagesVisited+(key + 1)}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                              {val.name}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                              {val.event_role_name}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                              {val.slf_hour}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                              {val.members_number+"/"+val.quantity}  
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                              <i className="fas fa-circle text-orange-500 mr-2"></i>{" "}
                              {val.event_time_status} 
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1 text-right">
                              <Link to={"/admin/detailEventAttend/" + val.id}>
                                <button
                                  className="bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                  type="button"
                                >
                                  <TbIcons.TbFileSearch />
                                </button>
                              </Link>

                              <button
                                className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={()=> deleteEventAttend(val.id)}
                              >
                                <AiIcons.AiFillDelete />
                              </button>
                            </td>
                          </tr>
                        );
                      }))}
                     
                   
                  </table>
                  <div class="h-0 my-0 border border-solid border-blueGray-100 "></div>
                  {eventParticipationWorkingList.length <= 0 ? null :
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
}
                </div>
              </div>
            </div>
            <div className="w-full ">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white ">
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                  <div className="flex flex-wrap items-center">
                    <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap ">
                      <div className="sm:w-6/12 lg:w-6/12 xl:w-8/12 ">
                        <h3 className="font-semibold text-lg text-blueGray-700">
                          กิจกรรมที่เคยเข้าร่วม{"("+eventParticipationEndedList.length+")"}
                        </h3>
                      </div>
                      <div className="sm:w-6/12 lg:w-6/12 xl:w-4/12 ">
                        <form className="md:flex flex-row flex-wrap items-center lg:ml-auto mr-3">
                          <div className="relative flex w-full flex-wrap items-stretch">
                            <span className="z-10 h-full leading-snug font-normal text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-2 py-1">
                              <i className="fas fa-search"></i>
                            </span>
                            <input
                              type="text"
                              placeholder="ค้นหาชื่อกิจกรรม... "
                              className="border-0 px-4 py-1 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
                              onChange={(e) => {
                                setSearchEventEndedByName(e.target.value);
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
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          สถานะการผ่านกิจกรรม
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"></th>
                      </tr>
                    </thead>
                    <tbody>
                    {eventParticipationEndedList.length <= 0 ? (
                        <td
                          className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
                          colSpan={7}
                        >
                          ไม่มีกิจกรรม
                        </td>
                      ) : (
                        
                        eventParticipationEndedList
                        .slice(pagesVisited2, pagesVisited2 + usersPerPage)
                        .filter((val) => {
                          if (searchEventEndedByName === "") {
                            return val;
                          } else if (
                            val.name
                              .toLowerCase()
                              .includes(searchEventEndedByName.toLowerCase())
                          ) {
                            return val;
                          }
                        }).map((val, key) => {
                          
                        return ( 
                          <tr>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                              {pagesVisited2+(key + 1)}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                              {val.name}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                              {val.event_role_name}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                              {val.slf_hour}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                              {val.members_number+"/"+val.quantity}  
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                              <i className="fas fa-circle  text-coolGray-500 mr-2"></i>{" "}
                              {val.event_time_status} 
                            </td> 
                            <td className={"border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1 "+(val.pass_status == 1 ? "text-emerald-500" :val.pass_status == -1 ? "text-red-500" : "text-orange-500") }>
                              {val.pass_status == 1 ? "ผ่านกิจกรรม" :val.pass_status == -1 ? "ไม่ผ่านกิจกรรม" : "รอ" } 
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1 text-right">
                              <Link to={"/admin/detailEventAttend/" + val.id}>
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
                      }))}
                    </tbody>
                  </table>
                  <div class="h-0 my-0 border border-solid border-blueGray-100"></div>
                  {eventParticipationEndedList.length <= 0 ? null : <div className="d-flex justify-content-center py-3">
                    <ReactPaginate
                      previousLabel={"<"}
                      nextLabel={">"}
                      pageCount={pageCount2}
                      onPageChange={changePage2}
                      containerClassName={"paginationBttns"}
                      previousLinkClassName={"previousBttn"}
                      nextLinkClassName={"nextBttn"}
                      disabledClassName={"paginationDisabled"}
                      activeClassName={"paginationActive"}
                    />
                  </div>}
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        size="lg"
        show={eventParticipationWaitingShow}
        onHide={() => setEventParticipationWaitingShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            กิจกรรมที่รอการอนุมัติ
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="">
          <div className="w-full ">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white ">
              <div className="block w-full overflow-x-auto">
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
                      <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventParticipationWaitingList.length <= 0 ? (
                        <td
                          className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
                          colSpan={6}
                        >
                          ไม่มีกิจกรรม
                        </td>
                      ) : (
                        eventParticipationWaitingList.map((val, key) => {
                      return (
                        <tr>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                            {key + 1}
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                            {val.name}
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                            {val.event_role_name}
                          </td>

                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                            {val.slf_hour}
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                            {val.members_number+"/"+val.quantity}
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1 text-right">
                            <button
                              className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                              type="button"
                              onClick={()=>deleteEventParticipationWaitingByEventID(val.user_participation_id,val.id)}
                            >
                              ยกเลิกคำขอ{" "}
                              <AiIcons.AiFillDelete
                                style={{ display: "inline" }}
                              />
                            </button>
                          </td>
                        </tr>
                      );
                    }))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

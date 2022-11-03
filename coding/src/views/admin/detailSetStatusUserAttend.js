import React, { useState, useEffect } from "react";

// components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Axios from "axios";
import * as TbIcons from "react-icons/tb";
import * as AiIcons from "react-icons/ai";
import * as BsIcons from "react-icons/bs";
import * as ImIcons from "react-icons/im";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { ROOT_SERVER } from "layouts/rootServer.js";

export default function DetailSetStatusUserAttend() {
  const [modelNotice, setModelNotice] = useState(false);
  const [
    checkNametUserParticipationWaitingList,
    setCheckNametUserParticipationWaitingList,
  ] = useState([]);
  const [
    checkNametUserParticipationPassList,
    setCheckNametUserParticipationPassList,
  ] = useState([]);
  const [
    searchcheckNametUserParticipationWaitingByName,
    setSearchcheckNametUserParticipationWaitingByName,
  ] = useState("");
  const [
    searchcheckNametUserParticipationPassByName,
    setSearchcheckNametUserParticipationPassByName,
  ] = useState("");
  const { event_id } = useParams();
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
        Axios.post(
          ROOT_SERVER+"/queryCheckNameUserParticipationByEventID",
          {
            status: 0,
            event_id: event_id,
          }
        ).then((response) => {
          
          if (response.data.status === 1) {
            setCheckNametUserParticipationWaitingList(
              response.data.checkNameUserParticipationList
            );
          }
        });

        Axios.post(
          ROOT_SERVER+"/queryCheckNameUserParticipationByEventID",
          {
            status: 1,
            event_id: event_id,
          }
        ).then((response) => {
          if (response.data.status === 1) {
            setCheckNametUserParticipationPassList(
              response.data.checkNameUserParticipationList
            );
          }
        });
      } else {
        localStorage.removeItem("token");
        window.location = "/auth/login";
      }
    });
  }, []);

  const updatePassEvent = async (user_participation_id) => { 
    console.log(checkNametUserParticipationWaitingList[0].id)
    Swal.fire({
      title: "ต้องการให้ผ่านกิจกรรมหรือไม่?",
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
            ROOT_SERVER+"/passEvent",
            {
              user_participation_id: user_participation_id, 
              event_id: event_id,
            }
          );
          if (data) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "ให้ผ่านสำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            }); 
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "ให้ผ่านไม่สำเร็จ",
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

  const updateNotPassEvent = async (user_participation_id) => { 
    Swal.fire({
      title: "ต้องการไม่ให้ผ่านกิจกรรมหรือไม่?",
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
            ROOT_SERVER+"/notPassEvent",
            {
              user_participation_id: user_participation_id, 
              event_id: event_id,
            }
          );
          if (data) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "ไม่ให้ผ่านสำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            }); 
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "ไม่ให้ผ่านไม่สำเร็จ",
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

  const updateAllPassEvent = async () => {  
    Swal.fire({
      title: "ต้องการให้ผ่านกิจกรรมทั้งหมดหรือไม่?",
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
            ROOT_SERVER+"/allPassEvent",
            {
              all_user_participation_id: checkNametUserParticipationWaitingList, 
              event_id: event_id,
            }
          );
          if (data) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "ให้ผ่านทั้งหมดสำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            }); 
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "ให้ผ่านทั้งหมดไม่สำเร็จ",
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

  const updateAllNotPassEvent = async () => {  
    Swal.fire({
      title: "ต้องการไม่ให้ผ่านกิจกรรมทั้งหมดหรือไม่?",
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
            ROOT_SERVER+"/allnotPassEvent",
            {
              all_user_participation_id: checkNametUserParticipationWaitingList, 
              event_id: event_id,
            }
          );
          if (data) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "ไม่ให้ผ่านทั้งหมดสำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            }); 
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "ไม่ให้ผ่านทั้งหมดไม่สำเร็จ",
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
            <div className="w-full ">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white ">
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                  <div className="flex flex-wrap items-center">
                    <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap ">
                      <div className="sm:w-6/12 lg:w-6/12 xl:w-8/12 ">
                        <h3 className="font-semibold text-lg text-blueGray-700">
                          ผู้เข้าร่วมที่ยังไม่ได้ให้สถานะการผ่านกิจกรรม
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
                              placeholder="ค้นหาชื่อ... "
                              className="border-0 px-4 py-1 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
                              onChange={(e) => {
                                setSearchcheckNametUserParticipationWaitingByName(
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
                          ชื่อจริง นามสกุล
                        </th>
                        
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                        จำนวนครั้งการสร้างเช็คชื่อ
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                        จำนวนครั้งที่เช็คชื่อ
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          ค่าเฉลี่ยการเช็คชื่อ(%)
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          สถานะการผ่านกิจกรรม
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {checkNametUserParticipationWaitingList.length <= 0 ? (
                        <td
                          className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
                          colSpan={7}
                        >
                          ไม่มีข้อมูล
                        </td>
                      ) : (
                        checkNametUserParticipationWaitingList
                          .filter((val) => {
                            if (
                              searchcheckNametUserParticipationWaitingByName ===
                              ""
                            ) {
                              return val;
                            } else if (
                              val.fullName
                                .toLowerCase()
                                .includes(
                                  searchcheckNametUserParticipationWaitingByName.toLowerCase()
                                )
                            ) {
                              return val;
                            }
                          })
                          .map((val, key) => {
                            return (
                              <tr>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {key + 1}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.name_prefix +
                                    "" +
                                    val.name +
                                    " " +
                                    val.surname}
                                </td>
                                
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.check_name_create_time}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.check_name_paticipation_time}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.avg_check_name}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  <i className="fas fa-circle text-orange-500 mr-2"></i>{" "}
                                  รอ
                                </td>

                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1 text-right">
                                  <Link to="/admin/detailEventAttend">
                                    <button
                                      className="bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                      type="button"
                                    >
                                      <TbIcons.TbFileSearch
                                        style={{ display: "inline" }}
                                      />
                                    </button>
                                  </Link>
                                  <button
                                    className="bg-teal-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={()=> updatePassEvent(val.id)}
                                  >
                                    <AiIcons.AiOutlineCheckSquare
                                      style={{ display: "inline" }}
                                    />
                                  </button>
                                  <button
                                    className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={()=> updateNotPassEvent(val.id)}
                                  >
                                    <BsIcons.BsXSquare
                                      style={{ display: "inline" }}
                                    />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>{" "}
          <div className=" text-right">
            <button
              className="bg-teal-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={()=> updateAllPassEvent()}
            >
              {" "}
              ผ่านทั้งหมด{" "}
              <AiIcons.AiOutlineCheckSquare style={{ display: "inline" }} />
            </button>
            <button
              className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={()=> updateAllNotPassEvent()}
            >
              {" "}
              ไม่ผ่านทั้งหมด <BsIcons.BsXSquare style={{ display: "inline" }} />
            </button>
          </div>
          <div className="flex flex-wrap mt-4">
            <div className="w-full ">
              <div className="relative flex flex-col min-w-0 break-words w-full shadow-lg rounded bg-white mb-10">
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                  <div className="flex flex-wrap items-center">
                    <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap ">
                      <div className="sm:w-6/12 lg:w-6/12 xl:w-8/12 ">
                        <h3 className="font-semibold text-lg text-blueGray-700">
                          ผู้เข้าร่วมที่ให้สถานะการผ่านกิจกรรมแล้ว
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
                              placeholder="ค้นหาชื่อ... "
                              className="border-0 px-4 py-1 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
                              onChange={(e) => {
                                setSearchcheckNametUserParticipationPassByName(
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
                          ชื่อจริง นามสกุล
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          จำนวนครั้งการสร้างเช็คชื่อ
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          จำนวนครั้งที่เช็คชื่อ
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          ค่าเฉลี่ยการเช็คชื่อ(%)
                        </th>
                       
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          สถานะการผ่านกิจกรรม
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {checkNametUserParticipationPassList.length <= 0 ? (
                        <td
                          className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
                          colSpan={7}
                        >
                          ไม่มีข้อมูล
                        </td>
                      ) : (
                        checkNametUserParticipationPassList
                          .filter((val) => {
                            if (
                              searchcheckNametUserParticipationPassByName === ""
                            ) {
                              return val;
                            } else if (
                              val.fullName
                                .toLowerCase()
                                .includes(
                                  searchcheckNametUserParticipationPassByName.toLowerCase()
                                )
                            ) {
                              return val;
                            }
                          })
                          .map((val, key) => {
                            return (
                              <tr>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {key + 1}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.name_prefix +
                                    "" +
                                    val.name +
                                    " " +
                                    val.surname}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.check_name_create_time}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.check_name_paticipation_time}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.avg_check_name}
                                </td>
                               
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                   
                                  <i
                                    className={
                                      val.pass_status === 1
                                        ? "fas fa-circle text-teal-500 mr-2 "
                                        : val.pass_status === -1
                                        ? "fas fa-circle text-red-500 mr-2 "
                                        : null
                                    }
                                  ></i>{" "}
                                  {val.pass_status === 1
                                    ? "ผ่านกิจกรรม"
                                    : val.pass_status === -1
                                    ? "ไม่ผ่านกิจกรรม"
                                    : null}
                                </td>

                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1 text-right">
                                  {/* <Link to="/admin/detailEventAttend">
                                    <button
                                      className="bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                      type="button"
                                    >
                                      <TbIcons.TbFileSearch
                                        style={{ display: "inline" }}
                                      />
                                    </button>
                                  </Link> */}
                                  {val.pass_status === 1
                                        ?  <button
                                        className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={()=> updateNotPassEvent(val.id)}
                                      >
                                        <BsIcons.BsXSquare
                                          style={{ display: "inline" }}
                                        />
                                      </button>
                                        : val.pass_status === -1
                                        ?  <button
                                        className="bg-teal-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={()=> updatePassEvent(val.id)}
                                      >
                                        <AiIcons.AiOutlineCheckSquare
                                          style={{ display: "inline" }}
                                        />
                                      </button>
                                        : null}
                                  
                                 
                                </td>
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        size="lg"
        show={modelNotice}
        onHide={() => setModelNotice(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            ประกาศแจ้งเตือน
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="">
          <Container>
            <Col>
              <Form.Label htmlFor="inputPassword5">รหัสกิจกรรม : </Form.Label>
              <Form.Text id="passwordHelpBlock" muted>
                หห555
              </Form.Text>
            </Col>
            <Row>
              <Col>
                <img
                  src="https://mdbootstrap.com/img/new/standard/city/041.webp"
                  className="img-thumbnail"
                  alt="..."
                  style={{ maxWidth: "100%" }}
                />
              </Col>
              <Col>
                <img
                  src="https://mdbootstrap.com/img/new/standard/city/041.webp"
                  className="img-thumbnail"
                  alt="..."
                  style={{ maxWidth: "100%" }}
                />
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
}

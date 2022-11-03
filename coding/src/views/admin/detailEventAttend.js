import React, { useState, useEffect, useRef } from "react";

// components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";

import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import DropdownButton from "react-bootstrap/DropdownButton";
import * as TbIcons from "react-icons/tb";
import * as AiIcons from "react-icons/ai";
import * as MdIcons from "react-icons/md";
import * as GrIcons from "react-icons/gr";
import * as BsIcons from "react-icons/bs";
import * as ImIcons from "react-icons/im";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link, useParams } from "react-router-dom";
import Axios from "axios";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import QRCode from "qrcode";
import { QrReader } from "react-qr-reader";
import Swal from "sweetalert2";
import { ROOT_SERVER } from "layouts/rootServer.js";

export default function DetailEventAttend() {
  const { event_id } = useParams();
  const user_id_login = parseInt(
    localStorage.getItem("user_id_login").split(",")[0]
  );

  const [modalDetailEvent, setModalDetailEvent] = useState(false);
  const [modalNotice, setModalNotice] = useState(false);
  const [modalRequestUserAttend, setModalRequestUserAttend] = useState(false);
  const [modalCheckName, setModalCheckName] = useState(false);
  const [modalUserData, setModalUserData] = useState(false);
  const [userParticipationList, setUserParticipationList] = useState([]);
  const [userData, setUserData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [eventAnnounceList, setEventAnnounceList] = useState([]);
  const [searchUserByName, setSearchUserByName] = useState("");
  const [checkNameCreatedList, setCheckNameCreatedList] = useState([]);
  const [qrCodeScanModal, setQrCodeScanModal] = useState(false);
  const [scanResultWebCam, setScanResultWebCam] = useState("ยังไม่แสกน");
  const [qrCodeTimesId, setQrCodeTimesId] = useState('');
  const [scanQrCodeStatus, setScanQrCodeStatus] = useState(0);
  const [userParticipationId, setUserParticipationId] = useState([]);
  const [dateTimeCheckNameValue, setDateTimeCheckNameValue] = useState(
    new Date()
  );

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
            response.data.eventData.map(async (val, key) => {
              let responses = await Axios.post(
                ROOT_SERVER+"/queryEventImageByID/" + parseInt(val.id),
                {},
                {
                  headers: {
                    "Content-Type": "image/jpeg",
                    Accept: "application/json",
                    authorization: `Bearer ${token}`,
                  },
                  responseType: "blob",
                }
              ); 
              if (responses.status === 200) {
                const imageObjectURL = URL.createObjectURL(responses.data);
                setEventData([
                  { 
                    event_code: response.data.eventData[0].event_code,
                    name: response.data.eventData[0].name,
                    u_name: response.data.eventData[0].u_name,
                    ur_name: response.data.eventData[0].ur_name,
                    event_role_name: response.data.eventData[0].event_role_name,
                    members_number: response.data.eventData[0].members_number,
                    quantity: response.data.eventData[0].quantity,
                    term: response.data.eventData[0].term,
                    year: response.data.eventData[0].year,
                    slf_hour: response.data.eventData[0].slf_hour,
                    location: response.data.eventData[0].location,
                    p_time_start: response.data.eventData[0].p_time_start,
                    p_time_end: response.data.eventData[0].p_time_end,
                    time_start: response.data.eventData[0].time_start,
                    time_end: response.data.eventData[0].time_end,
                    detail: response.data.eventData[0].detail,
                    name_prefix: response.data.eventData[0].name_prefix,
                    name: response.data.eventData[0].name,
                    surname: response.data.eventData[0].surname,
                    event_image: imageObjectURL,
                  },
                ]);
              }
            });
          }
        });

        Axios.post(
          ROOT_SERVER+"/queryUserParticipationBystatusAndEventID",
          {
            status: 1,
            event_id: event_id,
          }
        ).then((response) => {
          if (response.data.status === 1) {
            setUserParticipationList(response.data.userParticipationList);
          }
        });

        Axios.post(
          ROOT_SERVER+"/queryEventParticipationId",
          {
            user_participation_id: user_id_login,
            event_id: event_id,
          }
        ).then((response) => {
          if (response.data.status === 1) {
            setUserParticipationId(response.data.userParticipationId);
          }
        });
      } else {
        localStorage.removeItem("token");
        window.location = "/auth/login";
      }
    });
  }, []);

  const showModalDetailEvent = async () => {
    setModalDetailEvent(true);
  };

  const showModalUserData = async (user_id) => {
    setModalUserData(true);
    try {
      const { data } = await Axios.post(
        ROOT_SERVER+"/queryUserDataByID",
        {
          user_id: user_id,
        }
      );
      if (data.status === 1) {
        let responses = await Axios.post(
          ROOT_SERVER+"/queryUserImageByID/" +
            parseInt(data.userData[0].id),
          {},
          {
            headers: {
              "Content-Type": "image/jpeg",
              Accept: "application/json",
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            responseType: "blob",
          }
        );
        if (responses.status === 200) {
          const imageObjectURL = URL.createObjectURL(responses.data);
          setUserData([
            {
              allEventCreate: data.userData[0].allEventCreate,
              allEventParticipation: data.userData[0].allEventParticipation,
              nickname: data.userData[0].nickname,
              name_prefix: data.userData[0].name_prefix,
              name: data.userData[0].name,
              surname: data.userData[0].surname,
              ur_name: data.userData[0].ur_name,
              user_code: data.userData[0].user_code,
              student_year: data.userData[0].student_year,
              b_name: data.userData[0].b_name,
              f_name: data.userData[0].f_name,
              user_image: imageObjectURL,
            },
          ]);
        }
      }
    } catch (error) {
      this.setState({ error });
    }
  };

  const showModalNotice = async () => {
    setModalNotice(true);
    setEventAnnounceList([]);
    try {
      const { data } = await Axios.post(
        ROOT_SERVER+"/queryEventAnnounceByEventID",
        {
          event_id: event_id,
        }
      );
      console.log(data);
      if (data.status === 1) {
        data.eventAnnounceList.map(async (val, key) => {
          let responses = await Axios.post(
            ROOT_SERVER+"/queryUserImageByID/" + parseInt(val.user_id),
            {},
            {
              headers: {
                "Content-Type": "image/jpeg",
                Accept: "application/json",
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              responseType: "blob",
            }
          );
          if (responses.status === 200) {
            const imageObjectURL = URL.createObjectURL(responses.data);
            setEventAnnounceList((eventAnnounceList) => [
              ...eventAnnounceList,
              {
                data: val.data,
                event_id: val.event_id,
                id: val.id,
                name: val.name,
                name_prefix: val.name_prefix,
                surname: val.surname,
                time_announce: val.time_announce,
                user_image: imageObjectURL,
              },
            ]);
          }
        });
      }
    } catch (error) {
      this.setState({ error });
    }
  };

  const showModalCheckName = async () => {
    setModalCheckName(true);
    const { data } = await Axios.post(
      ROOT_SERVER+"/queryCheckNameCreatedListByEventID",
      {
        event_participation_id: userParticipationId[0].id,
        event_id: event_id,
      }
    );
    console.log(data.status+","+userParticipationId[0].id+","+event_id);
    if (data.status === 1) {
      setCheckNameCreatedList(data.checkNameCreatedList);
    }
  };

  const showQrCodeScanModal = async (times_id) => {
    try {
      setScanResultWebCam("ยังไม่แสกน");
      setQrCodeTimesId(times_id);
      setQrCodeScanModal(true);
    } catch (error) {
      console.log(error);
    }
  };
 
  const handleScanWebCam = (data) => {
    if (data) {
      const textQrCode = event_id+"_"+qrCodeTimesId;
      if(data == textQrCode){ 
        setScanQrCodeStatus(1)
        setScanResultWebCam("Qr Code ถูกต้อง");
      } else { 
        setScanQrCodeStatus(0)
        setScanResultWebCam("Qr Code ไม่ถูกต้อง");
      }
    }
  };

  const checkName = () => {
    let check_name_time_reg =
    dateTimeCheckNameValue.getFullYear() +
      "-" +
      (dateTimeCheckNameValue.getMonth() + 1) +
      "-" +
      dateTimeCheckNameValue.getDate() +
      " " +
      dateTimeCheckNameValue.getHours() +
      ":" +
      dateTimeCheckNameValue.getMinutes();

    console.log(userParticipationId[0].id+","+qrCodeTimesId+","+check_name_time_reg)
    Swal.fire({
      title: "ต้องการเช็คชื่อหรือไม่?",
      text: " ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "	#198754",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {

        if (scanQrCodeStatus != 1) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "ยังแสกนเช็คชื่อไม่สำเร็จ",
            showConfirmButton: false,
            timer: 3000,
          });
          return
        }

        try {
          const { data } = await Axios.post(
            ROOT_SERVER+"/addCheckNameByUserParticipation",
            {
              time_reg: check_name_time_reg,
              event_participation_id: userParticipationId[0].id,
              check_name_created_id: qrCodeTimesId
            }
          ); 
          if (data) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "เช็คชื่อสำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setQrCodeScanModal(false)
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "เช็คชื่อไม่สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setQrCodeScanModal(false)
          }
        } catch (error) {}
      }
    });
  };

  const cancelCheckName = (check_name_created_id) => { 

     
    Swal.fire({
      title: "ต้องการยกเลิกการเช็คชื่อหรือไม่?",
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
            ROOT_SERVER+"/deleteCheckNameParticipation",
            { 
              event_participation_id: userParticipationId[0].id,
              check_name_created_id: check_name_created_id
            }
          ); 
          if (data) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "ยกเลิกการเช็คชื่อสำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            }); 
            setModalCheckName(false)
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "ยกเลิกการเช็คชื่อไม่สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            }); 
            setModalCheckName(false)
          }
        } catch (error) {}
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
                    ชื่อกิจกรรมที่เข้าร่วม :{" "}
                    {eventData.length <= 0 ? "" : eventData[0].name}
                  </h3>
                  <h3 className="text-blueGray-700 text-xl font-bold text-right">
                    {eventData.length <= 0
                      ? ""
                      : eventData[0].members_number +
                        "/" +
                        eventData[0].quantity}
                  </h3>
                </div>
              </div>
              <div className="flex-auto px-4 lg:px-8 py-2  pt-0">
                <button
                  className="mt-3 bg-indigo-500 text-white active:bg-orange-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => showModalDetailEvent()}
                >
                  รายละเอียด{" "}
                  <TbIcons.TbFileSearch style={{ display: "inline" }} />
                </button>
                <button
                  className="mt-3 bg-pink-500 text-white active:bg-orange-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => showModalNotice()}
                >
                  ประกาศ <TbIcons.TbFileSearch style={{ display: "inline" }} />
                </button>

                <button
                  className="mt-3 bg-emerald-500 text-white active:bg-orange-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => showModalCheckName()}
                >
                  เช็คชื่อ{" "}
                  <AiIcons.AiFillCheckSquare style={{ display: "inline" }} />
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
                          ผู้เข้าร่วมกิจกรรม
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
                                setSearchUserByName(e.target.value);
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
                          ชื่อ/นามสกุล
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          ชื่อเล่น
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          ระดับผู้ใช้
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          คณะ
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          สาขา
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {userParticipationList.length <= 0 ? (
                        <td
                          className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
                          colSpan={8}
                        >
                          ไม่มีผู้เข้าร่วม
                        </td>
                      ) : (
                        userParticipationList
                          .filter((val) => {
                            if (searchUserByName === "") {
                              return val;
                            } else if (
                              val.fullName
                                .toLowerCase()
                                .includes(searchUserByName.toLowerCase())
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
                                  {val.user_code}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.fullName}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.nickname}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.ur_name}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.uf_name}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.ub_name}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1 text-right">
                                  <button
                                    className="bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => showModalUserData(val.id)}
                                  >
                                    <TbIcons.TbFileSearch
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
          </div>
        </div>
      </div>
      <Modal
        size="xl"
        show={modalUserData}
        onHide={() => setModalUserData(false)}
        aria-labelledby="example-modal-sizes-title-xl"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-xl">
            รายละเอียดผู้ใช้
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6  rounded-lg mt-16">
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="w-full px-4 flex justify-center">
                  <div className="relative">
                    <img
                      alt="..."
                      src={userData.length > 0 ? userData[0].user_image : ""}
                      className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"
                    />
                  </div>
                </div>
                <div className="w-full px-4 text-center mt-20">
                  <div className="flex justify-center py-4 lg:pt-4 pt-8">
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                        {userData.length > 0 ? userData[0].allEventCreate : ""}
                      </span>
                      <span className="text-sm text-blueGray-400">
                        กิจกรรมที่สร้าง
                      </span>
                    </div>
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                        {userData.length > 0
                          ? userData[0].allEventParticipation
                          : ""}
                      </span>
                      <span className="text-sm text-blueGray-400">
                        กิจกรรมที่เข้าร่วม
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center ">
                <h3 className="text-xl font-semibold leading-normal text-blueGray-700 mb-2">
                  {userData.length > 0
                    ? userData[0].name_prefix +
                      "" +
                      userData[0].name +
                      " " +
                      userData[0].surname +
                      " (" +
                      userData[0].nickname +
                      ")"
                    : ""}
                </h3>
                <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                  {userData.length > 0
                    ? "ระดับผู้ใช้ : " +
                      userData[0].ur_name +
                      ",   รหัสผู้ใช้ : " +
                      userData[0].user_code +
                      ",   ชั้นปี : " +
                      userData[0].student_year
                    : ""}
                </div>

                <div className="mb-2 text-blueGray-600">
                  <i className="fas fa-university mr-2 text-lg text-blueGray-400"></i>
                  {userData.length > 0
                    ? "สาขา : " +
                      userData[0].b_name +
                      ",   คณะ : " +
                      userData[0].f_name
                    : ""}
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      <Modal
        size="lg"
        show={modalDetailEvent}
        onHide={() => setModalDetailEvent(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            รายละเอียดกิจกรรม
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="">
          <Container>
            <Row>
              <Col>
                <Form.Label htmlFor="inputPassword5">รหัสกิจกรรม : </Form.Label>
                <Form.Text id="passwordHelpBlock" muted>
                  {eventData.length <= 0 ? null : " " + eventData[0].event_code}
                </Form.Text>
              </Col>
              <Col>
                <Form.Label htmlFor="inputPassword5">ชื่อกิจกรรม : </Form.Label>
                <Form.Text id="passwordHelpBlock" muted>
                  {eventData.length <= 0 ? null : " " + eventData[0].name}
                </Form.Text>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Label htmlFor="inputPassword5">
                  ระดับกิจกรรม :{" "}
                </Form.Label>
                <Form.Text id="passwordHelpBlock" muted>
                  {eventData.length <= 0
                    ? null
                    : " " + eventData[0].event_role_name}
                </Form.Text>
              </Col>
              <Col>
                <Form.Label htmlFor="inputPassword5">
                  จำนวนผู้เข้าร่วม :{" "}
                </Form.Label>
                <Form.Text id="passwordHelpBlock" muted>
                  {eventData.length <= 0
                    ? null
                    : " " +
                      eventData[0].members_number +
                      "/" +
                      eventData[0].quantity}{" "}
                  คน
                </Form.Text>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Label htmlFor="inputPassword5">ภาคเรียน : </Form.Label>
                <Form.Text id="passwordHelpBlock" muted>
                  {eventData.length <= 0
                    ? null
                    : " " + eventData[0].term + "/" + eventData[0].year}
                </Form.Text>
              </Col>
              <Col>
                <Form.Label htmlFor="inputPassword5">
                  ชั่วโมง กยศ. :{" "}
                </Form.Label>
                <Form.Text id="passwordHelpBlock" muted>
                  {eventData.length <= 0 ? null : " " + eventData[0].slf_hour}{" "}
                  ชั่วโมง
                </Form.Text>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Label htmlFor="inputPassword5">
                  ผู้จัดตั้งกิจกรรม :{" "}
                </Form.Label>
                <Form.Text id="passwordHelpBlock" muted>
                  {eventData.length <= 0
                    ? null
                    : " " +
                      eventData[0].name_prefix +
                      "" +
                      eventData[0].u_name +
                      " " +
                      eventData[0].surname}
                </Form.Text>
              </Col>
              <Col>
                <Form.Label htmlFor="inputPassword5">ระดับผู้ใช้ : </Form.Label>
                <Form.Text id="passwordHelpBlock" muted>
                  {eventData.length <= 0 ? null : " " + eventData[0].ur_name}
                </Form.Text>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label htmlFor="inputPassword5">สถานที่ : </Form.Label>
                <Form.Text id="passwordHelpBlock" muted>
                  {eventData.length <= 0 ? null : " " + eventData[0].location}
                </Form.Text>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Label htmlFor="inputPassword5">
                  วันที่เปิด-ปิดการขอเข้าร่วม :{" "}
                </Form.Label>
                <Form.Text id="passwordHelpBlock" muted>
                  {eventData.length <= 0
                    ? null
                    : " " +
                      eventData[0].p_time_start +
                      " ถึง " +
                      eventData[0].p_time_end}
                </Form.Text>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Label htmlFor="inputPassword5">
                  ช่วงเวลาของกิจกรรม :{" "}
                </Form.Label>
                <Form.Text id="passwordHelpBlock" muted>
                  {eventData.length <= 0
                    ? null
                    : " " +
                      eventData[0].time_start +
                      " ถึง " +
                      eventData[0].time_end}
                </Form.Text>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label htmlFor="inputPassword5">
                  รายละเอียดกิจกรรม :{" "}
                </Form.Label>
                <Form.Text id="passwordHelpBlock" muted>
                  {eventData.length <= 0 ? null : " " + eventData[0].detail}
                </Form.Text>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label >
                  รูปภาพกิจกรรม :{" "}
                </Form.Label>
              </Col>
            </Row>
            <div className="flex flex-wrap justify-center mt-2">
              <div className="w-4/12 sm:w-4/12 px-4">
                <img
                  className="rounded-t-lg"
                  src={
                    eventData.length <= 0
                      ? null
                      : " " + eventData[0].event_image
                  }
                  alt=""
                />
              </div>
            </div>
          </Container>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      <Modal
        size="xl"
        show={modalNotice}
        onHide={() => setModalNotice(false)}
        aria-labelledby="example-modal-sizes-title-xl"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-xl">
            ประกาศแจ้งเตือน
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          className=""
          style={{ overflowY: "scroll", height: "550px" }}
        >
          {eventAnnounceList.length <= 0 ? (
            <div className="text-center  p-3">
              <Form.Label>ยังไม่มีการประกาศ</Form.Label>
            </div>
          ) : (
            <ToastContainer className="p-1">
              {eventAnnounceList.map((val, key) => {
                return (
                  <Toast className=" float-left" style={{ width: "85%" }}>
                    <Toast.Header closeButton={false}>
                      <img
                        src={val.user_image}
                        width="7%"
                        className="rounded me-2"
                        alt=""
                      />
                      <strong className="me-auto">
                        {val.name_prefix + "" + val.name + " " + val.surname}
                      </strong>
                      <small>{val.time_announce}</small>
                    </Toast.Header>
                    <Toast.Body>{val.data}</Toast.Body>
                  </Toast>
                );
              })}
            </ToastContainer>
          )}
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      <Modal
        size="lg"
        show={modalRequestUserAttend}
        onHide={() => setModalRequestUserAttend(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            คำขอเข้าร่วม
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="">
          <Container>
            <Row>
              <Col sm={6} lg={6} xl={6}>
                <Form.Label htmlFor="inputPassword5">ชื่อกิจกรรม : </Form.Label>
                <Form.Text id="passwordHelpBlock" muted>
                  uiouoo
                </Form.Text>
              </Col>
              <Col sm={6} lg={6} xl={6}>
                <Form.Label htmlFor="inputPassword5">จำนวน : </Form.Label>
                <Form.Text id="passwordHelpBlock" muted>
                  15 คน
                </Form.Text>
              </Col>

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
                            รหัสประจำตัว
                          </th>
                          <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                            ชื่อจริง/นามสกุล
                          </th>
                          <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                            ระดับผู้ใช้
                          </th>

                          <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            1
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            1
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            $2,500 USD
                          </td>

                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            ก
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                            <button
                              className="bg-indigo-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                              type="button"
                            >
                              <TbIcons.TbFileSearch
                                style={{ display: "inline" }}
                              />
                            </button>
                            <button
                              className="bg-teal-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                              type="button"
                            >
                              <AiIcons.AiOutlineCheckSquare
                                style={{ display: "inline" }}
                              />
                            </button>
                            <button
                              className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                              type="button"
                            >
                              <BsIcons.BsXSquare
                                style={{ display: "inline" }}
                              />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="bg-teal-500 text-white active:bg-teal-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
          >
            ยือนุมัติทั้งหมด{" "}
            <AiIcons.AiOutlineCheckSquare style={{ display: "inline" }} />
          </button>
          <button
            className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
          >
            ไม่อนุมัติทั้งหมด{" "}
            <BsIcons.BsXSquare style={{ display: "inline" }} />
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        size="lg"
        show={modalCheckName}
        onHide={() => setModalCheckName(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">เช็คชื่อ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {checkNameCreatedList.length <= 0 ? (
            <div className="text-center  p-3">
              <Form.Label>ยังไม่มีการสร้างการเช็คชื่อ</Form.Label>
            </div>
          ) : (
            checkNameCreatedList.map((val, key) => {
              return (
                <Card className="mb-3">
                  <Card.Header>เช็คชื่อครั้งที่ {val.times}</Card.Header>
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        เวลาเช็คชื่อ :
                        {" " +
                          val.check_start_time_reg_ch +
                          " ถึง " +
                          val.check_end_time_reg_ch}{" "}
                      </Form.Label>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>สถานะ : {val.check_name_status_name}</Form.Label>
                    </Form.Group>
                    <div className="text-center">
                      {val.check_name_status == 0 ?  <button
                        className="bg-teal-500 text-white active:bg-teal-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => showQrCodeScanModal(val.id)}
                      >
                        เช็คชื่อ{" "}
                        <AiIcons.AiOutlineSave style={{ display: "inline" }} />
                      </button>: <button
                        className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={()=>cancelCheckName(val.id)}
                      >
                        ยกเลิกการเช็คชื่อ{" "}
                        <ImIcons.ImCancelCircle style={{ display: "inline" }} />
                      </button>}
                     
                      
                    </div>
                  </Card.Body>
                </Card>
              );
            })
          )}
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      <Modal
        size="lg"
        show={qrCodeScanModal}
        onHide={() => setQrCodeScanModal(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            แสกน Qr Code เช็คชื่อ
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <QrReader
          
            delay={300} 
            onScan={handleScanWebCam}
            style={{ width: "100%" }}
            onstraints={{facingMode: 'environment'}}
          />
          <p>{scanResultWebCam}</p>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="bg-teal-500 text-white active:bg-teal-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button" 
            onClick={()=> checkName()}
          >
            เช็คชื่อ <AiIcons.AiOutlineSave style={{ display: "inline" }} />
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

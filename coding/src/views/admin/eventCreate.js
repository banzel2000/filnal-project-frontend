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
import * as MdIcons from "react-icons/md";
import * as ImIcons from "react-icons/im";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Axios from "axios";
import * as GrIcons from "react-icons/gr";
import Swal from "sweetalert2";
import DateTimePicker from "react-datetime-picker";
import ReactPaginate from "react-paginate";
import Resizer from "react-image-file-resizer";
import { ROOT_SERVER } from "layouts/rootServer.js";

export default function EventCreate() {
  const [modalAddEvent, setModalAddEvent] = useState(false);
  const [modelEventWorking, setModelEventWorking] = useState(false);
  const [eventCreateWorkingList, setEventCreateWorkingList] = useState([]);
  const [eventCreateEndedList, setEventCreateEndedList] = useState([]);
  const [eventCreateWaitingList, setEventCreateWaitingList] = useState([]);
  const [userData, setUserData] = useState([]);
  const [dateTimePickePreStartValue, setDateTimePickerPreStartOnChange] =
    useState(new Date());
  const [dateTimePickePreEndValue, setDateTimePickerPreEndOnChange] = useState(
    new Date()
  );
  const [dateTimePickeStartValue, setDateTimePickerStartOnChange] = useState(
    new Date()
  );
  const [dateTimePickeEndValue, setDateTimePickerEndOnChange] = useState(
    new Date()
  );
  const [disabledDTPreEnd, setDisabledDTPreEnd] = useState(true);
  const [disabledDTPreStart, setDisabledDTPreStart] = useState(true);
  const [disabledDTEnd, setDisabledDTEnd] = useState(true);
  const [termOnChange, setTermOnChange] = useState(0);
  const [searchEventWorkingByName, setSearchEventWorkingByName] = useState("");
  const [searchEventEndedByName, setSearchEventEndedByName] = useState("");

  const user_id_login = parseInt(
    localStorage.getItem("user_id_login").split(",")[0]
  );
  const user_role_id_login = parseInt(
    localStorage.getItem("user_id_login").split(",")[1]
  );

  const [pageNumber, setPageNumber] = useState(0);
  const [pageNumber2, setPageNumber2] = useState(0);

  const usersPerPage = 5;
  const pagesVisited = pageNumber * usersPerPage;
  const pagesVisited2 = pageNumber2 * usersPerPage;
  const [eventImage, setEventImage] = useState("");
  const [eventShowImage, setEventShowImage] = useState(null);
  const [eventCreateProofShowImage, setEventCreateProofShowImage] =
    useState(null);
  const [eventImageCreateProof, setEventImageCreateProof] = useState("");
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const changePage2 = ({ selected }) => {
    setPageNumber2(selected);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setDateTimePickerPreStartOnChange(null);
    setDateTimePickerPreEndOnChange(null);
    setDateTimePickerStartOnChange(null);
    setDateTimePickerEndOnChange(null);

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
        window.location = "/login/auth/login";
      }
    });

    Axios.post(ROOT_SERVER+"/queryUserDataByID", {
      user_id: user_id_login,
    }).then((response) => {
      if (response.data.status === 1) {
        setUserData(response.data.userData);
      }
    });

    Axios.post(ROOT_SERVER+"/queryEventCreateByUserCreateID", {
      user_create_id: user_id_login,
      event_status: "working",
    }).then((response) => {
      if (response.data.status === 1) {
        setEventCreateWorkingList(response.data.eventCreateList);
      }
    });

    Axios.post(ROOT_SERVER+"/queryEventCreateByUserCreateID", {
      user_create_id: user_id_login,
      event_status: "ended",
    }).then((response) => {
      if (response.data.status === 1) {
        setEventCreateEndedList(response.data.eventCreateList);
      }
    });
  }, []);

  const pageCount = Math.ceil(eventCreateWorkingList.length / usersPerPage);

  const pageCount2 = Math.ceil(eventCreateEndedList.length / usersPerPage);

  const showEventCreateWaitingModal = async () => {
    setModelEventWorking(true);
    try {
      const { data } = await Axios.post(
        ROOT_SERVER+"/queryEventCreateWaitingByUserID",
        {
          user_create_id: user_id_login,
          user_role_id: user_role_id_login,
          f_id: userData[0].f_id,
          b_id: userData[0].b_id,
        }
      );
      if (data.status === 1) {
        setEventCreateWaitingList(data.eventCreateWaitingList);
      } else if (data.status === 0) {
        console.log(" ไม่มีกิจกรรม");
      }
    } catch (error) {
      this.setState({ error });
    }
  };

  const deleteEventCreateWaitingByEventID = async (event_id) => {
    Swal.fire({
      title: "คุณต้องการยกเลิกคำขอสร้างกิจกรรมหรือไม่?",
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
            ROOT_SERVER+"/deleteEventCreateWaitingByEventID",
            {
              event_id: event_id,
            }
          );
          if (data) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "ยกเลิกสำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setModelEventWorking(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "ยกเลิกไม่สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setModelEventWorking(false);
          }
        } catch (error) {
          this.setState({ error });
        }
      }
    });
  };

  const addEventCreate = async () => {
    const fd = new FormData();
    const fd2 = new FormData(); 
    let event_code = document.getElementById("event_code").value; 
    let event_name = document.getElementById("event_name").value;
    let slf_hour = document.getElementById("slf_hour").value;
    let quantity = document.getElementById("quantity").value;
    let year = document.getElementById("year").value;
    let location = document.getElementById("location").value;
    let detail = document.getElementById("detail").value; 
    let image = eventImage;
    let image_create_proof = eventImageCreateProof;
    let er_id = document.getElementById("er_id").value;
    let f_id = document.getElementById("f_id").value; 
    let b_id = document.getElementById("b_id").value; 
    let create_status = 0;
    
    Swal.fire({
      title: "คุณต้องการสร้างกิจกรรมหรือไม่?",
      text: " ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "	#198754",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (
          (event_code === "" && user_role_id_login !== 1) ||
          event_name === "" ||
          slf_hour === "" ||
          quantity === "" ||
          parseInt(termOnChange) === 0 ||
          year === "" ||
          location === "" ||
          detail === "" || 
          (image_create_proof === "" && user_role_id_login === 1) ||
          image === "" ||
          dateTimePickePreStartValue === null ||
          dateTimePickePreEndValue === null ||
          dateTimePickeStartValue === null ||
          dateTimePickeEndValue === null
        ) {
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
          let pre_start_time_reg =
            dateTimePickePreStartValue.getFullYear() +
            "-" +
            (dateTimePickePreStartValue.getMonth() + 1) +
            "-" +
            dateTimePickePreStartValue.getDate() +
            " " +
            dateTimePickePreStartValue.getHours() +
            ":" +
            dateTimePickePreStartValue.getMinutes();
          let pre_end_time_reg =
            dateTimePickePreEndValue.getFullYear() +
            "-" +
            (dateTimePickePreEndValue.getMonth() + 1) +
            "-" +
            dateTimePickePreEndValue.getDate() +
            " " +
            dateTimePickePreEndValue.getHours() +
            ":" +
            dateTimePickePreEndValue.getMinutes();
          let event_start_time_reg =
            dateTimePickeStartValue.getFullYear() +
            "-" +
            (dateTimePickeStartValue.getMonth() + 1) +
            "-" +
            dateTimePickeStartValue.getDate() +
            " " +
            dateTimePickeStartValue.getHours() +
            ":" +
            dateTimePickeStartValue.getMinutes();
          let event_end_time_reg =
            dateTimePickeEndValue.getFullYear() +
            "-" +
            (dateTimePickeEndValue.getMonth() + 1) +
            "-" +
            dateTimePickeEndValue.getDate() +
            " " +
            dateTimePickeEndValue.getHours() +
            ":" +
            dateTimePickeEndValue.getMinutes();

          if (user_role_id_login !== 1) {
            create_status = 1;
          }

          fd.append("event_code", event_code);
          fd.append("name", event_name);
          fd.append("slf_hour", slf_hour);
          fd.append("quantity", quantity);
          fd.append("term", termOnChange);
          fd.append("year", year);
          fd.append("location", location);
          fd.append("pre_start_time_reg", pre_start_time_reg);
          fd.append("pre_end_time_reg", pre_end_time_reg);
          fd.append("event_start_time_reg", event_start_time_reg);
          fd.append("event_end_time_reg", event_end_time_reg);
          fd.append("detail", detail);
          fd.append("image", image);
          fd.append("create_status", create_status);
          fd.append("user_create_id", user_id_login);
          fd.append("event_role_id", er_id);
          fd.append("branch_id", b_id);
          fd.append("faculty_id", f_id);

          const { data } = await Axios.post(
            ROOT_SERVER+"/addEventCreate",
            fd
          );
          if (data.status === -1) {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "รหัสกิจกรรมซ้ำ",
              showConfirmButton: false,
              timer: 3000,
            });
          } else  {
            if (user_role_id_login === 1) {
              fd2.append("e_id", data.data);
              fd2.append("image", image_create_proof);
              try {
                Axios.post(
                  ROOT_SERVER+"/addEventCreateImageCreateProof",
                  fd2
                ).then((response) => { 
                  if (response.data.status === 1) {
                    Swal.fire({
                      position: "center",
                      icon: "success",
                      title: "สร้างกิจกรรมสำเร็จ",
                      showConfirmButton: false,
                      timer: 3000,
                    });
                    setModalAddEvent(false);
                    window.location.reload(false);
                  } else {
                    Swal.fire({
                      position: "center",
                      icon: "error",
                      title: "สร้างกิจกรรมไม่สำเร็จ",
                      showConfirmButton: false,
                      timer: 3000,
                    });
                    setModalAddEvent(false);
                    window.location.reload(false);
                  }
                });
              } catch (error) {
                this.setState({ error });
              }
            } else {
              if (data.status === 1) {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "สร้างกิจกรรมสำเร็จ",
                  showConfirmButton: false,
                  timer: 3000,
                });
                setModalAddEvent(false);
                window.location.reload(false);
              } else {
                Swal.fire({
                  position: "center",
                  icon: "error",
                  title: "สร้างกิจกรรมไม่สำเร็จ",
                  showConfirmButton: false,
                  timer: 3000,
                });
                setModalAddEvent(false);
                window.location.reload(false);
              }
            }
          } 
        } catch (error) {
          this.setState({ error });
        }
      }
    });
  };

  const showModalAddEvent = async () => {
    setModalAddEvent(true);
  };

  const onChangeHandlerDTStart = async (newValueS) => {
    setDateTimePickerStartOnChange(newValueS);
    setDisabledDTEnd(false);

    if (newValueS === null) {
      setDisabledDTEnd(true);
      setDisabledDTPreStart(true);
      setDisabledDTPreEnd(true);
      setDateTimePickerEndOnChange(null);
      setDateTimePickerPreStartOnChange(null);
      setDateTimePickerPreEndOnChange(null);
    } else if (
      (newValueS > dateTimePickeEndValue && dateTimePickeEndValue != null) ||
      (newValueS < dateTimePickePreStartValue &&
        dateTimePickePreStartValue != null)
    ) {
      setDisabledDTPreEnd(true);
      setDisabledDTPreStart(true);
      setDisabledDTEnd(true);
      setDateTimePickerEndOnChange(null);
      setDateTimePickerPreStartOnChange(null);
      setDateTimePickerPreEndOnChange(null);
      setDisabledDTEnd(false);
    }
  };

  const onChangeHandlerDTEnd = async (newValueE) => {
    setDateTimePickerEndOnChange(newValueE);
    setDisabledDTPreStart(false);

    if (newValueE === null) {
      setDisabledDTPreStart(true);
      setDisabledDTPreEnd(true);
      setDateTimePickerPreStartOnChange(null);
      setDateTimePickerPreEndOnChange(null);
    } else if (
      newValueE < dateTimePickeStartValue &&
      dateTimePickeStartValue != null
    ) {
      setDisabledDTPreStart(true);
      setDisabledDTPreEnd(true);
      setDateTimePickerEndOnChange(null);
      setDateTimePickerPreStartOnChange(null);
      setDateTimePickerPreEndOnChange(null);
    }
  };

  const onChangeHandlerDTPreStart = async (newValuePS) => {
    setDateTimePickerPreStartOnChange(newValuePS);
    setDisabledDTPreEnd(false);
    if (newValuePS === null) {
      setDisabledDTPreEnd(true);
      setDateTimePickerPreEndOnChange(null);
    } else if (
      newValuePS > dateTimePickePreEndValue &&
      dateTimePickePreEndValue != null
    ) {
      setDisabledDTPreEnd(true);
      setDateTimePickerPreEndOnChange(null);
      setDisabledDTPreEnd(false);
    }
  };

  const onChangeHandlerDTPreEnd = async (newValuePE) => {
    setDateTimePickerPreEndOnChange(newValuePE);
    if (
      newValuePE < dateTimePickePreStartValue &&
      dateTimePickePreStartValue != null
    ) {
      setDateTimePickerPreEndOnChange(null);
    }
  };

  const deleteEvent = async (e_id) => {
    Swal.fire({
      title: "ต้องการลบกิจกรรมที่สร้างหรือไม่?",
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
            ROOT_SERVER+"/deleteEvent",
            {
              e_id: e_id,
            }
          );
          if (data) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "ลบกิจกรรมที่สร้างสำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "ลบกิจกรรมที่สร้างไม่สำเร็จ",
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

  const setImage = ({ target: { files } }) => {
    console.log("setImage" + files[0]);
    var fileInput = false;
    if (files[0]) {
      fileInput = true;
    }
    if (fileInput) {
      try {
        Resizer.imageFileResizer(
          files[0],
          640,
          480,
          "JPEG",
          100,
          0,
          (uri) => {
            imageHandler(files[0]);
            setEventImage(uri);
          },
          "file",
          640,
          480
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const setImageCreateProof = ({ target: { files } }) => {
    console.log("setImageCreateProof" + files[0]);
    var fileInput = false;
    if (files[0]) {
      fileInput = true;
    }
    if (fileInput) {
      try {
        Resizer.imageFileResizer(
          files[0],
          640,
          480,
          "JPEG",
          100,
          0,
          (uri) => {
            imageCreateProofHandler(files[0]);
            setEventImageCreateProof(uri);
          },
          "file",
          640,
          480
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const imageHandler = (imag) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setEventShowImage(reader.result);
      }
    };
    reader.readAsDataURL(imag);
  };

  const imageCreateProofHandler = (imag) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setEventCreateProofShowImage(reader.result);
      }
    };
    reader.readAsDataURL(imag);
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
                    สร้างกิจกรรม
                  </h3>
                </div>
              </div>
              <div className="flex-auto px-4 lg:px-8 py-2  pt-0">
                {user_role_id_login === 6 ? (
                  ""
                ) : (
                  <button
                    className="mt-3 bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => showModalAddEvent()}
                  >
                    สร้างกิจกรรม{" "}
                    <MdIcons.MdOutlineAddBox style={{ display: "inline" }} />
                  </button>
                )}
                {user_role_id_login != 1 ? (
                  ""
                ) : (
                  <button
                    className="mt-3 bg-orange-500 text-white active:bg-orange-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => showEventCreateWaitingModal()}
                  >
                    กิจกรรมที่รอการอนุมัติการสร้าง{" "}
                    <AiIcons.AiOutlineFieldTime style={{ display: "inline" }} />
                  </button>
                )}

                <Link to="/admin/setStatusUserAttend">
                  <button
                    className="mt-3 bg-purple-500 text-white active:bg-purple-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                  >
                    สถานะของผู้ร่วมกิจกรรม{" "}
                    <TbIcons.TbFileSearch style={{ display: "inline" }} />
                  </button>
                </Link>
              </div>
            </div>

            <div className="w-full ">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white ">
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                  <div className="flex flex-wrap items-center">
                    <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap ">
                      <div className="sm:w-6/12 lg:w-6/12 xl:w-8/12 ">
                        <h3 className="font-semibold text-lg text-blueGray-700">
                          กิจกรรมที่สร้างล่าสุด
                          {"(" + eventCreateWorkingList.length + ")"}
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
                    <tbody>
                      {eventCreateWorkingList.length <= 0 ? (
                        <td
                          className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
                          colSpan={7}
                        >
                          ไม่มีกิจกรรม
                        </td>
                      ) : (
                        eventCreateWorkingList
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
                                  {val.event_role_name}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.slf_hour}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.members_number + "/" + val.quantity}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  <i className="fas fa-circle text-orange-500 mr-2"></i>{" "}
                                  {val.event_time_status}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1 text-right">
                                  <Link
                                    to={"/admin/detailEventCreate/" + val.id}
                                  >
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
                                    onClick={() => deleteEvent(val.id)}
                                  >
                                    <AiIcons.AiFillDelete />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                  <div class="h-0 my-0 border border-solid border-blueGray-100 "></div>
                  {eventCreateWorkingList.length <= 0 ? null : (
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
            <div className="w-full ">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white ">
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                  <div className="flex flex-wrap items-center">
                    <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap ">
                      <div className="sm:w-6/12 lg:w-6/12 xl:w-8/12 ">
                        <h3 className="font-semibold text-lg text-blueGray-700">
                          กิจกรรมที่เคยสร้าง
                          {"(" + eventCreateEndedList.length + ")"}
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
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventCreateEndedList.length <= 0 ? (
                        <td
                          className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
                          colSpan={7}
                        >
                          ไม่มีกิจกรรม
                        </td>
                      ) : (
                        eventCreateEndedList
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
                          })
                          .map((val, key) => {
                            return (
                              <tr>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {pagesVisited2 + (key + 1)}
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
                                  {val.members_number + "/" + val.quantity}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  <i className="fas fa-circle  text-coolGray-500 mr-2"></i>{" "}
                                  {val.event_time_status}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1 text-right">
                                  <Link
                                    to={"/admin/detailEventCreate/" + val.id}
                                  >
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
                                    onClick={() => deleteEvent(val.id)}
                                  >
                                    <AiIcons.AiFillDelete />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                  <div class="h-0 my-0 border border-solid border-blueGray-100"></div>
                  {eventCreateEndedList.length <= 0 ? null : (
                    <div className="d-flex justify-content-center py-3">
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
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        size="lg"
        show={modalAddEvent}
        onHide={() => setModalAddEvent(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            สร้างกิจกรรม
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="">
          <Container>
            <Row>
              <Col sm={12} lg={4} xl={4}>
                <Form.Group className="mb-3">
                  <Form.Label>รหัสกิจกรรม : </Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    placeholder="กรอก..."
                    id="event_code"
                    maxLength={20}
                    disabled={user_role_id_login === 1 ? true : false}
                  />
                </Form.Group>
              </Col>
              <Col sm={12} lg={8} xl={8}>
                <Form.Group className="mb-3">
                  <Form.Label>ชื่อกิจกรรม : </Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    placeholder="กรอก..."
                    id="event_name"
                    maxLength={50}
                  />
                </Form.Group>
              </Col>
              <Col sm={12} lg={4} xl={4}>
                <Form.Group className="mb-3">
                  <Form.Label>ระดับกิจกรรม : </Form.Label>
                  <Form.Select size="sm" disabled>
                    <option>
                      {userData.length <= 0 ? null : userData[0].er_name}
                    </option>
                  </Form.Select>
                  <input
                    type="hidden"
                    id="er_id"
                    value={userData.length <= 0 ? "" : userData[0].er_id}
                  />
                </Form.Group>
              </Col>
              <Col sm={6} lg={4} xl={4}>
                <Form.Group className="mb-3">
                  <Form.Label>คณะ : </Form.Label>
                  <Form.Select size="sm" disabled>
                    <option>
                      {userData.length <= 0 ? null : userData[0].f_name}
                    </option>
                  </Form.Select>
                  <input
                    type="hidden"
                    id="f_id"
                    value={userData.length <= 0 ? "" : userData[0].f_id}
                  />
                </Form.Group>
              </Col>
              <Col sm={6} lg={4} xl={4}>
                <Form.Group className="mb-3">
                  <Form.Label>สาขา : </Form.Label>
                  <Form.Select size="sm" disabled>
                    <option>
                      {userData.length <= 0 ? null : userData[0].b_name}
                    </option>
                  </Form.Select>
                  <input
                    type="hidden"
                    id="b_id"
                    value={userData.length <= 0 ? "" : userData[0].b_id}
                  />
                </Form.Group>
              </Col>
              <Col sm={4} lg={4} xl={4}>
                <Form.Group className="mb-3">
                  <Form.Label>ชั่วโมง กยศ. : </Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    placeholder="กรอก..."
                    id="slf_hour"
                    maxLength={2}
                    onChange={(e) => {
                      const value = e.target.value;
                      if(!isNaN(+value)){ 
                        if(parseInt(value) > 18){
                          e.target.value = ""
                        } 
                      } else {
                        e.target.value = ""
                      }
                    }}    
                  />
                </Form.Group>
              </Col>
              <Col sm={4} lg={4} xl={4}>
                <Form.Group className="mb-3">
                  <Form.Label>จำนวนผู้เข้าร่วม : </Form.Label>

                  <Form.Control
                    type="text"
                    size="sm"
                    placeholder="กรอก..."
                    id="quantity"
                     onChange={(e) => {
                      const value = e.target.value;
                      if(!isNaN(+value)){ 
                      } else {
                        e.target.value = ""
                      }
                    }}   
                    maxLength={4}
                  />
                </Form.Group>
              </Col>
              <Col sm={4} lg={4} xl={4}>
                <Form.Group className="mb-3">
                  <Form.Label>ภาคเรียน : </Form.Label>
                  <InputGroup>
                    <Form.Select size="sm" onChange={setTermOnChange}>
                      <option id={0}>เลือก</option>
                      <option id={1}>1</option>
                      <option id={2}>2</option>
                      <option id={3}>3</option>
                    </Form.Select>
                    <Form.Control
                      type="text"
                      size="sm"
                      placeholder="ปี พ.ศ."
                      id="year"
                      onChange={(e) => {
                        const value = e.target.value;
                        if(!isNaN(+value)){ 
                        } else {
                          e.target.value = ""
                        }
                      }}   
                      maxLength={4}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col sm={12} lg={12} xl={12}>
                <Form.Group className="mb-3">
                  <Form.Label>สถานที่ : </Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    placeholder="กรอก..."
                    id="location"
                    maxLength={100}
                  />
                </Form.Group>
              </Col>
              <Col sm={8} lg={8} xl={8}>
                <Form.Group className="mb-3">
                  <Form.Label>ผู้จัดตั้งกิจกรรม : </Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    placeholder={
                      userData.length <= 0
                        ? ""
                        : userData[0].name_prefix +
                          "" +
                          userData[0].name +
                          " " +
                          userData[0].surname
                    }
                    disabled
                    id="user_name"
                  />
                </Form.Group>
              </Col>
              <Col sm={4} lg={4} xl={4}>
                <Form.Group className="mb-3">
                  <Form.Label>ระดับผู้ใช้ : </Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    placeholder={
                      userData.length <= 0 ? "" : userData[0].ur_name
                    }
                    disabled
                    id="user_role_name"
                  />
                </Form.Group>
              </Col>
              <Form.Group className="mb-3">
                <Form.Label>ช่วงเวลากิจกรรม : </Form.Label>
                <InputGroup className="mb-3 ">
                  <Row>
                    <Col>
                      {" "}
                      <DateTimePicker
                        onChange={onChangeHandlerDTStart}
                        value={dateTimePickeStartValue}
                        format="dd/MM/y HH:mm"
                      />
                    </Col>{" "}
                    ถึง{" "}
                    <Col>
                      <DateTimePicker
                        disabled={disabledDTEnd}
                        onChange={onChangeHandlerDTEnd}
                        value={dateTimePickeEndValue}
                        format="dd/MM/y HH:mm"
                        minDate={dateTimePickeStartValue}
                      />
                    </Col>
                  </Row>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>วันที่เปิดให้ขอเข้าร่วม : </Form.Label>
                <InputGroup className="mb-3">
                  <Row>
                    <Col>
                      {" "}
                      <DateTimePicker
                        disabled={disabledDTPreStart}
                        onChange={onChangeHandlerDTPreStart}
                        value={dateTimePickePreStartValue}
                        format="dd/MM/y HH:mm"
                        maxDate={dateTimePickeStartValue}
                      />
                    </Col>{" "}
                    ถึง{" "}
                    <Col>
                      <DateTimePicker
                        disabled={disabledDTPreEnd}
                        onChange={onChangeHandlerDTPreEnd}
                        value={dateTimePickePreEndValue}
                        format="dd/MM/y HH:mm"
                        minDate={dateTimePickePreStartValue}
                        maxDate={dateTimePickeEndValue}
                      />
                    </Col>
                  </Row>
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>รายละเอียดกิจกรรม : </Form.Label>
                <Form.Control
                  as="textarea"
                  size="sm"
                  rows={5}
                  id="detail"
                  placeholder="กรอก..."
                  maxLength={1000}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>รูปภาพกิจกรรม : </Form.Label>

                <div className="img-holder">
                  <img src={eventShowImage} alt="" className="img" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  name="image-upload"
                  id="input"
                  onChange={(e) => setImage(e)}
                />
                <div className="label">
                  <label className="image-upload" htmlFor="input">
                    เลือกรูปภาพ
                  </label>
                </div>
              </Form.Group>
              {user_role_id_login !== 1 ? null : (
                <Form.Group className="mb-3">
                  <Form.Label>รูปภาพหลักฐานการสร้างกิจกรรม : </Form.Label>

                  <div className="img-holder">
                    <img
                      src={eventCreateProofShowImage}
                      alt=""
                      className="img"
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    name="image-upload"
                    id="input2"
                    onChange={(e) => setImageCreateProof(e)}
                  />
                  <div className="label">
                    <label className="image-upload" htmlFor="input2">
                      เลือกรูปภาพ
                    </label>
                  </div>
                </Form.Group>
              )}
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => addEventCreate()}
            className="bg-teal-500 text-white active:bg-teal-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
          >
            ยืนยัน <AiIcons.AiOutlineSave style={{ display: "inline" }} />
          </button>
          <button
            onClick={() => setModalAddEvent(false)}
            className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
          >
            ยกเลิก <ImIcons.ImCancelCircle style={{ display: "inline" }} />
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        size="lg"
        show={modelEventWorking}
        onHide={() => setModelEventWorking(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            กิจกรรมที่รอการอนุมัติ
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                    {eventCreateWaitingList.length <= 0 ? (
                      <td
                        className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
                        colSpan={6}
                      >
                        ไม่มีกิจกรรม
                      </td>
                    ) : (
                      eventCreateWaitingList.map((val, key) => {
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
                              {val.members_number + "/" + val.quantity}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1 text-right">
                              <button
                                className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() =>
                                  deleteEventCreateWaitingByEventID(val.id)
                                }
                              >
                                ยกเลิกคำขอ{" "}
                                <AiIcons.AiFillDelete
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
        </Modal.Body>
      </Modal>
    </>
  );
}

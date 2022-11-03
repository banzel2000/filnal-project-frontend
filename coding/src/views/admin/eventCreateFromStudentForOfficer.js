import React, { useState, useEffect } from "react";

// components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import * as TbIcons from "react-icons/tb";
import * as MdIcons from "react-icons/md";
import * as ImIcons from "react-icons/im";
import * as AiIcons from "react-icons/ai";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Axios from "axios";
import Swal from "sweetalert2";
import DateTimePicker from "react-datetime-picker";
import ReactPaginate from "react-paginate";
import Resizer from "react-image-file-resizer";
import { ROOT_SERVER } from "layouts/rootServer.js";

export default function EventCreateFromStudentForOfficer() {
  const user_id_login = localStorage.getItem("user_id_login").split(",")[0];
  const user_role_login = localStorage.getItem("user_id_login").split(",")[1];
  const [searchEventByName, setSearchEventByName] = useState("");
  const [modalEventWaitingCreate, setModalEventWaitingCreate] = useState(false);
  const [eventCreateWaitingList, setEventCreateWaitingList] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);

  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

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

  const [optionEventRoleData, setOptionEventRoleData] = useState(-1);
  const [optionFacultyData, setOptionFacultyData] = useState(-1);
  const [optionBranchData, setOptionBranchData] = useState(-1);
  const [optionEventRoleNameData, setOptionEventRoleNameData] = useState("");
  const [optionFacultyNameData, setOptionFacultyNameData] = useState("");
  const [optionBranchNameData, setOptionBranchNameData] = useState("");

  const [disabledDTPreEnd, setDisabledDTPreEnd] = useState(true);
  const [disabledDTPreStart, setDisabledDTPreStart] = useState(true);
  const [disabledDTEnd, setDisabledDTEnd] = useState(true);
  const [eventData, setEventData] = useState([]);
  const [optionTermData, setOptionTermData] = useState(0);
  const [eventImage, setEventImage] = useState("");
  const [eventShowImage, setEventShowImage] = useState(null);
  const [eventCode, setEventCode] = useState("");
  const [eventCodeStatic, setEventCodeStatic] = useState("");
  const [eventName, setEventName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [slfHour, setSlfHour] = useState("");
  const [location, setLocation] = useState("");
  const [detail, setDetail] = useState("");
  const [year, setYear] = useState("");
  const [createUserId, setCreateUserId] = useState("");
  const [eventCreatePoofImage, setEventCreatePoofImage] = useState("");

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
            Axios.post(
              ROOT_SERVER+"/queryEventCreateWaitingByUserID",
              {
                user_create_id: user_id_login,
                user_role_id: user_role_login,
                f_id: response.data.userData[0].f_id,
                b_id: response.data.userData[0].b_id,
              }
            ).then((response) => {
              if (response.data.status === 1) {
                setEventCreateWaitingList(response.data.eventCreateWaitingList);
                console.log(response.data.eventCreateWaitingList);
              }
            });
          }
        });
      } else {
        localStorage.removeItem("token");
        window.location = "/auth/login";
      }
    });
  }, []);

  const pageCount = Math.ceil(eventCreateWaitingList.length / usersPerPage);

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
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "ยกเลิกไม่สำเร็จ",
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

  const showModalEventWaitingCreate = async (
    event_id,
    term,
    er_name,
    f_name,
    b_name
  ) => {
    console.log(f_name + "," + b_name);
    try {
      setModalEventWaitingCreate(true);

      setDisabledDTEnd(false);
      setDisabledDTPreStart(false);
      setDisabledDTPreEnd(false);
      setOptionTermData(term);
      setOptionEventRoleNameData(er_name);
      setOptionFacultyNameData(f_name);
      setOptionBranchNameData(b_name);
      setDateTimePickerPreStartOnChange(null);
      setDateTimePickerPreEndOnChange(null);
      setDateTimePickerStartOnChange(null);
      setDateTimePickerEndOnChange(null);

      const response = await Axios.post(
        ROOT_SERVER+"/queryEventByEventID",
        {
          user_participation_id: user_id_login,
          event_id: event_id,
        }
      );
      if (response.data.status === 1) {
        let responses = await Axios.post(
          ROOT_SERVER+"/queryEventImageByID/" +
            parseInt(response.data.eventData[0].id),
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
          let responsess = await Axios.post(
            ROOT_SERVER+"/queryEventImageCreateProofByID/" +
              parseInt(response.data.eventData[0].id),
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
          if (responsess.status === 200) {
            const imageObjectURL = URL.createObjectURL(responses.data);
            setEventImage(imageObjectURL);
            setEventShowImage(imageObjectURL);

            const imageCreateProofObjectURL = URL.createObjectURL(
              responsess.data
            );
            setEventCreatePoofImage(imageCreateProofObjectURL);
            setEventData(response.data.eventData);

            setEventCodeStatic(response.data.eventData[0].event_code);
            setEventCode(response.data.eventData[0].event_code);
            setEventName(response.data.eventData[0].name);
            setQuantity(response.data.eventData[0].quantity);
            setSlfHour(response.data.eventData[0].slf_hour);
            setLocation(response.data.eventData[0].location);
            setYear(response.data.eventData[0].year);
            setDetail(response.data.eventData[0].detail);
            setDateTimePickerPreStartOnChange(
              new Date(response.data.eventData[0].p_time_start_eng)
            );
            setDateTimePickerPreEndOnChange(
              new Date(response.data.eventData[0].p_time_end_eng)
            );
            setDateTimePickerStartOnChange(
              new Date(response.data.eventData[0].time_start_eng)
            );
            setDateTimePickerEndOnChange(
              new Date(response.data.eventData[0].time_end_eng)
            );
            setCreateUserId(response.data.eventData[0].user_create_id);
            setOptionBranchData(response.data.eventData[0].branch_id);
            setOptionFacultyData(response.data.eventData[0].faculty_id);
            setOptionEventRoleData(response.data.eventData[0].event_role_id);
          }
        }
      }
    } catch (error) {
      this.setState({ error });
    }
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

  const updateEventCreate = async (event_id) => {
    const fd = new FormData();

    console.log(optionBranchData)
    console.log(optionFacultyData)
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
          eventCode === "" ||
          eventName === "" ||
          slfHour === "" ||
          quantity === "" ||
          optionTermData === 0 ||
          year === "" ||
          location === "" ||
          detail === "" ||
          eventImage === "" ||
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
          let er_id = optionEventRoleData;
          let f_id = optionFacultyData;
          let b_id = optionBranchData;
          let create_status = 1;
          let term = optionTermData;

          let imageStatus = 0;
          if (eventImage === eventShowImage) {
            imageStatus = 1;
          }

          let eventCodeStatus = 0;
          if (eventCode === eventCodeStatic) {
            eventCodeStatus = 1;
          }

          console.log(eventCodeStatus);
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

          fd.append("event_code", eventCode);
          fd.append("name", eventName);
          fd.append("slf_hour", slfHour);
          fd.append("quantity", quantity);
          fd.append("term", term);
          fd.append("year", year);
          fd.append("location", location);
          fd.append("pre_start_time_reg", pre_start_time_reg);
          fd.append("pre_end_time_reg", pre_end_time_reg);
          fd.append("event_start_time_reg", event_start_time_reg);
          fd.append("event_end_time_reg", event_end_time_reg);
          fd.append("detail", detail);
          fd.append("image", eventImage);
          fd.append("create_status", create_status);
          fd.append("user_create_id", createUserId);
          fd.append("event_role_id", er_id);
          fd.append("branch_id", b_id);
          fd.append("faculty_id", f_id);
          fd.append("id", event_id);
          fd.append("imageStatus", imageStatus);
          fd.append("eventCodeStatus", eventCodeStatus);

          const { data } = await Axios.post(
            ROOT_SERVER+"/updateEventCreate",
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
          } else if (data.status === 1) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "สร้างกิจกรรมสำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setModalEventWaitingCreate(false);
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "สร้างกิจกรรมไม่สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setModalEventWaitingCreate(false);
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

  const imageHandler = (imag) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setEventShowImage(reader.result);
      }
    };
    reader.readAsDataURL(imag);
  };

  const onChangeHandlerTerm = async (e) => {
    const optionHandlerData =
      e.target.childNodes[e.target.selectedIndex].getAttribute("id");
    setOptionTermData(optionHandlerData);
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
                    กิจกรรมที่รอการอนุมัติการสร้าง
                  </h3>
                </div>
              </div>
              <div className="flex-auto px-4 lg:px-8 py-2  pt-0"></div>
            </div>

            <div className="w-full ">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white ">
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                  <div className="flex flex-wrap items-center">
                    <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap ">
                      <div className="sm:w-6/12 lg:w-6/12 xl:w-8/12 ">
                        <h3 className="font-semibold text-lg text-blueGray-700">
                          กิจกรรมที่รอการอนุมัติการสร้างล่าสุด
                          {"(" + eventCreateWaitingList.length + ")"}
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
                                setSearchEventByName(e.target.value);
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
                          ชื่อนิสิต
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          รหัสนิสิต
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
                        eventCreateWaitingList
                          .slice(pagesVisited, pagesVisited + usersPerPage)
                          .filter((val) => {
                            if (searchEventByName === "") {
                              return val;
                            } else if (
                              val.name
                                .toLowerCase()
                                .includes(searchEventByName.toLowerCase())
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
                                  {val.name}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.event_role_name}
                                </td>

                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.name_prefix +
                                    "" +
                                    val.u_name +
                                    " " +
                                    val.u_surname}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.user_code}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1 text-right">
                                  <button
                                    className="bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() =>
                                      showModalEventWaitingCreate(
                                        val.id,
                                        val.term,
                                        val.event_role_name,
                                        val.f_name,
                                        val.b_name
                                      )
                                    }
                                  >
                                    <TbIcons.TbFileSearch />
                                  </button>

                                  <button
                                    className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() =>
                                      deleteEventCreateWaitingByEventID(val.id)
                                    }
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
                  {eventCreateWaitingList.length <= 0 ? null : (
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

      <Modal
        size="lg"
        show={modalEventWaitingCreate}
        onHide={() => setModalEventWaitingCreate(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            แก้ไขข้อมูลกิจกรรม
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col sm={12} lg={4} xl={4}>
                <Form.Group className="mb-3">
                  <Form.Label>รหัสกิจกรรม : </Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    value={eventCode}
                    onChange={(e) => setEventCode(e.target.value)}
                    id="id"
                    maxLength={20}
                  />
                </Form.Group>
              </Col>
              <Col sm={12} lg={8} xl={8}>
                <Form.Group className="mb-3">
                  <Form.Label>ชื่อกิจกรรม : </Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    id="name"
                    maxLength={50}
                  />
                </Form.Group>
              </Col>
              <Col sm={12} lg={4} xl={4}>
                <Form.Group className="mb-3">
                  <Form.Label>ระดับกิจกรรม : </Form.Label>
                  <Form.Select size="sm" disabled>
                    <option>{optionEventRoleNameData}</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col sm={6} lg={4} xl={4}>
                <Form.Group className="mb-3">
                  <Form.Label>คณะ : </Form.Label>
                  <Form.Select size="sm" disabled>
                    <option>{optionFacultyNameData}</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col sm={6} lg={4} xl={4}>
                <Form.Group className="mb-3">
                  <Form.Label>สาขา : </Form.Label>
                  <Form.Select size="sm" disabled>
                    <option>{optionBranchNameData}</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col sm={12} lg={4} xl={4}>
                <Form.Group className="mb-3">
                  <Form.Label>ชั่วโมง กยศ. : </Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    value={slfHour} 
                    maxLength={2}
                    onChange={(e) => {
                      const value = e.target.value;
                      if(!isNaN(+value)){
                        if(parseInt(value) > 18){
                          setSlfHour("")
                        } else{
                          setSlfHour(e.target.value)
                        } 
                      } else {
                        setSlfHour("")
                      }
                    }}   
                  />
                </Form.Group>
              </Col>
              <Col sm={6} lg={4} xl={4}>
                <Form.Group className="mb-3">
                  <Form.Label>จำนวนผู้เข้าร่วม : </Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    value={quantity} 
                    maxLength={4}
                      onChange={(e) => {
                      const value = e.target.value;
                      if(!isNaN(+value)){
                        setQuantity(e.target.value)
                      } else {
                        setQuantity("")
                      }
                    }}  
                  />
                </Form.Group>
              </Col>
              <Col sm={4} lg={4} xl={4}>
                <Form.Group className="mb-3">
                  <Form.Label>ภาคเรียน : </Form.Label>
                  <InputGroup>
                    <Form.Select
                      size="sm"
                      onChange={onChangeHandlerTerm}
                      defaultValue={optionTermData}
                    >
                      <option id={0}>เลือก</option>
                      <option id={1}>1</option>
                      <option id={2}>2</option>
                      <option id={3}>3</option>
                    </Form.Select>
                    <Form.Control
                      type="text"
                      size="sm"
                      value={year}
                      onChange={(e) => {
                        const value = e.target.value;
                        if(!isNaN(+value)){
                          setYear(e.target.value)
                        } else {
                          setYear("")
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
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
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
                    value={
                      eventData.length <= 0
                        ? null
                        : eventData[0].name_prefix +
                          "" +
                          eventData[0].u_name +
                          " " +
                          eventData[0].surname
                    }
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col sm={4} lg={4} xl={4}>
                <Form.Group className="mb-3">
                  <Form.Label>ระดับผู้ใช้ : </Form.Label>
                  <Form.Select size="sm" disabled>
                    <option>
                      {eventData.length <= 0 ? null : eventData[0].ur_name}
                    </option>
                  </Form.Select>
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
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
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
              <Form.Group className="mb-3">
                <Form.Label>รูปภาพหลักฐานการสร้างกิจกรรม : </Form.Label>
                <div class="flex flex-wrap justify-center mt-2">
                  <div class="w-4/12 sm:w-4/12 px-4">
                    <img
                      className="rounded-t-lg"
                      src={eventCreatePoofImage}
                      alt=""
                    />
                  </div>
                </div>
              </Form.Group>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="bg-teal-500 text-white active:bg-teal-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={() =>
              updateEventCreate(eventData.length <= 0 ? null : eventData[0].id)
            }
          >
            ยืนยัน <AiIcons.AiOutlineSave style={{ display: "inline" }} />
          </button>
          <button
            onClick={() => setModalEventWaitingCreate(false)}
            className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
          >
            ยกเลิก <ImIcons.ImCancelCircle style={{ display: "inline" }} />
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

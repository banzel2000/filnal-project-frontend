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
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import * as TbIcons from "react-icons/tb";
import * as AiIcons from "react-icons/ai";
import * as ImIcons from "react-icons/im";
import FooterAdmin from "components/Footers/FooterAdmin.js";
import Axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import {ROOT_SERVER} from "layouts/rootServer.js"
export default function Dashboard() {
  const [eventDataShow, setEventDataShow] = useState(false);
  const [eventList, setEventList] = useState([]);
  const [eventImageList, setEventImageList] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [eventImageData, setEventImageData] = useState(null);
  const [searchEventByName, setSearchEventByName] = useState("");
  const [eventRoleList, setEventRoleList] = useState([]);
  let user_id_login = parseInt(
    localStorage.getItem("user_id_login").split(",")[0]
  );

  async function authen(token) {
    let response = await Axios.post(
      ROOT_SERVER+"/authen",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.status !== "ok") {
      localStorage.removeItem("token");
      window.location = "/auth/login";
    }
  }

  async function queryEventRoleList() {
    let response = await Axios.post(
      ROOT_SERVER+"/queryEventRoleList",
      {
        er_id: -1,
      }
    );
    if (response.data.status === 1) {
      setEventRoleList(response.data.eventRoleList);
    }
  }

  async function queryEventList(token) {
    let response = await Axios.post(ROOT_SERVER+"/queryEventList", {
      user_id: user_id_login,
      event_role_id: 0,
    });
    console.log(response);
    if (response.data.status === 1) {
      response.data.eventList.map(async (val, key) => {
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
          console.log(">>>>>>>>>>>>>>>" + val.time_end);
          const imageObjectURL = await URL.createObjectURL(responses.data);
          await setEventList((eventList) => [
            ...eventList,
            {
              name: val.name,
              members_number: val.members_number,
              quantity: val.quantity,
              slf_hour: val.slf_hour,
              event_role_name: val.event_role_name,
              f_name: val.f_name,
              b_name: val.b_name,
              p_time_start: val.p_time_start,
              p_time_end: val.p_time_end,
              time_start: val.time_start,
              time_end: val.time_end,
              request_status: val.request_status,
              event_time_status: val.event_time_status,
              id: val.id,
              event_create_status: val.event_create_status,
              event_image: imageObjectURL,
            },
          ]);
        }
      });
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    authen(token);
    queryEventList(token);
    queryEventRoleList();
  }, []);

  const showEventDataModal = (data, image) => {
    setEventDataShow(true);
    try {
      Axios.post(ROOT_SERVER+"/queryEventByEventID", {
        user_participation_id: user_id_login,
        event_id: data,
      }).then((response) => {
        if (response.data.status === 1) {
          setEventData(response.data.eventData);
          setEventImageData(image);
        } else {
          alert("not ok");
        }
      });
    } catch (error) {
      this.setState({ error });
    }
  };

  const addEventParticipation = (event_id) => {
    Swal.fire({
      title: "คุณต้องการขอเข้าร่วมหรือไม่?",
      text: " ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "	#198754",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          Axios.post(ROOT_SERVER+"/addEventParticipation", {
            event_id: event_id,
            user_participation_id: user_id_login,
          }).then((response) => {
            if (response.data.status === "1") {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "ขอเข้าร่วมสำเร็จ",
                showConfirmButton: false,
                timer: 3000,
              });
              setEventDataShow(false);
            } else {
              Swal.fire({
                position: "center",
                icon: "error",
                title: "ขอเข้าร่วมไม่สำเร็จ",
                showConfirmButton: false,
                timer: 3000,
              });
              setEventDataShow(false);
            }
          });
        } catch (error) {
          this.setState({ error });
        }
      }
    });
  };

  const deleteEventParticipationWaitingByEventID = async (event_id) => {
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
              user_participation_id: user_id_login,
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
            setEventDataShow(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "ยกเลิกคำขอไม่สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setEventDataShow(false);
          }
        } catch (error) {
          this.setState({ error });
        }
      }
    });
  };

  const onChangeEventByEventRole = async (e) => {
    setEventList([]);
    let event_role_id = parseInt(
      e.target.childNodes[e.target.selectedIndex].getAttribute("id")
    );
    try {
      const { data } = await Axios.post(
        ROOT_SERVER+"/queryEventList",
        {
          user_id: user_id_login,
          event_role_id: event_role_id,
        }
      );
      if (data) {
        data.eventList.map(async (val, key) => {
          let responses = await Axios.post(
            ROOT_SERVER+"/queryEventImageByID/" + parseInt(val.id),
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
            setEventList((eventImageList) => [
              ...eventImageList,
              {
                name: val.name,
                members_number: val.members_number,
                quantity: val.quantity,
                slf_hour: val.slf_hour,
                event_role_name: val.event_role_name,
                f_name: val.f_name,
                b_name: val.b_name,
                p_time_start: val.p_time_start,
                p_time_end: val.p_time_end,
                time_start: val.time_start,
                time_end: val.time_end,
                request_status: val.request_status,
                event_time_status: val.event_time_status,
                id: val.id,
                event_create_status: val.event_create_status,
                event_image: imageObjectURL,
              },
            ]);
          }
        });
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
                <div className="text-center flex justify-between ">
                  <h3 className="text-blueGray-700 text-xl font-bold">
                    กิจกรรมหลัก
                  </h3>
                  <p>
                    <InputGroup size="sm">
                      <Form.Select
                        size="sm"
                        align="end"
                        onChange={onChangeEventByEventRole}
                      >
                        <option id={0}>ทั้งหมด</option>
                        {eventRoleList.map((val, key) => {
                          return <option id={val.id}>{val.name}</option>;
                        })}
                      </Form.Select>
                    </InputGroup>
                  </p>
                </div>
              </div>
              <div className="flex-auto px-4 lg:px-8 py-3  pt-3 ">
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
            <div className="relative w-full mb-12">
              <div className="flex flex-wrap ">
                {eventList
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
                      <div className="w-full sm:w-6/12 lg:w-4/12 xl:w-4/12 px-2 mt-2 ">
                        <div className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                          <div className=" ">
                            {" "}
                            <img
                              className="rounded-t-lg"
                              src={val.event_image}
                              alt={val.event_image}
                            />{" "}
                          </div>

                          <div className="p-3">
                            <div className="head">
                              {" "}
                              <h3 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {val.name}
                              </h3>
                            </div>
                            <div className="little-head">
                              <span class="mt-2 text-xs font-semibold inline-block py-2 px-3 rounded-full text-red-600 bg-red-200 uppercase last:mr-0 mr-1">
                                เปิดรับ : {val.members_number}/{val.quantity} คน
                              </span>
                              <span class="mt-2 text-xs font-semibold inline-block py-2 px-3 rounded-full text-orange-600 bg-orange-200 uppercase last:mr-0 mr-1">
                                กยศ. : {val.slf_hour} ชม.
                              </span>
                              <span class="mt-2 text-xs font-semibold inline-block py-2 px-3 rounded-full text-emerald-600 bg-emerald-200 uppercase last:mr-0 mr-1">
                                กิจกรรมระดับ : {val.event_role_name}
                              </span>
                              <span class="mt-2 text-xs font-semibold inline-block py-2 px-3 rounded-full text-emerald-600 bg-emerald-200 uppercase last:mr-0 mr-1">
                                คณะ : {val.f_name}
                              </span>
                              <span class="mt-2 text-xs font-semibold inline-block py-2 px-3 rounded-full text-emerald-600 bg-emerald-200 uppercase last:mr-0 mr-1">
                                สาขา : {val.b_name}
                              </span>
                            </div>
                            <div className="body mt-3">
                              <h6 className="text-xs font-normal text-gray-700 dark:text-gray-400">
                                เปิดให้ขอเข้าร่วม: {val.p_time_start} ถึง{" "}
                                {val.p_time_end}
                              </h6>
                              <h6 className="text-xs font-normal text-gray-700 dark:text-gray-400">
                                ช่วงเวลากิจกรรม: {val.time_start} ถึง{" "}
                                {val.time_end}
                              </h6>
                            </div>
                            <div class="h-0 my-0 border border-solid border-blueGray-100"></div>
                            <div className="footler text-right mt-3">
                              {val.request_status === 1 ? (
                                <div>
                                  <h6 className="text-base font-semibold text-gray-600 dark:text-gray-400">
                                    {val.event_time_status}
                                  </h6>
                                  <Link
                                    to={"/admin/detailEventAttend/" + val.id}
                                  >
                                    <button
                                      className="bg-orange-500 text-white active:bg-orange-500 font-bold uppercase text-xs px-3 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                      type="button"
                                    >
                                      รายละเอียดกิจกรรมที่เข้าร่วม{" "}
                                      <TbIcons.TbFileSearch
                                        style={{ display: "inline" }}
                                      />
                                    </button>
                                  </Link>
                                </div>
                              ) : val.event_create_status === 1 ? (
                                <div>
                                  <h6 className="text-base font-semibold text-gray-600 dark:text-gray-400">
                                    {/* {val.event_pre_time_status +
                                      "(" + */}
                                    {val.event_time_status}
                                    {/* + ")"} */}
                                  </h6>{" "}
                                  <Link
                                    to={"/admin/detailEventCreate/" + val.id}
                                  >
                                    <button
                                      className="bg-red-500 text-white active:bg-red-500 font-bold uppercase text-xs px-3 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                      type="button"
                                    >
                                      รายละเอียดกิจกรรมที่สร้าง{" "}
                                      <TbIcons.TbFileSearch
                                        style={{ display: "inline" }}
                                      />
                                    </button>
                                  </Link>
                                </div>
                              ) : (
                                //val.event_pre_time_status === "เปิดให้เข้าร่วม"? null : val.event_pre_time_status === "กำลังดำเนินการ"? null :
                                <div>
                                  <h6 className="text-base font-semibold text-gray-600 dark:text-gray-400">
                                    {/* {val.event_pre_time_status +
                                      "(" + */}
                                    {val.event_time_status}
                                    {/* + ")"} */}
                                  </h6>{" "}
                                  <button
                                    onClick={() =>
                                      showEventDataModal(
                                        val.id,
                                        val.event_image
                                      )
                                    }
                                    className="bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-xs px-3 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                  >
                                    รายละเอียด{" "}
                                    <TbIcons.TbFileSearch
                                      style={{ display: "inline" }}
                                    />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        size="lg"
        show={eventDataShow}
        onHide={() => setEventDataShow(false)}
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
                <Form.Label htmlFor="inputPassword5">
                  รูปภาพกิจกรรม :{" "}
                </Form.Label>
              </Col>
            </Row>
            <div class="flex flex-wrap justify-center mt-2">
              <div class="w-4/12 sm:w-4/12 px-4">
                <img className="rounded-t-lg" src={eventImageData} alt="" />
              </div>
            </div>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          {eventData.length > 0 &&
          eventData[0].event_pre_time_status === "เปิดให้ขอเข้าร่วม" ? (
            eventData.length > 0 && eventData[0].request_status == -1 ? (
              <button
                onClick={() => addEventParticipation(eventData[0].id)}
                className="bg-teal-500 text-white active:bg-teal-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
              >
                ขอเข้าร่วม{" "}
                <AiIcons.AiOutlineSave style={{ display: "inline" }} />
              </button>
            ) : eventData.length > 0 && eventData[0].request_status == 0 ? (
              <button
                onClick={() =>
                  deleteEventParticipationWaitingByEventID(eventData[0].id)
                }
                className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
              >
                ยกเลิกคำขอ{" "}
                <ImIcons.ImCancelCircle style={{ display: "inline" }} />
              </button>
            ) : null
          ) : null}
        </Modal.Footer>
      </Modal>
    </>
  );
}

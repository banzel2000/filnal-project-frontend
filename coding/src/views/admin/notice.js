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
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import Swal from "sweetalert2";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import { ROOT_SERVER } from "layouts/rootServer.js";

export default function Notice() {
  const user_id_login = parseInt(
    localStorage.getItem("user_id_login").split(",")[0]
  );
  const user_role_login = parseInt(
    localStorage.getItem("user_id_login").split(",")[1]
  );
  const [modalNotice, setModalNotice] = useState(false);
  const [modalNoticeAdmin, setModalNoticeAdmin] = useState(false);
  const [eventParticipationAnnounceList, setEventParticipationAnnounceList] =
    useState([]);
  const [searchEventByName, setSearchEventByName] = useState("");
  const [eventAnnounceList, setEventAnnounceList] = useState([]);
  const [eventAnnounceAdminList, setEventAnnounceAdminList] = useState([]);

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
        Axios.post(ROOT_SERVER+"/queryEventParticipationAnnounce", {
          user_participation_id: user_id_login,
        }).then((response) => {
          if (response.data.status === 1) {
            setEventParticipationAnnounceList(
              response.data.eventParticipationAnnounceList
            );
          }
        });
      } else {
        localStorage.removeItem("token");
        window.location = "/auth/login";
      }
    });
  }, []);

  const showModalNotice = async (event_id) => {
    setEventAnnounceList([]);
    setModalNotice(true);

    try {
      const { data } = await Axios.post(
        ROOT_SERVER+"/queryEventAnnounceByEventID",
        {
          event_id: event_id,
        }
      );
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

  const showModalNoticeAdmin = async () => {
    setEventAnnounceAdminList([]);
    setModalNoticeAdmin(true);
    try {
      const { data } = await Axios.post(
        ROOT_SERVER+"/queryEventAnnounceAdmin"
      );
      if (data.status === 1) {
         
        data.eventAnnounceAdminList.map(async (val, key) => {
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
            setEventAnnounceAdminList((eventAnnounceAdminList) => [
              ...eventAnnounceAdminList,
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

  const addEventAnnounceAdmin = async () => {
    let dataEventAnnounce = document.getElementById("data").value;

    Swal.fire({
      title: "คุณต้องการประกาศภายในระบบหรือไม่?",
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
          dataEventAnnounce === ""
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
          const { data } = await Axios.post(
            ROOT_SERVER+"/addEventAnnounceAdmin",
            {
              data: dataEventAnnounce,
              u_id: user_id_login,
            }
          );
          if (data) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "ประกาศสำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "ประกาศไม่สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            window.location.reload(false);
          }
        } catch (error) {}
      }
    });
  };

  const deleteEventAnnounceAdmin = (announce_id) => {
    if (user_role_login != 6) {
      return;
    }
    Swal.fire({
      title: "คุณต้องลบประกาศหรือไม่?",
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
            ROOT_SERVER+"/deleteEventAnnounceAdmin",
            {
              announce_id: announce_id,
            }
          );
          if (data) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "ลบประกาศสำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "ลบประกาศไม่สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            window.location.reload(false);
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
            <div className="w-full ">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white ">
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                  <div className="flex flex-wrap items-center">
                    <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap ">
                      <div className="sm:w-6/12 lg:w-6/12 xl:w-8/12 ">
                        <h3 className="font-semibold text-lg text-blueGray-700">
                          ประกาศแจ้งเตือน
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
                          ผู้สร้างกิจกรรม
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          ระดับผู้ใช้
                        </th>

                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                          1
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                          -
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                          -
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                          Admin
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                          ผู้ดูแลระบบ
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1 text-right">
                          <button
                            className="bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={() => showModalNoticeAdmin()}
                          >
                            <TbIcons.TbFileSearch />
                          </button>
                        </td>
                      </tr>
                      { 
                        eventParticipationAnnounceList
                          .filter((val) => {
                            if (searchEventByName === "") {
                              return val;
                            } else if (
                              val.e_name
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
                                  {key + 2}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.e_name}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.er_name}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.fu_name}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.ur_name}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1 text-right">
                                  <button
                                    className="bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => showModalNotice(val.id)}
                                  >
                                    <TbIcons.TbFileSearch />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                      }
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
            eventAnnounceList.map((val, key) => {
              return (
                <ToastContainer className={"p-1"}>
                  <Toast style={{ width: "85%" }}>
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
                </ToastContainer>
              );
            })
          )}
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
      <Modal
        size="xl"
        show={modalNoticeAdmin}
        onHide={() => setModalNoticeAdmin(false)}
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
          {eventAnnounceAdminList.length <= 0 ? (
            <div className="text-center  p-3">
              <Form.Label>ยังไม่มีการประกาศ</Form.Label>
            </div>
          ) : (
            eventAnnounceAdminList.map((val, key) => {
              return (
                <ToastContainer
                  className={"p-1 " + (user_role_login == 6 ? "float-end" : "")}
                >
                  <Toast
                    style={{ width: user_role_login == 6 ? "100%" : "85%" }}
                  >
                    <Toast.Header
                      closeButton={user_role_login == 6 ? true : false}
                      onClick={() => deleteEventAnnounceAdmin(val.id)}
                    >
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
                </ToastContainer>
              );
            })
          )}
        </Modal.Body>
        <Modal.Footer>
          {user_role_login == 6 ? (
            <InputGroup className="mb-3">
              <Form.Control id="data" placeholder="กรอก..." maxLength={1000}/>
              <Button variant="success" onClick={() => addEventAnnounceAdmin()}>
                ประกาศ
              </Button>
            </InputGroup>
          ) : null}
        </Modal.Footer>
      </Modal>
    </>
  );
}

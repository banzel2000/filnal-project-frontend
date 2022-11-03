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
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import { ROOT_SERVER } from "layouts/rootServer.js";

export default function OfferEventForOfficer() {
  const [modalAddOfferEventOffier, setModalAddOfferEventOffier] =
    useState(false);
    const [modalDetailOfferEvent, setModalDetailOfferEvent] = useState(false);
    const [eventOfferDataByEventID, setEventOfferDataByEventID] = useState([]);
    const [eventOfferWaitingList, setEventOfferWaitingList] =
    useState([]);
  const [eventOfferPassList, setEventOfferPassList] =
    useState([]);
    const [searchEventWorkingByName, setSearchEventWorkingByName] = useState("");
    const [searchEventEndedByName, setSearchEventEndedByName] = useState("");
    const [pageNumber, setPageNumber] = useState(0);
    const [pageNumber2, setPageNumber2] = useState(0);
    const [disabledForward, setDisabledForward] = useState(true);
    const [optionForwardStatusData, setOptionForwardStatusData] = useState(0);
    const [optionForwardData, setOptionForwardData] = useState(-1);
    const [userToOfferEventList, setUserToOfferEventList] = useState([]);
    const [userData, setUserData] = useState([]);
    const user_id_login = parseInt(
      localStorage.getItem("user_id_login").split(",")[0]
    );
    const user_role_id_login = parseInt(
      localStorage.getItem("user_id_login").split(",")[1]
    );

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
        Axios.post(ROOT_SERVER+"/queryOfferEventWaiting", {
          user_role_id: user_role_id_login,
          user_id: user_id_login,
        }).then((response) => {
          if (response.data.status === 1) {
            setEventOfferWaitingList(
              response.data.eventOfferWaitingList
            );
          } 
        });
    
        Axios.post(ROOT_SERVER+"/queryOfferEventPass", {
          user_role_id: user_role_id_login,
          user_id: user_id_login,
        }).then((response) => {
          if (response.data.status === 1) {
            setEventOfferPassList(
              response.data.eventOfferPassList
            );
          }
        });
      } else {
        localStorage.removeItem("token");
        window.location = "/auth/login";
      }
    });

    Axios.post(ROOT_SERVER+"/queryUserDataByID", {
      user_id: user_id_login,
    }).then((response) => {
      if (response.data.status === 1) {
        setUserData(response.data.userData);
      }
    });

  }, []);

  const pageCount = Math.ceil(
    eventOfferWaitingList.length / usersPerPage
  );

  const pageCount2 = Math.ceil(
    eventOfferPassList.length / usersPerPage
  );

  
  const showModalAddOfferEventOffier = async (offer_event_id) => {
    setDisabledForward(true)
    setModalAddOfferEventOffier(true);
    try {
      const { data } = await Axios.post(
        ROOT_SERVER+"/queryOfferEventByEventID",
        {
          offer_event_id: offer_event_id,
        }
      );
      if (data.status === 1) {
        setEventOfferDataByEventID(data.eventOfferDataByEventID);
      } 
    } catch (error) {
      this.setState({ error });
    } 
   

  };

  const showOfferEventModal = async (offer_event_id) => {
    setModalDetailOfferEvent(true);
    try {
      const { data } = await Axios.post(
        ROOT_SERVER+"/queryOfferEventByEventID",
        {
          offer_event_id: offer_event_id,
        }
      );
      if (data.status === 1) {
        setEventOfferDataByEventID(data.eventOfferDataByEventID);
      } 
    } catch (error) {
      this.setState({ error });
    }
  };

  const onChangeHandlerForwardStatus = async (e) => {
    const optionHandlerData =
      e.target.childNodes[e.target.selectedIndex].getAttribute("id"); 
      setOptionForwardStatusData(optionHandlerData);
      if(optionHandlerData == 2){
        setDisabledForward(false)

        try {
          const { data } = await Axios.post(
            ROOT_SERVER+"/queryAllUserToOfferEvent",
            {
              f_id: userData[0].f_id,
              b_id: userData[0].b_id,
            }
          );
          if (data.status === 1) {
            setUserToOfferEventList(data.userToOfferEventList);
          } else if (data.status === 0) {
            console.log("");
          }
        } catch (error) {
          this.setState({ error });
        }
      } else {
        setUserToOfferEventList([])
        setOptionForwardData(-1);
        setDisabledForward(true)
      }
  };

  const onChangeHandlerForward = async (e) => {
    const optionHandlerData =
      e.target.childNodes[e.target.selectedIndex].getAttribute("id");
    setOptionForwardData(optionHandlerData);
  };

  const repleOfferEvent = async () => {
    let id = eventOfferDataByEventID[0].id;
    let name = eventOfferDataByEventID[0].name;
    let detail = eventOfferDataByEventID[0].detail;
    let user_from_id = eventOfferDataByEventID[0].user_from_id;
    let reple = document.getElementById("reple").value;
    console.log(id+","+ name+","+detail+","+user_from_id+","+optionForwardStatusData+","+optionForwardData)
    Swal.fire({
      title: "ต้องการตอบกลับหรือไม่?",
      text: " ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "	#198754",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (name === "" || detail === "" || reple === "" || (parseInt(optionForwardStatusData) === 2 && parseInt(optionForwardData) === -1)) {
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
            ROOT_SERVER+"/repleOfferEvent",
            {
              id: id,
              name: name,
              detail: detail,
              reple: reple,
              offer_status: parseInt(optionForwardStatusData),
              user_from_id: user_from_id,
              user_to_id: optionForwardData,
            }
          );
          if (data) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "ตอบกลับสำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setModalAddOfferEventOffier(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "ตอบกลับไม่สำเร็จ",
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
                    กิจกรรมที่นิสิตเสนอ 
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
                          กิจกรรมที่นิสิตเสนอล่าสุด
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
                          เสนอจาก
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          ระดับผู้ใช้
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          สถานะกิจกรรม
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"></th>
                      </tr>
                    </thead>
                    <tbody>
                    {eventOfferWaitingList.length <= 0 ? (
                        <td
                          className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
                          colSpan={6}
                        >
                          ไม่มีกิจกรรม
                        </td>
                      ) : (
                        eventOfferWaitingList
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
                                  {val.uf_name_prefix}
                                  {val.uf_name} {val.uf_surname}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.urf_name}
                                </td>

                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  <i className="fas fa-circle text-orange-500 mr-2"></i>{" "}
                                  {val.offer_status == 0
                                    ? "รอการตอบกลับ"
                                    : val.offer_status}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1 text-right">
                          <button
                            className="bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={() => showModalAddOfferEventOffier(val.id)}
                          >
                            <TbIcons.TbFileSearch style={{ display: "inline" }} />
                          </button>
                        </td>
                              </tr>
                            );
                          })
                      )}
                         
                    </tbody>
                  </table>
                  <div class="h-0 my-0 border border-solid border-blueGray-100 "></div>
                  {eventOfferWaitingList.length <= 0 ? null :
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
                  </div> }
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
                          กิจกรรมที่นิสิตเคยเสนอ
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
                          เสนอจาก
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          ระดับผู้ใช้
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          สถานะกิจกรรม
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"></th>
                      </tr>
                    </thead>
                    <tbody>
                    {eventOfferPassList.length <= 0 ? (
                        <td
                          className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
                          colSpan={6}
                        >
                          ไม่มีกิจกรรม
                        </td>
                      ) : (
                        eventOfferPassList
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
                                  {val.uf_name_prefix}
                                  {val.uf_name} {val.uf_surname}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.urf_name}
                                </td>

                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  <i
                                    className={
                                      val.offer_status === 1
                                        ? "fas fa-circle text-teal-500 mr-2 "
                                        : val.offer_status === -1
                                        ? "fas fa-circle text-red-500 mr-2 "
                                        : "fas fa-circle text-orange-500 mr-2 "
                                    }
                                  ></i>{" "}
                                  {val.offer_status === 1
                                    ? "น่าสนใจ"
                                    : val.offer_status === -1
                                    ? "ไม่น่าสนใจ"
                                    : "ถูกส่งต่อ"}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1 text-right">
                          <button
                            className="bg-orange-500 text-white active:bg-orange-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={()=>showOfferEventModal(val.id)}
                          >
                            ประวัติการตอบกลับ <TbIcons.TbFileSearch style={{ display: "inline" }} />
                          </button>
                        </td>
                              </tr>
                            );
                          })
                      )}
                         
                    </tbody>
                  </table>
                  <div class="h-0 my-0 border border-solid border-blueGray-100"></div>
                  {eventOfferPassList.length <= 0 ? null : <div className="d-flex justify-content-center py-3">
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
        show={modalAddOfferEventOffier}
        onHide={() => setModalAddOfferEventOffier(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
          รายละเอียดข้อมูล
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="">
          <Container>
            <Form>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>
                ชื่อกิจกรรม :{" "}
                      {eventOfferDataByEventID.length <= 0
                        ? null
                        : eventOfferDataByEventID[0].name}
                </Form.Label>
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>รายละเอียดกิจกรรม : </Form.Label>
                <Card>
                  <Card.Body> 
                      {eventOfferDataByEventID.length <= 0
                        ? null
                        : eventOfferDataByEventID[0].detail}
                  </Card.Body>
                </Card>
              </Form.Group>

              <Form.Label className="mt-3">การตอบกลับ : </Form.Label>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <FloatingLabel controlId="floatingSelect" label="สถานะ">
                  <Form.Select aria-label="Floating label select example" onChange={onChangeHandlerForwardStatus}>
                  <option id={0}>เลือก</option>
                    <option id={1}>น่าสนใจ</option>
                    <option id={-1}>ไม่น่าสนใจ</option>
                    <option id={2}>ส่งต่อ</option> 
                  </Form.Select>
                </FloatingLabel>
              </Form.Group>

              <Form.Group
                className="mb-6" 
              >
                <Form.Control
                id="reple"
                  as="textarea"
                  size="sm"
                  placeholder="กรอก..."
                  rows={10}
                  maxLength={1000}
                />
              </Form.Group>

              <Form.Group className="mb-3 mt-9" >
                <Form.Label>ส่งต่อ : </Form.Label>  
                <Form.Select size="sm" onChange={onChangeHandlerForward} disabled={disabledForward}>
                  <option id={0}>เลือก</option>
                  {userToOfferEventList.map((val, key) => {
                    return (
                      <option id={val.id}>
                        {val.name_prefix + "" + val.name + " " + val.surname} (
                        {val.ur_name}{" "}
                        {val.faculty_id === 0 ? "" : "คณะ" + val.f_name}{" "}
                        {val.branch_id === 0 ? "" : "สาขา" + val.b_name})
                      </option>
                    );
                  })}
                </Form.Select> 
                
              </Form.Group> 
            </Form>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="mt-3 bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={() => repleOfferEvent()}
          >
            ยืนยัน <AiIcons.AiOutlineSave style={{ display: "inline" }} />
          </button>
        </Modal.Footer>
      </Modal>
      <Modal
        size="xl"
        show={modalDetailOfferEvent}
        onHide={() => setModalDetailOfferEvent(false)}
        aria-labelledby="example-modal-sizes-title-xl"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-xl">
            รายละเอียดข้อมูล
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="">
          <Container>
            <Form>
              <Row>
                <Col>
                  {" "}
                  <Form.Group className="mb-3">
                    <Form.Label>
                      ชื่อกิจกรรม :{" "}
                      {eventOfferDataByEventID.length <= 0
                        ? null
                        : eventOfferDataByEventID[0].name}
                    </Form.Label>
                  </Form.Group>
                </Col>
                <Col>
                  {" "}
                  <Form.Group className="mb-3">
                    <Form.Label>
                      สถานะ :{" "}
                      {eventOfferDataByEventID.length <= 0
                        ? null
                        : eventOfferDataByEventID[0].offer_status === 0
                        ? "รอการตอบกลับ"
                        : eventOfferDataByEventID[0].offer_status === 1
                        ? "น่าสนใจ"
                        : eventOfferDataByEventID[0].offer_status === -1
                        ? "ไม่น่าสนใจ"
                        : "ถูกส่งต่อ"}
                    </Form.Label>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>รายละเอียดกิจกรรม : </Form.Label>
                <Card>
                  <Card.Body>
                    {eventOfferDataByEventID.length <= 0
                      ? null
                      : eventOfferDataByEventID[0].detail}
                  </Card.Body>
                </Card>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  ส่งจาก :{" "}
                  {eventOfferDataByEventID.length <= 0
                    ? null
                    : eventOfferDataByEventID[0].uf_name_prefix +
                      "" +
                      eventOfferDataByEventID[0].uf_name +
                      " " +
                      eventOfferDataByEventID[0].uf_surname}
                </Form.Label>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  ส่งถึง :{" "}
                  {eventOfferDataByEventID.length <= 0
                    ? null
                    : eventOfferDataByEventID[0].ut_name_prefix +
                      "" +
                      eventOfferDataByEventID[0].ut_name +
                      " " +
                      eventOfferDataByEventID[0].ut_surname}
                </Form.Label>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>การตอบกลับ : </Form.Label>
                <Card>
                  <Card.Body>
                    {eventOfferDataByEventID.length <= 0
                      ? null
                      : eventOfferDataByEventID[0].reple}
                  </Card.Body>
                </Card>
              </Form.Group>
            </Form>
          </Container>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
}

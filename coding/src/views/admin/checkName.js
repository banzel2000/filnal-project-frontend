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
import * as AiIcons from "react-icons/ai";
import ReactPaginate from "react-paginate";
import * as ImIcons from "react-icons/im";
import { QrReader } from "react-qr-reader";
import Card from "react-bootstrap/Card";
import Swal from "sweetalert2";
import { ROOT_SERVER } from "layouts/rootServer.js";

export default function CheckName() {
  const [modelCheckName, setModelCheckName] = useState(false);
  const [searchEventByName, setSearchEventByName] = useState("");
  const [eventParticipationList, setEventParticipationList] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [checkNameCreatedList, setCheckNameCreatedList] = useState([]);
  const [modalCheckName, setModalCheckName] = useState(false);
  const [userParticipationId, setUserParticipationId] = useState([]);
  const [qrCodeScanModal, setQrCodeScanModal] = useState(false);
  const [scanResultWebCam, setScanResultWebCam] = useState("ยังไม่แสกน");
  const [qrCodeTimesId, setQrCodeTimesId] = useState('');
  const [scanQrCodeStatus, setScanQrCodeStatus] = useState(0);
  const [eventId, setEventId] = useState(0);
  const [dateTimeCheckNameValue, setDateTimeCheckNameValue] = useState(
    new Date()
  );

  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;
  let user_id_login = parseInt(
    localStorage.getItem("user_id_login").split(",")[0]
  );


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
        Axios.post(
          ROOT_SERVER+"/queryEventParticipationByUserParticipationID",
          {
            user_participation_id: user_id_login,
            event_status: "",
          }
        ).then((response) => {
          if (response.data.status === 1) {
            setEventParticipationList(response.data.eventParticipationList);
          }
        });
      } else {
        localStorage.removeItem("token");
        window.location = "/auth/login";
      }
    });

    
  }, []);

    const pageCount = Math.ceil(
    setEventParticipationList.length / usersPerPage
  );

  const showModalCheckName = async (event_id) => {
    setModalCheckName(true);
    setEventId(event_id)
    setCheckNameCreatedList([])
    Axios.post(
      ROOT_SERVER+"/queryEventParticipationId",
      {
        user_participation_id: user_id_login,
        event_id: event_id,
      }
    ).then(async (response) => {
      if (response.data.status === 1) { 
        setUserParticipationId(response.data.userParticipationId)
        const { data } = await Axios.post(
          ROOT_SERVER+"/queryCheckNameCreatedListByEventID",
          {
            event_participation_id: response.data.userParticipationId[0].id,
            event_id: event_id,
          }
        );
        
        if (data.status === 1) {
          setCheckNameCreatedList(data.checkNameCreatedList);
        }
      }
    });


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
    console.log(eventId)
    if (data) {
      const textQrCode = eventId+"_"+qrCodeTimesId;
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
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "เช็คชื่อไม่สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setQrCodeScanModal(false)
            window.location.reload(false);
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
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "ยกเลิกการเช็คชื่อไม่สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            }); 
            setModalCheckName(false)
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
                          เช็คชื่อ
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
                          ผู้สร้าง
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          สถานะกิจกรรม
                        </th>

                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventParticipationList.length <= 0 ? (
                        <td
                          className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
                          colSpan={6}
                        >
                          ไม่มีกิจกรรม
                        </td>
                      ) : (
                        eventParticipationList
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
                                  {pagesVisited + (key + 1)}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.name}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.event_role_name}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.name_prefix+""+val.u_name+" "+val.u_surname}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.event_time_status}
                                </td> 
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1 text-right">
                                  <button
                                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => showModalCheckName(val.id)}
                                  >
                                    <AiIcons.AiFillCheckSquare />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                  <div class="h-0 my-0 border border-solid border-blueGray-100"></div>
                  {eventParticipationList.length <= 0 ? null : <div className="d-flex justify-content-center py-3">
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
                  </div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        size="lg"
        show={modelCheckName}
        onHide={() => setModelCheckName(false)}
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
            facingMode="environment"

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

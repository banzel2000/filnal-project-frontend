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
import * as AiIcons from "react-icons/ai";
import * as ImIcons from "react-icons/im";
import Axios from "axios";
import Swal from "sweetalert2";
import Resizer from "react-image-file-resizer";
import { ROOT_SERVER } from "layouts/rootServer.js";

export default function Profile() {
  const [userDataShow, setUserDataShow] = useState([]);
  const [userImage, setUserImage] = useState(null);
  const [userShowImage, setUserShowImage] = useState(null);
  const [modelEditPassword, setModelEditPassword] = useState(false);
  const user_id_login = parseInt(
    localStorage.getItem("user_id_login").split(",")[0]
  );

  const [namePrefixVal, setNamePrefixVal] = useState("");
  const [nickNameVal, setNickNameVal] = useState("");
  const [nameVal, setNameVal] = useState("");
  const [surnameVal, setSurnameVal] = useState("");
  const [studentYear, setStudentYear] = useState(-1);

  const [passwordVal, setPasswordVal] = useState("");
  const [passwordNewVal, setPasswordNewVal] = useState("");
  const [passwordNewConfirmVal, setPasswordNewConfirmVal] = useState("");

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

    Axios.post(ROOT_SERVER+"/queryUserDataByID", {
      user_id: user_id_login,
    }).then((response) => {
      if (response.data.status === 1) {
        setUserDataShow(response.data.userData);
        setNamePrefixVal(response.data.userData[0].name_prefix);
        setNickNameVal(response.data.userData[0].nickname);
        setNameVal(response.data.userData[0].name);
        setSurnameVal(response.data.userData[0].surname);
        setStudentYear(response.data.userData[0].student_year);
        console.log(">>>>>>>>>>>" + response.data.userData[0].surname);
      }
    });

    Axios.post(
      ROOT_SERVER+"/queryUserImageByID/" + user_id_login,
      {},
      {
        headers: {
          "Content-Type": "image/jpeg",
          Accept: "application/json",
          authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    ).then((response) => {
      if (response.status === 200) {
        const imageObjectURL = URL.createObjectURL(response.data);
        setUserImage(imageObjectURL);
        setUserShowImage(imageObjectURL);
      }
    });
  }, []);

  const updateUserData = async () => {
    const fd = new FormData();
    let email = document.getElementById("email").value;
    let nickname = document.getElementById("nickname").value;
    let name_prefix = document.getElementById("name_prefix").value;
    let name = document.getElementById("name").value;
    let surname = document.getElementById("surname").value; 

    let imageStatus = 0;
    if (userImage == userShowImage) {
      imageStatus = 1;
    }

    fd.append("email", email);
    fd.append("nickname", nickname);
    fd.append("name_prefix", name_prefix);
    fd.append("name", name);
    fd.append("surname", surname);
    fd.append("student_year", studentYear);
    fd.append("image", userImage);
    fd.append("imageStatus", imageStatus);

    Swal.fire({
      title: "ต้องการแก้ไขข้อมูลส่วนตัวหรือไม่?",
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
          email === "" ||
          nickname === "" ||
          name_prefix === "" ||
          name === "" ||
          surname === "" ||
          studentYear == -1
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
            ROOT_SERVER+"/updateUserData",
            fd
          );
          if (data) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "แก้ไขข้อมูลส่วนตัวสำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "แก้ไขข้อมูลส่วนตัวไม่สำเร็จ",
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

  const editPassword = async () => {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let new_password = document.getElementById("new_password").value;
    let confirm_new_password = document.getElementById(
      "confirm_new_password"
    ).value;
    Swal.fire({
      title: "ต้องการแก้ไขข้อมูลส่วนตัวหรือไม่?",
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
          password === "" ||
          new_password === "" ||
          confirm_new_password === ""
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

        if (new_password !== confirm_new_password) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "รหัสผ่านใหม่ไม่ตรงกัน",
            showConfirmButton: false,
            timer: 3000,
          });
          return;
        }
        try {
          const { data } = await Axios.post(
            ROOT_SERVER+"/editPassword",
            {
              email: email,
              password: password,
              new_password: new_password,
            }
          );
          if (data.status === 1) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "เปลี่ยนรหัสผ่านสำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setModelEditPassword(false);
            window.location.reload(false);
          } else if (data.status === 0) {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "รหัสผ่านเก่าไม่ถูกต้อง",
              showConfirmButton: false,
              timer: 3000,
            });
            setModelEditPassword(false);
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "เปลี่ยนรหัสผ่านไม่สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setModelEditPassword(false);
            window.location.reload(false);
          }
        } catch (error) {
          this.setState({ error });
        }
      }
    });
  };

  const setImage = ({ target: { files } }) => {
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
            console.log("uri" + uri);
            imageHandler(files[0]);
            setUserImage(uri);
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
        setUserShowImage(reader.result);
      }
    };
    reader.readAsDataURL(imag);
  };

  const onChangeHandlerStudentYear = async (e) => {
    
    const optionHandlerData = parseInt(
      e.target.childNodes[e.target.selectedIndex].getAttribute("id")
    );
    setStudentYear(optionHandlerData);
  };

  
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        {/* Header */}
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="w-full px-4 flex justify-center">
                  <div className="relative">
                    <img
                      alt="..."
                      src={userShowImage}
                      className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"
                    />
                  </div>
                </div>
                <div className="w-full px-4 text-center mt-20">
                  <div className="flex justify-center py-4 lg:pt-4 pt-8">
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                        {userDataShow.length > 0
                          ? userDataShow[0].allEventCreate
                          : ""}
                      </span>
                      <span className="text-sm text-blueGray-400">
                        กิจกรรมที่สร้าง
                      </span>
                    </div>
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                        {userDataShow.length > 0
                          ? userDataShow[0].allEventParticipation
                          : ""}
                      </span>
                      <span className="text-sm text-blueGray-400">
                        กิจกรรมที่เข้าร่วม
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap p-2 justify-end">
                <button
                  className=" bg-orange-500 text-white active:bg-orange-600  font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setModelEditPassword(true)}
                >
                  {" "}
                  เปลี่ยนรหัสผ่าน
                  <AiIcons.AiOutlineEdit style={{ display: "inline" }} />
                </button>
              </div>
              <div className="text-center  bg-blueGray-100 border-0">
                <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                  <form>
                    <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase ">
                      ข้อมูลผู้ใช้งาน
                    </h6>
                    <div className="flex flex-wrap">
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            รหัสผู้ใช้
                          </label>
                          <input
                            id="user_code"
                            type="number"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            defaultValue={
                              userDataShow.length > 0
                                ? userDataShow[0].user_code
                                : ""
                            }
                            disabled
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Email
                          </label>
                          <input
                            id="email"
                            type="email"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            defaultValue={
                              userDataShow.length > 0
                                ? userDataShow[0].email
                                : ""
                            }
                            disabled
                          />
                        </div>
                      </div>

                      <div className="w-full lg:w-8/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            ระดับผู้ใช้
                          </label>
                          <input
                            type="text"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            defaultValue={
                              userDataShow.length > 0
                                ? userDataShow[0].ur_name
                                : ""
                            }
                            disabled
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-4/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            ชื่อเล่น
                          </label>
                          <input
                            id="nickname"
                            type="text"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            value={nickNameVal}
                            maxLength={50}
                            onChange={(e) => {
                              setNickNameVal(e.target.value.trim());
                            }}
                          />
                        </div>
                      </div>

                      <div className="w-full lg:w-4/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            คำนำหน้า
                          </label>
                          <input
                            id="name_prefix"
                            type="text"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            value={namePrefixVal}
                            maxLength={20}
                            onChange={(e) => {
                              setNamePrefixVal(e.target.value.trim());
                            }}
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-4/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            ชื่อจริง
                          </label>
                          <input
                            id="name"
                            type="text"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            value={nameVal}
                            maxLength={50}
                            onChange={(e) => {
                              setNameVal(e.target.value.trim());
                            }}
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-4/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            นามสกุล
                          </label>
                          <input
                            id="surname"
                            type="text"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            value={surnameVal}
                            maxLength={50}
                            onChange={(e) => {
                              setSurnameVal(e.target.value.trim());
                            }}
                          />
                        </div>
                      </div>

                      <div className="w-full lg:w-4/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            ชั้นปีการศึกษา
                          </label>
                          <Form.Select
                          onChange={onChangeHandlerStudentYear}
                            value={studentYear}
                            size="sm"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          >
                            <option id={-1}>เลือก</option>
                            <option id={1}>1</option>
                            <option id={2}>2</option>
                            <option id={3}>3</option>
                            <option id={4}>4</option>
                            <option id={5}>5</option>
                            <option id={6}>6</option>
                            <option id={7}>7</option>
                            <option id={8}>8</option>
                          </Form.Select>
                        </div>
                      </div>
                      <div className="w-full lg:w-4/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            สาขา
                          </label>
                          <input
                            type="text"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            defaultValue={
                              userDataShow.length > 0
                                ? userDataShow[0].b_name
                                : ""
                            }
                            disabled
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-4/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            คณะ
                          </label>
                          <input
                            type="text"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            defaultValue={
                              userDataShow.length > 0
                                ? userDataShow[0].f_name
                                : ""
                            }
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                    <div className="w-full lg:w-12/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          รูปภาพผู้ใช้
                        </label>
                        <div className="img-holder">
                          <img
                            src={userShowImage}
                            alt=""
                            id="img"
                            className="img"
                          />
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
                      </div>
                    </div>
                    <div className="w-full lg:w-12/12 px-4"></div>
                    <hr className="mt-6 border-b-1 border-blueGray-300" />
                    <div className="flex flex-wrap"></div>
                  </form>
                </div>
              </div>
              <div className="mt-5 py-2 border-t border-blueGray-200 text-center">
                <button
                  className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => updateUserData()}
                >
                  บันทึก <AiIcons.AiOutlineSave style={{ display: "inline" }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        size="lg"
        show={modelEditPassword}
        onHide={() => setModelEditPassword(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            เปลี่ยนรหัสผ่าน
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="">
          <Container>
            <Row>
              <Col sm={12} lg={12} xl={12}>
                <Form.Group className="mb-3">
                  <Form.Label>รหัสผ่านเก่า : </Form.Label>
                  <Form.Control
                    type="password"
                    size="sm"
                    id="password"
                    placeholder="*****"
                    value={passwordVal}
                    maxLength={50}
                    onChange={(e) => {
                      setPasswordVal(e.target.value.trim());
                    }}
                  />
                </Form.Group>
              </Col>
              <Form.Label> </Form.Label>
              <Col sm={12} lg={12} xl={12}>
                <Form.Group className="mb-3">
                  <Form.Label>รหัสผ่านใหม่ : </Form.Label>
                  <Form.Control
                    type="password"
                    size="sm"
                    id="new_password"
                    placeholder="*****"
                    value={passwordNewVal}
                    maxLength={50}
                    onChange={(e) => {
                      setPasswordNewVal(e.target.value.trim());
                    }}
                  />
                </Form.Group>
              </Col>
              <Col sm={12} lg={12} xl={12}>
                <Form.Group className="mb-3">
                  <Form.Label>ยืนยันรหัสผ่านใหม่ : </Form.Label>
                  <Form.Control
                    type="password"
                    size="sm"
                    id="confirm_new_password"
                    placeholder="*****"
                    value={passwordNewConfirmVal}
                    maxLength={50}
                    onChange={(e) => {
                      setPasswordNewConfirmVal(e.target.value.trim());
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="bg-teal-500 text-white active:bg-teal-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={() => editPassword()}
          >
            ยืนยัน <AiIcons.AiOutlineSave style={{ display: "inline" }} />
          </button>
          <button
            className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={() => setModelEditPassword(false)}
          >
            ยกเลิก <ImIcons.ImCancelCircle style={{ display: "inline" }} />
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

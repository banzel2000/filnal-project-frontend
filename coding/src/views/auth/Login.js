import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import Navbar from "components/Navbars/AuthNavbar.js";
import FooterSmall from "components/Footers/FooterSmall.js";
import Swal from "sweetalert2";
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
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import * as GrIcons from "react-icons/gr";
import DateTimePicker from "react-datetime-picker";
import ReactPaginate from "react-paginate";
import Resizer from "react-image-file-resizer";
import validator from "validator";
import { ROOT_SERVER } from "layouts/rootServer.js";

export default function Login() {
  const [userRoleList, setUserRoleList] = useState([]);
  const [modalAddUser, setModalAddUser] = useState(false);
  const [facultyList, setFacultyList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [optionUserRoleData, setOptionUserRoleData] = useState(-1);
  const [optionFacultyData, setOptionFacultyData] = useState(-1);
  const [optionBranchData, setOptionBranchData] = useState(-1);
  const [disabledBranch, setDisabledBranch] = useState(true);
  const [disabledFaculty, setDisabledFaculty] = useState(true);
  const [disabledUserCode, setDisabledUserCode] = useState(true);
  const [userImage, setUserImage] = useState(null);
  const [userShowImage, setUserShowImage] = useState(null);
  const [passwordVal, setPasswordVal] = useState("");
  const [emailVal, setEmailVal] = useState("");

  const [userCodeAddVal, setUserCodeAddVal] = useState("");
  const [namePrefixAddVal, setNamePrefixAddVal] = useState("");
  const [nickNameAddVal, setNickNameAddVal] = useState("");
  const [nameAddVal, setNameAddVal] = useState("");
  const [surnameAddVal, setSurnameAddVal] = useState("");
  const [emailAddVal, setEmailAddVal] = useState("");
  const [passwordAddVal, setPasswordAddVal] = useState("");

  const [emailError, setEmailError] = useState(0);
  const [studentYear, setStudentYear] = useState(-1);

  useEffect(() => {  
    Axios.post(ROOT_SERVER+"/queryUserRole", { adminStatus: 0 }).then(
      (responses) => {
        if (responses.data.status === 1) {
          setUserRoleList(responses.data.userRoleList);
        }
      }
    );
  }, []);

  const checkLogin = () => {
    Axios.post(ROOT_SERVER+"/login", {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    }).then((response) => {
      if (response.data.status === "ok") {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user_id_login", response.data.user_id_login);
        window.location = "/admin/Dashboard";
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Email หรือ รหัสผ่านไม่ถูกต้อง",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    });
  };

  const showModalAddUser = async () => {
    setModalAddUser(true);
    setDisabledBranch(true);
    setOptionBranchData(-1);
    setBranchList([]);
    setEmailError(0);
    setUserShowImage(null);
    setStudentYear(-1);
    try {
      const { data } = await Axios.post(ROOT_SERVER+"/queryFaculty", {
        f_id: -1,
      });
      if (data.status === 1) {
        setFacultyList(data.facultyList);
      }
    } catch (error) {
      this.setState({ error });
    }
  };
  const onChangeHandlerStudentYear = async (e) => {
    const optionHandlerData = parseInt(
      e.target.childNodes[e.target.selectedIndex].getAttribute("id")
    );
    setStudentYear(optionHandlerData);
  };

  const onChangeHandlerUserRole = async (e) => {
    setDisabledUserCode(true);
    const optionHandlerData = parseInt(
      e.target.childNodes[e.target.selectedIndex].getAttribute("id")
    );

    console.log(optionHandlerData);
    if (
      optionHandlerData === 1 ||
      optionHandlerData === 2 ||
      optionHandlerData === 3 ||
      optionHandlerData === 4
    ) {
      if (optionHandlerData === 1) {
        setDisabledUserCode(false);
      }
      setDisabledFaculty(false);
    } else {
      setDisabledUserCode(true);
      setDisabledFaculty(true);
      setDisabledBranch(true);
    }
    setOptionUserRoleData(optionHandlerData);
  };

  const onChangeHandlerFaculty = async (e) => {
    setBranchList([]);
    const optionHandlerData =
      e.target.childNodes[e.target.selectedIndex].getAttribute("id");
    setOptionFacultyData(optionHandlerData);

    if (optionHandlerData != -1) {
      try {
        const { data } = await Axios.post(
          ROOT_SERVER+"/queryBranchByFacultyID",
          {
            f_id: parseInt(optionHandlerData),
          }
        );
        if (data.status === 1) {
          if (optionUserRoleData != 4) {
            setBranchList(data.branchList);
            setDisabledBranch(false);
          }
        }
      } catch (error) {
        this.setState({ error });
      }
    } else {
      setDisabledBranch(true);
      setBranchList([]);
      setOptionBranchData(-1);
    }
  };

  const onChangeHandlerBranch = async (e) => {
    const optionHandlerData =
      e.target.childNodes[e.target.selectedIndex].getAttribute("id");
    setOptionBranchData(optionHandlerData);
  };

  const addUser = async () => {
    const fd = new FormData();

    let ur_id = parseInt(optionUserRoleData);
    let f_id = parseInt(optionFacultyData);
    let b_id = parseInt(optionBranchData);
    let user_code = "";
    let name_prefix = document.getElementById("name_prefix").value;
    let name = document.getElementById("name").value;
    let surname = document.getElementById("surname").value;
    let nickname = document.getElementById("nickname").value;
    let image = userImage;
    let email = document.getElementById("a_email").value;
    let password = document.getElementById("a_password").value;
    console.log(password.length);
    if (ur_id !== 1 && ur_id !== -1) {
      if (ur_id === 4) {
        b_id = 0;
      } else if (ur_id === 5) {
        b_id = 0;
        f_id = 0;
      }
      const user_code_random = makeUserCode(11);
      user_code_random.then((value) => {
        user_code = value;
      });
    } else {
      user_code = document.getElementById("user_code").value;
    }

    Swal.fire({
      title: "ต้องการเพิ่มผู้ใช้หรือไม่?",
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
          ur_id === -1 ||
          f_id === -1 ||
          b_id === -1 ||
          user_code === "" ||
          image === null ||
          name_prefix === "" ||
          name === "" ||
          studentYear === -1 ||
          surname === "" ||
          nickname === "" ||
          email === "" ||
          password === ""
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

        if (emailError == 0) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "E-mail ไม่ถูกต้อง",
            showConfirmButton: false,
            timer: 3000,
          });
          return;
        }

        if (password.length <= 8) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "รหัสผ่านต้องมากกว่า 8 ตัว",
            showConfirmButton: false,
            timer: 3000,
          });
          return;
        }

        if (user_code.length != 11) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "รหัสผู้ใช้งานต้อง 11 ตัว",
            showConfirmButton: false,
            timer: 3000,
          });
          return;
        }

        try {
          fd.append("ur_id", ur_id);
          fd.append("f_id", f_id);
          fd.append("b_id", b_id);
          fd.append("user_code", user_code);
          fd.append("name_prefix", name_prefix);
          fd.append("name", name);
          fd.append("surname", surname);
          fd.append("nickname", nickname);
          fd.append("student_year", studentYear);
          fd.append("image", image);
          fd.append("email", email);
          fd.append("password", password);

          const { data } = await Axios.post(
            ROOT_SERVER+"/addUser",
            fd
          );
          if (data.status === 1) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "เพิ่มผู้ใช้สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setModalAddUser(false);
            window.location.reload(false);
          } else if (data.status === -1) {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "อีเมลซ้ำ",
              showConfirmButton: false,
              timer: 3000,
            });
          } else if (data.status === 0) {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "รหัสผู้ใช้ซ้ำ",
              showConfirmButton: false,
              timer: 3000,
            });
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "เพิ่มผู้ใช้ไม่สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setModalAddUser(false);
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
          480,
          480,
          "JPEG",
          100,
          0,
          (uri) => {
            imageHandler(files[0]);
            setUserImage(uri);
          },
          "file",
          100,
          100
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

  const makeUserCode = async (length) => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const onChange = (event, { newValue }) => {
    setPasswordVal(newValue.replace(/\s/g, ""));
  };

  const validateEmail = (e) => {
    var email = e.target.value.trim();
    setEmailAddVal(email);
    if (validator.isEmail(email)) {
      setEmailError(1);
    } else {
      setEmailError(0);
    }
  };

  return (
    <>
      <Navbar transparent />
      <main>
        <section className="relative w-full h-full py-40 min-h-screen">
          <div
            className="absolute top-0 w-full h-full bg-blueGray-600 bg-no-repeat bg-full"
            // style={{
            //   backgroundImage:
            //     "url(" + require("assets/img/login.png").default + ")",
            // }}
          ></div>

          <div className="container mx-auto px-4 h-full">
            <div className="flex content-center items-center justify-center h-full">
              <div className="w-full lg:w-4/12 px-4">
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
                  <div className="rounded-t mb-0 px-6 py-6">
                    <div className="text-center mb-3">
                      <h6 className="text-blueGray-500 text-sm font-bold">
                        MSU Event
                      </h6>
                    </div>

                    <hr className="mt-6 border-b-1 border-blueGray-300" />
                  </div>
                  <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                    <div className="text-blueGray-400 text-center mb-3 font-bold">
                      <small>เข้าสู่ระบบที่สมัครแล้ว</small>
                    </div>
                    <form>
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="text"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          placeholder="Email"
                          maxLength={50}
                          value={emailVal}
                          onChange={(e) => {
                            setEmailVal(e.target.value.trim());
                          }}
                        />
                      </div>

                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          รหัสผ่าน
                        </label>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          placeholder="Password"
                          maxLength={50}
                          value={passwordVal}
                          onChange={(e) => {
                            setPasswordVal(e.target.value.trim());
                          }}
                        />
                      </div>
                      <div>
                        {/* <label className="inline-flex items-center cursor-pointer">
                      <input
                        id="customCheckLogin"
                        type="checkbox"
                        className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                      />
                      <span className="ml-2 text-sm font-semibold text-blueGray-600">
                        จำรหัสผ่าน
                      </span>
                    </label> */}
                      </div>

                      <div className="text-center mt-6">
                        <button
                          className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                          type="button"
                         onClick={checkLogin}
                        >
                          เข้าสู่ระบบ
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="flex flex-wrap mt-6 relative">
                  <div className="w-1/2">
                    {/* <a
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  className="text-blueGray-200"
                >
                  <small>ลืมรหัสผ่าน?</small>
                </a> */}
                  </div>
                  <div className="w-1/2 text-right">
                    <button
                      onClick={() => showModalAddUser()}
                      className="text-blueGray-200"
                    >
                      <small>สมัครสมาชิก</small>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <FooterSmall absolute />
        </section>
      </main>

      <Modal
        size="lg"
        show={modalAddUser}
        onHide={() => setModalAddUser(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            สมัครสมาชิก
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="">
          <Container>
            <Row>
              <Col sm={12} lg={12} xl={12}>
                <Form.Group className="mb-3">
                  <Form.Label>ระดับผู้ใช้ : </Form.Label>
                  <Form.Select size="sm" onChange={onChangeHandlerUserRole}>
                    <option id={-1}>เลือก</option>
                    {userRoleList.map((val, key) => {
                      return <option id={val.id}>{val.name}</option>;
                    })}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col sm={12} lg={12} xl={12}>
                <Form.Group className="mb-3">
                  <Form.Label>รหัสผู้ใช้ : </Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    id="user_code"
                    maxLength={11}
                    disabled={disabledUserCode}
                    value={userCodeAddVal}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (!isNaN(+value)) {
                        setUserCodeAddVal(e.target.value.trim());
                      } else {
                        setUserCodeAddVal("");
                      }
                    }}
                  />
                </Form.Group>
              </Col>
              <Col sm={6} lg={2} xl={2}>
                <Form.Group className="mb-3">
                  <Form.Label>คำนำหน้า : </Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    id="name_prefix"
                    maxLength={20}
                    value={namePrefixAddVal}
                    onChange={(e) => {
                      setNamePrefixAddVal(e.target.value.trim());
                    }}
                  />
                </Form.Group>
              </Col>
              <Col sm={12} lg={5} xl={5}>
                <Form.Group className="mb-3">
                  <Form.Label>ชื่อจริง : </Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    id="name"
                    maxLength={50}
                    value={nameAddVal}
                    onChange={(e) => {
                      setNameAddVal(e.target.value.trim());
                    }}
                  />
                </Form.Group>
              </Col>
              <Col sm={12} lg={5} xl={5}>
                <Form.Group className="mb-3">
                  <Form.Label>นามสกุล : </Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    id="surname"
                    maxLength={50}
                    value={surnameAddVal}
                    onChange={(e) => {
                      setSurnameAddVal(e.target.value.trim());
                    }}
                  />
                </Form.Group>
              </Col>
              <Col sm={12} lg={6} xl={6}>
                <Form.Group className="mb-3">
                  <Form.Label>ชื่อเล่น : </Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    id="nickname"
                    maxLength={50}
                    value={nickNameAddVal}
                    onChange={(e) => {
                      setNickNameAddVal(e.target.value.trim());
                    }}
                  />
                </Form.Group>
              </Col>
              <Col sm={12} lg={6} xl={6}>
                <Form.Group className="mb-3">
                  <Form.Label>ชั้นปี : </Form.Label>
                  <Form.Select size="sm" onChange={onChangeHandlerStudentYear}>
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
                </Form.Group>
              </Col>
              <Col sm={12} lg={12} xl={12}>
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    รูปภาพผู้ใช้
                  </label>
                  <div className="img-holder">
                    <img src={userShowImage} alt="" id="img" className="img" />
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
              </Col>
              <Col sm={12} lg={12} xl={12}>
                <Form.Group className="mb-3">
                  <Form.Label>คณะ : </Form.Label>
                  <Form.Select
                    size="sm"
                    onChange={onChangeHandlerFaculty}
                    disabled={disabledFaculty}
                  >
                    <option id={-1}>เลือก</option>
                    {facultyList.map((val, key) => {
                      return <option id={val.id}>{val.name}</option>;
                    })}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col sm={12} lg={12} xl={12}>
                <Form.Group className="mb-3">
                  <Form.Label>สาขา : </Form.Label>
                  <Form.Select
                    size="sm"
                    onChange={onChangeHandlerBranch}
                    disabled={disabledBranch}
                  >
                    <option id={-1}>เลือก</option>
                    {branchList.map((val, key) => {
                      return <option id={val.id}>{val.name}</option>;
                    })}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col sm={12} lg={12} xl={12}>
                <Form.Group className="mb-3">
                  <Form.Label>อีเมล : </Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    id="a_email"
                    maxLength={50}
                    value={emailAddVal}
                    onChange={validateEmail}
                  />
                </Form.Group>
              </Col>
              <Col sm={12} lg={12} xl={12}>
                <Form.Group className="mb-3">
                  <Form.Label>รหัสผ่าน : </Form.Label>
                  <Form.Control
                    type="password"
                    size="sm"
                    id="a_password"
                    maxLength={50}
                    value={passwordAddVal}
                    onChange={(e) => {
                      setPasswordAddVal(e.target.value.trim());
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
            onClick={() => addUser()}
          >
            ยืนยัน <AiIcons.AiOutlineSave style={{ display: "inline" }} />
          </button>
          <button
            onClick={() => setModalAddUser(false)}
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

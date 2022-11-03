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
import * as RiIcons from "react-icons/ri";
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
import validator from 'validator'
import { ROOT_SERVER } from "layouts/rootServer.js";

export default function UserDataForAdmin() {
  const [userList, setUserList] = useState([]);
  const [userRoleList, setUserRoleList] = useState([]);
  const [searchUserRoleByName, setSearchUserRoleByName] = useState("");
  const [searchUserByName, setSearchUserByName] = useState("");
  const [modalEditUserRole, setModalEditUserRole] = useState(false);
  const [modalAddUserRole, setModalAddUserRole] = useState(false);
  const [modalAddUser, setModalAddUser] = useState(false);
  const [userRoleData, setUserRoleData] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [modalEditeUser, setModalEditeUser] = useState(false);
  const [optionUserRoleData, setOptionUserRoleData] = useState(-1);
  const [optionFacultyData, setOptionFacultyData] = useState(-1);
  const [optionBranchData, setOptionBranchData] = useState(-1);
  const [disabledBranch, setDisabledBranch] = useState(true);
  const [disabledFaculty, setDisabledFaculty] = useState(true);
  const [disabledUserCode, setDisabledUserCode] = useState(true);
  const [userRoleName, setUserRoleName] = useState("");
  const [userImage, setUserImage] = useState(null);
  const [userShowImage, setUserShowImage] = useState(null);
  const [modelEditPassword, setModelEditPassword] = useState(false);
  const [userEmail, setUserEmail] = useState(false);
  const [emailError, setEmailError] = useState(0)
  const [studentYear, setStudentYear] = useState(-1)
  const user_id_login = parseInt(
    localStorage.getItem("user_id_login").split(",")[0]
  );
  const user_role_id_login = parseInt(
    localStorage.getItem("user_id_login").split(",")[1]
  );
  const [pageNumber, setPageNumber] = useState(0);
  const [pageNumber2, setPageNumber2] = useState(0);
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;
  const pagesVisited2 = pageNumber2 * usersPerPage;

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const changePage2 = ({ selected }) => {
    setPageNumber2(selected);
  };

  const [userData, setUserData] = useState([]); 

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
        window.location = "/login/auth/login";
      }
    });

    Axios.post(ROOT_SERVER+"/queryUserRole",{adminStatus: 1}).then((responses) => {
      if (responses.data.status === 1) {
        setUserRoleList(responses.data.userRoleList);
      }
    });

    Axios.get(ROOT_SERVER+"/queryUser", {}).then((response) => {
      if (response.data.status === 1) {
        setUserList(response.data.userList);
      }
    });
  }, []);

  const pageCount = Math.ceil(userRoleList.length / usersPerPage);

  const pageCount2 = Math.ceil(userList.length / usersPerPage);

  const showModalEditUserRole = async (ur_id) => {
    setModalEditUserRole(true);
    try {
      const { data } = await Axios.post(
        ROOT_SERVER+"/queryUserRoleByID",
        {
          ur_id: ur_id,
        }
      );
      if (data.status === 1) {
        setUserRoleData(data.userRoleData);
        setUserRoleName(data.userRoleData[0].name);
      }
    } catch (error) {
      this.setState({ error });
    }
  };

  const addUserRole = async () => {
    let ur_name = document.getElementById("ur_name").value;
    Swal.fire({
      title: "ต้องการเพิ่มระดับผู้ใช้หรือไม่?",
      text: " ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "	#198754",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (ur_name === "") {
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
            ROOT_SERVER+"/addUserRole",
            {
              ur_name: ur_name,
            }
          );
          if (data) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "เพิ่มระดับผู้ใช้สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setModalAddUserRole(false);
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "เพิ่มระดับผู้ใช้ไม่สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setModalAddUserRole(false);
            window.location.reload(false);
          }
        } catch (error) {
          this.setState({ error });
        }
      }
    });
  };

  const deleteUserRole = async (ur_id) => {
    Swal.fire({
      title: "ต้องการลบระดับผู้ใช้หรือไม่?",
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
            ROOT_SERVER+"/deleteUserRole",
            {
              ur_id: ur_id,
            }
          );
          if (data) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "ลบระดับผู้ใช้สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "ลบระดับผู้ใช้ไม่สำเร็จ",
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

  const deleteUser = async (u_id) => {
    Swal.fire({
      title: "ต้องการลบผู้ใช้หรือไม่?",
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
            ROOT_SERVER+"/deleteUser",
            {
              u_id: u_id,
            }
          );
          if (data) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "ลบผู้ใช้สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "ลบผู้ใช้ไม่สำเร็จ",
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

  const editUserRole = async () => {
    let ur_id = document.getElementById("e_ur_id").value;
    let ur_name = document.getElementById("e_ur_name").value;
    Swal.fire({
      title: "ต้องการแก้ไขระดับผู้ใช้หรือไม่?",
      text: " ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "	#198754",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (ur_id === "" || ur_name === "") {
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
            ROOT_SERVER+"/editUserRole",
            {
              ur_id: ur_id,
              ur_name: ur_name,
            }
          );
          if (data) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "แก้ไขระดับผู้ใช้สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setModalEditUserRole(false);
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "เแก้ไขระดับผู้ใช้ไม่สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setModalEditUserRole(false);
            window.location.reload(false);
          }
        } catch (error) {
          this.setState({ error });
        }
      }
    });
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

  const showModalAddUser = async () => {
    setModalAddUser(true);
    setDisabledBranch(true);
    setOptionBranchData(-1);
    setBranchList([]);
    setUserImage("");
    setUserShowImage(""); 
    setUserData([])
    setEmailError(0)
    setUserShowImage(null)
    setStudentYear(-1)

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
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    console.log(image)
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
        console.log(f_id + "," + b_id);
        if (
          ur_id === -1 ||
          f_id === -1 ||
          b_id === -1 ||
          user_code === "" ||
          image === "" ||
          name_prefix === "" ||
          name === "" ||
          surname === "" ||
          nickname === "" ||
          email === "" ||
          password === "" ||
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

        if (
          emailError == 0
        ) {
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
  
  
  const showModalEditeUser = async (user_id) => {
    setModalEditeUser(true)
    setUserImage("");
    setUserShowImage(""); 
    setUserData([])
    setStudentYear(-1)
    try {
      const { data } = await Axios.post(
        ROOT_SERVER+"/queryUserDataByID",
        {
          user_id: user_id,
        }
      );
      if (data.status === 1) {
        console.log(data.userData);
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
          setUserImage(imageObjectURL);
          setUserShowImage(imageObjectURL); 
          setStudentYear(data.userData[0].student_year);
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
              email: data.userData[0].email,
              user_image: imageObjectURL,
            },
          ]);
        }
      }
    } catch (error) {
      this.setState({ error });
    }
   
  };

  const updateUserData = async () => { 
    const fd = new FormData(); 
    let email = document.getElementById("e_email").value;
    let nickname = document.getElementById("e_nickname").value;
    let name_prefix = document.getElementById("e_name_prefix").value;
    let name = document.getElementById("e_name").value;
    let surname = document.getElementById("e_surname").value;

    let imageStatus = 0 
    if(userImage == userShowImage){
      imageStatus = 1;
    }
 
    fd.append("email",email)
    fd.append("nickname",nickname)
    fd.append("name_prefix",name_prefix)
    fd.append("name",name)
    fd.append("surname",surname)
    fd.append("student_year",studentYear)
    fd.append("image",userImage)
    fd.append("imageStatus", imageStatus);
     
    Swal.fire({
      title: "ต้องการแก้ไขข้อมูลผู้ใช้งานหรือไม่?",
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
          studentYear === -1
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
              title: "แก้ไขข้อมูลผู้ใช้งานสำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setModalEditeUser(false)
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "แก้ไขข้อมูลผู้ใช้งานไม่สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setModalEditeUser(false)
            window.location.reload(false);
          }
        } catch (error) {
          this.setState({ error });
        }
      }
    });
  };

  
  const showModelEditPassword = (email) => {
    setModelEditPassword(true) 
    setUserEmail(email); 
    console.log(email)
  };

  const editPassword = async () => {
    let email = userEmail; 
    let new_password = document.getElementById("new_password").value;
    let confirm_new_password = document.getElementById(
      "confirm_new_password"
    ).value;
    console.log(111)
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
            ROOT_SERVER+"/editPasswordAdmin",
            {
              email: email, 
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

  const validateEmail = (e) => {
    var email = e.target.value
  
    if (validator.isEmail(email)) {
      setEmailError(1)
    } else {
      setEmailError(0)
    }
  }

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
                <button
                  className="mt-3 bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setModalAddUserRole(true)}
                >
                  เพิ่มระดับผู้ใช้{" "}
                  <MdIcons.MdOutlineAddBox style={{ display: "inline" }} />
                </button>
                <button
                  className="mt-3 bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => showModalAddUser()}
                >
                  เพิ่มผู้ใช้{" "}
                  <MdIcons.MdOutlineAddBox style={{ display: "inline" }} />
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
                          ระดับผู้ใช้{"(" + userRoleList.length + ")"}
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
                              placeholder="ค้นหาชื่อระดับกิจกรรม... "
                              className="border-0 px-4 py-1 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
                              onChange={(e) => {
                                setSearchUserRoleByName(e.target.value);
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
                          รหัสระดับผู้ใช้
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          ชื่อระดับผู้ใช้
                        </th>

                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {userRoleList.length <= 0 ? (
                        <td
                          className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
                          colSpan={4}
                        >
                          ไม่มีข้อมูล
                        </td>
                      ) : (
                        userRoleList
                          .slice(pagesVisited, pagesVisited + usersPerPage)
                          .filter((val) => {
                            if (searchUserRoleByName === "") {
                              return val;
                            } else if (
                              val.name
                                .toLowerCase()
                                .includes(searchUserRoleByName.toLowerCase())
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
                                  {val.id}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1 ">
                                  {val.name}
                                </td>

                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1 text-right">
                                  <button
                                    className=" bg-orange-500 text-white active:bg-orange-600  font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() =>
                                      showModalEditUserRole(val.id)
                                    }
                                  >
                                    <AiIcons.AiOutlineEdit />
                                  </button>
                                  <button
                                    className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => deleteUserRole(val.id)}
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
                  {userRoleList.length <= 0 ? null : (
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
                          ผู้ใช้ทั้งหมด{"(" + userList.length + ")"}
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
                          ชื่อจริง นามสกุล
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
                      {userList.length <= 0 ? (
                        <td
                          className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
                          colSpan={7}
                        >
                          ไม่มีข้อมูล
                        </td>
                      ) : (
                        userList
                          .slice(pagesVisited2, pagesVisited2 + usersPerPage)
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
                                  {pagesVisited2 + key + 1}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.user_code}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.fullName}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.ur_name}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.f_name}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.b_name}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1 text-right">
                                  <button
                                    className=" bg-orange-500 text-white active:bg-orange-600  font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => showModalEditeUser(val.id)}
                                  >
                                    <AiIcons.AiOutlineEdit />
                                  </button>
                                  <button
                                    className=" bg-orange-500 text-white active:bg-orange-600  font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => showModelEditPassword(val.email)}
                                  >
                                    <RiIcons.RiLockPasswordLine />
                                  </button>
                                  <button
                                    className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => deleteUser(val.id)}
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
                  {userList.length <= 0 ? null : (
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
        show={modalEditUserRole}
        onHide={() => setModalEditUserRole(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            แก้ไขข้อมูลระดับผู้ใช้
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="">
          <Container>
            <Row>
              <Col sm={12} lg={4} xl={4}>
                <Form.Group className="mb-3">
                  <Form.Label>รหัสระดับผู้ใช้ : </Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    defaultValue={
                      userRoleData.length > 0 ? userRoleData[0].id : ""
                    }
                    id="e_ur_id"
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col sm={12} lg={8} xl={8}>
                <Form.Group className="mb-3">
                  <Form.Label>ชื่อระดับผู้ใช้ : </Form.Label>
                  <Form.Control
                    type="text"
                    size="sm" 
                    id="e_ur_name"
                    onChange={e => setUserRoleName(e.target.value)}
                    value={userRoleName || ""}
                    maxLength={100}
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
            onClick={() => editUserRole(false)}
          >
            ยืนยัน <AiIcons.AiOutlineSave style={{ display: "inline" }} />
          </button>
          <button
            onClick={() => setModalEditUserRole(false)}
            className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
          >
            ยกเลิก <ImIcons.ImCancelCircle style={{ display: "inline" }} />
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        size="lg"
        show={modalAddUser}
        onHide={() => setModalAddUser(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            เพิ่มผู้ใช้
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
                    disabled={disabledUserCode}
                    maxLength={11}
                    onChange={(e) => {
                      const value = e.target.value;
                      if(!isNaN(+value)){ 

                      } else {
                        e.target.value = ""
                      }
                    }}  
                  />
                </Form.Group>
              </Col>
              <Col sm={6} lg={2} xl={2}>
                <Form.Group className="mb-3">
                  <Form.Label>คำนำหน้า : </Form.Label>
                  <Form.Control type="text" size="sm" id="name_prefix" maxLength={20}/>
                </Form.Group>
              </Col>
              <Col sm={12} lg={5} xl={5}>
                <Form.Group className="mb-3">
                  <Form.Label>ชื่อจริง : </Form.Label>
                  <Form.Control type="text" size="sm" id="name" maxLength={50}/>
                </Form.Group>
              </Col>
              <Col sm={12} lg={5} xl={5}>
                <Form.Group className="mb-3">
                  <Form.Label>นามสกุล : </Form.Label>
                  <Form.Control type="text" size="sm" id="surname" maxLength={50}/>
                </Form.Group>
              </Col>
              <Col sm={12} lg={6} xl={6}>
                <Form.Group className="mb-3">
                  <Form.Label>ชื่อเล่น : </Form.Label>
                  <Form.Control type="text" size="sm" id="nickname" maxLength={50} />
                </Form.Group>
              </Col>
              <Col sm={12} lg={6} xl={6}>
                <Form.Group className="mb-3">
                  <Form.Label>ชั้นปี : </Form.Label>
                  <Form.Select size="sm" onChange={onChangeHandlerStudentYear} >
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
                  <Form.Control type="email" size="sm" id="email" onChange={validateEmail} maxLength={50}/>
                </Form.Group>
              </Col>
              <Col sm={12} lg={12} xl={12}>
                <Form.Group className="mb-3">
                  <Form.Label>รหัสผ่าน : </Form.Label>
                  <Form.Control type="password" size="sm" id="password" maxLength={50}/>
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

      <Modal
        size="lg"
        show={modalAddUserRole}
        onHide={() => setModalAddUserRole(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            เพิ่มระดับผู้ใช้
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="">
          <Container>
            <Row>
              <Col sm={12} lg={4} xl={4}>
                <Form.Group className="mb-3">
                  <Form.Label>รหัสระดับผู้ใช้ : </Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    id="ur_id"
                    placeholder="อัตโนมัติ"
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col sm={12} lg={8} xl={8}>
                <Form.Group className="mb-3">
                  <Form.Label>ชื่อระดับผู้ใช้ : </Form.Label>
                  <Form.Control type="text" size="sm" id="ur_name" maxLength={100}/>
                </Form.Group>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="bg-teal-500 text-white active:bg-teal-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={() => addUserRole()}
          >
            ยืนยัน <AiIcons.AiOutlineSave style={{ display: "inline" }} />
          </button>
          <button
            onClick={() => setModalAddUserRole(false)}
            className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
          >
            ยกเลิก <ImIcons.ImCancelCircle style={{ display: "inline" }} />
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        size="lg"
        show={modalEditeUser}
        onHide={() => setModalEditeUser(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            แก้ไขข้อมูลผู้ใช้
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="">
        <Container>
            <Row>
              <Col sm={12} lg={12} xl={12}>
                <Form.Group className="mb-3">
                  <Form.Label>ระดับผู้ใช้ : </Form.Label>
                  <Form.Control type="text" size="sm" id="e_ur_id" disabled defaultValue={userData.length <= 0 ? null : userData[0].ur_name}/>
                </Form.Group>
              </Col>
              <Col sm={12} lg={12} xl={12}>
                <Form.Group className="mb-3">
                  <Form.Label>รหัสผู้ใช้ : </Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    id="e_user_code"
                    defaultValue={userData.length <= 0 ? null : userData[0].user_code}
                    disabled 
                    maxLength={11}
                    onChange={(e) => {
                      const value = e.target.value;
                      if(!isNaN(+value)){ 

                      } else {
                        e.target.value = ""
                      }
                    }}  
                  />
                </Form.Group>
              </Col>
              <Col sm={6} lg={2} xl={2}>
                <Form.Group className="mb-3">
                  <Form.Label>คำนำหน้า : </Form.Label>
                  <Form.Control maxLength={20} type="text" size="sm" id="e_name_prefix" defaultValue={userData.length <= 0 ? null : userData[0].name_prefix}/>
                </Form.Group>
              </Col>
              <Col sm={12} lg={5} xl={5}>
                <Form.Group className="mb-3">
                  <Form.Label>ชื่อจริง : </Form.Label>
                  <Form.Control maxLength={50} type="text" size="sm" id="e_name" defaultValue={userData.length <= 0 ? null : userData[0].name}/>
                </Form.Group>
              </Col>
              <Col sm={12} lg={5} xl={5}>
                <Form.Group className="mb-3">
                  <Form.Label>นามสกุล : </Form.Label>
                  <Form.Control maxLength={50} type="text" size="sm" id="e_surname" defaultValue={userData.length <= 0 ? null : userData[0].surname}/>
                </Form.Group>
              </Col>
              <Col sm={12} lg={6} xl={6}>
                <Form.Group className="mb-3">
                  <Form.Label>ชื่อเล่น : </Form.Label>
                  <Form.Control maxLength={50} type="text" size="sm" id="e_nickname" defaultValue={userData.length <= 0 ? null : userData[0].nickname}/>
                </Form.Group>
              </Col>
              <Col sm={12} lg={6} xl={6}>
                <Form.Group className="mb-3">
                  <Form.Label>ชั้นปี : </Form.Label>
                  <Form.Select size="sm" onChange={onChangeHandlerStudentYear} value={studentYear} >
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
                    <img src={userShowImage} alt="" id="e_img" className="img" />
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
                  <Form.Control type="text" size="sm" id="e_f_id" disabled defaultValue={userData.length <= 0 ? null : userData[0].f_name}/>
                </Form.Group>
              </Col>
              <Col sm={12} lg={12} xl={12}>
                <Form.Group className="mb-3">
                  <Form.Label>สาขา : </Form.Label>
                  <Form.Control type="text" size="sm" id="e_b_id" disabled defaultValue={userData.length <= 0 ? null : userData[0].b_name}/>
                </Form.Group>
              </Col>
              <Col sm={12} lg={12} xl={12}>
                <Form.Group className="mb-3">
                  <Form.Label>อีเมล : </Form.Label>
                  <Form.Control maxLength={50} type="email" size="sm" id="e_email" disabled defaultValue={userData.length <= 0 ? null : userData[0].email}/>
                </Form.Group>
              </Col> 
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="bg-teal-500 text-white active:bg-teal-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={()=> updateUserData()}
          >
            ยืนยัน <AiIcons.AiOutlineSave style={{ display: "inline" }} />
          </button>
          <button
            onClick={() => setModalEditeUser(false)}
            className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
          >
            ยกเลิก <ImIcons.ImCancelCircle style={{ display: "inline" }} />
          </button>
        </Modal.Footer>
      </Modal>
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
              <Form.Label> </Form.Label>
              <Col sm={12} lg={12} xl={12}>
                <Form.Group className="mb-3">
                  <Form.Label>รหัสผ่านใหม่ : </Form.Label>
                  <Form.Control
                    type="password"
                    size="sm"
                    id="new_password"
                    placeholder="*****"
                    maxLength={50}
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
                    maxLength={50}
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

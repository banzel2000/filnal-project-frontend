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

export default function EventDataForAdmin() {
  const [eventList, setEventList] = useState([]);
  const [searchEventByName, setSearchEventByName] = useState("");
  const [eventRoleList, setEventRoleList] = useState([]);
  const [searchEventRoleByName, setSearchEventRoleByName] = useState("");
  const [modalAddEvent, setModalAddEvent] = useState(false);
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
  const [modalEditEventRole, setModalEditEventRole] = useState(false);
  const [eventRoleData, setEventRoleData] = useState([]);
  const [eventRoleName, setEventRoleName] = useState("");
  const [modalAddEventRole, setModalAddEventRole] = useState(false);
  const [modalEditeEvent, setModalEditeEvent] = useState(false);
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

  const [eventRoleOptionList, setEventRoleOptionList] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [optionEventRoleData, setOptionEventRoleData] = useState(-1);
  const [optionFacultyData, setOptionFacultyData] = useState(-1);
  const [optionBranchData, setOptionBranchData] = useState(-1);
  const [optionEventRoleNameData, setOptionEventRoleNameData] = useState("");
  const [optionFacultyNameData, setOptionFacultyNameData] = useState("");
  const [optionBranchNameData, setOptionBranchNameData] = useState("");
  const [disabledBranch, setDisabledBranch] = useState(true);
  const [disabledFaculty, setDisabledFaculty] = useState(true);

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

    Axios.post(ROOT_SERVER+"/queryFaculty", {
      f_id: -1,
    }).then((response) => {
      if (response.data.status === 1) {
        setFacultyList(response.data.facultyList);
      }
    }); 

    Axios.post(ROOT_SERVER+"/queryBranch", {
      b_id: -1,
    }).then((response) => {
      if (response.data.status === 1) {
        setBranchList(response.data.branchList);
      }
    });

    Axios.post(ROOT_SERVER+"/queryUserDataByID", {
      user_id: user_id_login,
    }).then((response) => {
      if (response.data.status === 1) {
        setUserData(response.data.userData);
      }
    });
    Axios.post(ROOT_SERVER+"/queryEventRoleList", { er_id: -1 }).then(
      (response) => {
        console.log(response.data);
        if (response.data.status === 1) {
          setEventRoleList(response.data.eventRoleList);
        }
      }
    );
    Axios.post(ROOT_SERVER+"/queryEventList", {
      user_id: user_id_login,
      event_role_id: 0,
    }).then((response) => {
      if (response.data.status === 1) {
        setEventList(response.data.eventList);
      }
    });
  }, []);

  const pageCount = Math.ceil(eventRoleList.length / usersPerPage);

  const pageCount2 = Math.ceil(eventList.length / usersPerPage);

  const showModalAddEvent = async () => {
    setModalAddEvent(true);
    setDateTimePickerPreStartOnChange(null);
    setDateTimePickerPreEndOnChange(null);
    setDateTimePickerStartOnChange(null);
    setDateTimePickerEndOnChange(null);

    setEventImage("");
    setEventShowImage(null);
    setOptionEventRoleData(-1);
    setDisabledFaculty(true);
    setDisabledBranch(true);
    setOptionTermData(0);
    setEventData([]);

    setEventCode("");
    setEventName("");
    setQuantity("");
    setSlfHour("");
    setLocation("");
    setYear("");
    setDetail("");
    setCreateUserId("");
    setOptionBranchData(-1);
    setOptionFacultyData(-1);
    setOptionEventRoleData(-1);
    setDateTimePickerPreStartOnChange(null);
    setDateTimePickerPreEndOnChange(null);
    setDateTimePickerStartOnChange(null);
    setDateTimePickerEndOnChange(null);

    setDisabledDTEnd(true);
    setDisabledDTPreStart(true);
    setDisabledDTPreEnd(true);
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

  const showModalEditEventRole = async (er_id) => {
    setModalEditEventRole(true);
    try {
      const { data } = await Axios.post(
        ROOT_SERVER+"/queryEventRoleByID",
        {
          er_id: er_id,
        }
      );
      if (data.status === 1) {
        setEventRoleData(data.eventRoleData);
        setEventRoleName(data.eventRoleData[0].name);
      }
    } catch (error) {
      this.setState({ error });
    }
  };

  const addEventRole = async () => {
    let er_name = document.getElementById("er_name").value;
    Swal.fire({
      title: "ต้องการเพิ่มระดับกิจกรรมหรือไม่?",
      text: " ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "	#198754",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (er_name === "") {
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
            ROOT_SERVER+"/addEventRole",
            {
              er_name: er_name,
            }
          );
          if (data) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "เพิ่มระดับกิจกรรมสำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setModalAddEventRole(false);
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "เพิ่มระดับกิจกรรมไม่สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setModalAddEventRole(false);
            window.location.reload(false);
          }
        } catch (error) {
          this.setState({ error });
        }
      }
    });
  };

  const deleteEventRole = async (er_id) => {
    Swal.fire({
      title: "ต้องการลบระดับกิจกรรมหรือไม่?",
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
            ROOT_SERVER+"/deleteEventRole",
            {
              er_id: er_id,
            }
          );
          if (data) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "ลบระดับกิจกรรมสำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "ลบระดับกิจกรรมไม่สำเร็จ",
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

  const editEventRole = async () => {
    setModalEditEventRole(true);
    let er_id = document.getElementById("e_er_id").value;
    let er_name = document.getElementById("e_er_name").value;
    Swal.fire({
      title: "ต้องการแก้ไขระดับกิจกรรมหรือไม่?",
      text: " ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "	#198754",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (er_id === "" || er_name === "") {
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
            ROOT_SERVER+"/editEventRole",
            {
              er_id: er_id,
              er_name: er_name,
            }
          );
          if (data) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "แก้ไขระดับกิจกรรมสำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setModalEditEventRole(false);
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "เแก้ไขระดับกิจกรรมไม่สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setModalEditEventRole(false);
            window.location.reload(false);
          }
        } catch (error) {
          this.setState({ error });
        }
      }
    });
  };

  const showModalEditeEvent = async (
    event_id,
    term,
    er_name,
    f_name,
    b_name,
    f_id
  ) => {
    try {
      setModalEditeEvent(true);

      setDisabledDTEnd(false);
      setDisabledDTPreStart(false);
      setDisabledDTPreEnd(false);
      setDisabledFaculty(false);
      setDisabledBranch(false);
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
          const imageObjectURL = URL.createObjectURL(responses.data);
          setEventImage(imageObjectURL);
          setEventShowImage(imageObjectURL);
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
    } catch (error) {
      this.setState({ error });
    }
  };

  const onChangeHandlerEventRole = async (e) => {
    setBranchList([]);
    setFacultyList([]);

    const optionHandlerData = parseInt(
      e.target.childNodes[e.target.selectedIndex].getAttribute("id")
    );

    if (optionHandlerData === 1 || optionHandlerData === 2) {
      try {
        const { data } = await Axios.post(
          ROOT_SERVER+"/queryFaculty",
          {
            f_id: -1,
          }
        );
        if (data.status === 1) {
          setFacultyList(data.facultyList);
          setDisabledFaculty(false);
          setBranchList([]);
          setDisabledBranch(true);
        }
      } catch (error) {
        this.setState({ error });
      }
    } else if (optionHandlerData === 3 || optionHandlerData === -1) {
      setFacultyList([]);
      setDisabledFaculty(true);
      setBranchList([]);
      setDisabledBranch(true);
    }
    setOptionEventRoleData(optionHandlerData);
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
          if (optionEventRoleData !== 2) {
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

  const addEventCreate = async () => {
    const fd = new FormData();
    let event_code = document.getElementById("event_code").value;
    let event_name = document.getElementById("event_name").value;
    let slf_hour = document.getElementById("slf_hour").value;
    let quantity = document.getElementById("quantity").value;
    let year = document.getElementById("year").value;
    let location = document.getElementById("location").value;
    let detail = document.getElementById("detail").value;
    let image = eventImage;
    let er_id = optionEventRoleData;
    let f_id = optionFacultyData;
    let b_id = optionBranchData;
    let create_status = 1;
    let term = optionTermData;

    console.log(optionEventRoleData);
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
          event_code === "" ||
          event_name === "" ||
          slf_hour === "" ||
          quantity === "" ||
          year === "" ||
          location === "" ||
          detail === "" ||
          term === 0 ||
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

          fd.append("event_code", event_code);
          fd.append("name", event_name);
          fd.append("slf_hour", slf_hour);
          fd.append("quantity", quantity);
          fd.append("term", term);
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
          } else if (data.status === 1) {
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
        } catch (error) {
          this.setState({ error });
        }
      }
    });
  };

  const updateEventCreate = async (event_id) => {
    const fd = new FormData();

    Swal.fire({
      title: "คุณต้องแก้ไขข้อมูลกิจกรรมหรือไม่?",
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

          console.log(eventCodeStatus)
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
              title: "แก้ไขข้อมูลกิจกรรมสำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setModalEditeEvent(false);
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "แก้ไขข้อมูลกิจกรรมไม่สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setModalEditeEvent(false);
            window.location.reload(false);
          }
        } catch (error) {
          this.setState({ error });
        }
      }
    });
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
                  onClick={() => setModalAddEventRole(true)}
                >
                  เพิ่มระดับกิจกรรม{" "}
                  <MdIcons.MdOutlineAddBox style={{ display: "inline" }} />
                </button>
                <button
                  className="mt-3 bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => showModalAddEvent()}
                >
                  เพิ่มกิจกรรม{" "}
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
                          ระดับกิจกรรม{"(" + eventRoleList.length + ")"}
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
                                setSearchEventRoleByName(e.target.value);
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
                          รหัสระดับกิจกรรม
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          ชื่อระดับกิจกรรม
                        </th>

                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventRoleList.length <= 0 ? (
                        <td
                          className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
                          colSpan={4}
                        >
                          ไม่มีกิจกรรม
                        </td>
                      ) : (
                        eventRoleList
                          .slice(pagesVisited, pagesVisited + usersPerPage)
                          .filter((val) => {
                            if (searchEventRoleByName === "") {
                              return val;
                            } else if (
                              val.name
                                .toLowerCase()
                                .includes(searchEventRoleByName.toLowerCase())
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
                                  {val.id}
                                </td>

                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.name}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1 text-right">
                                  <button
                                    className=" bg-orange-500 text-white active:bg-orange-600  font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() =>
                                      showModalEditEventRole(val.id)
                                    }
                                  >
                                    <AiIcons.AiOutlineEdit />
                                  </button>
                                  <button
                                    className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => deleteEventRole(val.id)}
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
                  {eventRoleList.length <= 0 ? null : (
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
                          กิจกรรมทั้งหมด{"(" + eventList.length + ")"}
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
                      {eventList.length <= 0 ? (
                        <td
                          className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
                          colSpan={7}
                        >
                          ไม่มีกิจกรรม
                        </td>
                      ) : (
                        eventList
                          .slice(pagesVisited2, pagesVisited2 + usersPerPage)
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
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  <i className="fas fa-circle text-orange-500 mr-2"></i>{" "}
                                  {val.event_time_status}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1 text-right">
                                  <button
                                    className=" bg-orange-500 text-white active:bg-orange-600  font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() =>
                                      showModalEditeEvent(
                                        val.id,
                                        val.term,
                                        val.event_role_name,
                                        val.f_name,
                                        val.b_name,
                                        val.faculty_id
                                      )
                                    }
                                  >
                                    <AiIcons.AiOutlineEdit />
                                  </button>
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
                  {eventList.length <= 0 ? null : (
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
                  <Form.Select size="sm" onChange={onChangeHandlerEventRole}>
                    <option id={-1}>เลือก</option>
                    {eventRoleList.map((val, key) => {
                      return <option id={val.id}>{val.name}</option>;
                    })}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col sm={6} lg={4} xl={4}>
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
              <Col sm={6} lg={4} xl={4}>
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
                    maxLength={4}
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
              <Col sm={4} lg={4} xl={4}>
                <Form.Group className="mb-3">
                  <Form.Label>ภาคเรียน : </Form.Label>
                  <InputGroup>
                    <Form.Select size="sm" onChange={onChangeHandlerTerm}>
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
                      maxLength={4}
                      onChange={(e) => {
                      const value = e.target.value;
                      if(!isNaN(+value)){ 
                      } else {
                        e.target.value = ""
                      }
                    }}   
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
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="bg-teal-500 text-white active:bg-teal-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={() => addEventCreate()}
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
        show={modalEditEventRole}
        onHide={() => setModalEditEventRole(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            แก้ไขข้อมูลระดับกิจกรรม
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="">
          <Container>
            <Row>
              <Col sm={12} lg={4} xl={4}>
                <Form.Group className="mb-3">
                  <Form.Label>รหัสระดับกิจกรรม : </Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    value={eventRoleData.length > 0 ? eventRoleData[0].id : ""}
                    id="e_er_id"
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col sm={12} lg={8} xl={8}>
                <Form.Group className="mb-3">
                  <Form.Label>ชื่อระดับกิจกรรม : </Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    onChange={(e) => setEventRoleName(e.target.value)}
                    value={eventRoleName || ""}
                    id="e_er_name"
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
            onClick={() => editEventRole()}
          >
            ยืนยัน <AiIcons.AiOutlineSave style={{ display: "inline" }} />
          </button>
          <button
            onClick={() => setModalEditEventRole(false)}
            className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
          >
            ยกเลิก <ImIcons.ImCancelCircle style={{ display: "inline" }} />
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        size="lg"
        show={modalAddEventRole}
        onHide={() => setModalAddEventRole(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            เพิ่มระดับกิจกรรม
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="">
          <Container>
            <Row>
              <Col sm={12} lg={4} xl={4}>
                <Form.Group className="mb-3">
                  <Form.Label>รหัสระดับกิจกรรม : </Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    id="er_id"
                    placeholder="อัตโนมัติ"
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col sm={12} lg={8} xl={8}>
                <Form.Group className="mb-3">
                  <Form.Label>ชื่อระดับกิจกรรม : </Form.Label>
                  <Form.Control type="text" size="sm" id="er_name" maxLength={100}/>
                </Form.Group>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="bg-teal-500 text-white active:bg-teal-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={() => addEventRole()}
          >
            ยืนยัน <AiIcons.AiOutlineSave style={{ display: "inline" }} />
          </button>
          <button
            onClick={() => setModalAddEventRole(false)}
            className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
          >
            ยกเลิก <ImIcons.ImCancelCircle style={{ display: "inline" }} />
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        size="lg"
        show={modalEditeEvent}
        onHide={() => setModalEditeEvent(false)}
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
                  <Form.Select
                    size="sm"  
                    disabled
                  >
                    <option >{optionEventRoleNameData}</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col sm={6} lg={4} xl={4}>
                <Form.Group className="mb-3">
                  <Form.Label>คณะ : </Form.Label>
                  <Form.Select
                    size="sm" 
                    disabled
                  >
                    <option >{optionFacultyNameData}</option> 
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col sm={6} lg={4} xl={4}>
                <Form.Group className="mb-3">
                  <Form.Label>สาขา : </Form.Label>
                  <Form.Select
                    size="sm"
                    disabled
                  >
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
                        setSlfHour(e.target.value)
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
                      maxLength={4}
                      onChange={(e) => {
                        const value = e.target.value;
                        if(!isNaN(+value)){
                          setYear(e.target.value)
                        } else {
                          setYear("")
                        }
                      }}  
                      
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
                  <Form.Select
                    size="sm"
                    disabled
                  >
                    <option>{eventData.length <= 0 ? null : eventData[0].ur_name}</option>
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
            onClick={() => setModalEditeEvent(false)}
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

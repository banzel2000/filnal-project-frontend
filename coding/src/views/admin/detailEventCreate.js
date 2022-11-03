import React, { useState, useEffect, useRef } from "react";

// components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";

import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import DropdownButton from "react-bootstrap/DropdownButton";
import * as TbIcons from "react-icons/tb";
import * as AiIcons from "react-icons/ai";
import * as MdIcons from "react-icons/md";
import * as GrIcons from "react-icons/gr";
import * as BsIcons from "react-icons/bs";
import * as ImIcons from "react-icons/im";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link, useParams } from "react-router-dom";
import Axios from "axios";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import Swal from "sweetalert2";
import QRCode from "qrcode";
import { QrReader } from "react-qr-reader";
import DateTimePicker from "react-datetime-picker";
import Resizer from "react-image-file-resizer";
import { ROOT_SERVER } from "layouts/rootServer.js";

export default function DetailEventCreate() {
  const { event_id } = useParams();
  const user_id_login = parseInt(
    localStorage.getItem("user_id_login").split(",")[0]
  );
  const [modalDetailEvent, setModalDetailEvent] = useState(false);
  const [modalNotice, setModalNotice] = useState(false);
  const [modalRequestUserAttend, setModalRequestUserAttend] = useState(false);
  const [modalCheckName, setModalCheckName] = useState(false);
  const [modalUserData, setModalUserData] = useState(false);
  const [eventData, setEventData] = useState([]);
  const [userParticipationList, setUserParticipationList] = useState([]);
  const [userParticipationRequestList, setUserParticipationRequestList] =
    useState([]);
  const [userData, setUserData] = useState([]);
  const [eventAnnounceList, setEventAnnounceList] = useState([]);
  const [searchUserByName, setSearchUserByName] = useState("");
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [scanResultFile, setScanResultFile] = useState("");
  const [scanResultWebCam, setScanResultWebCam] = useState("");
  const qrRef = useRef(null);
  const [disabledDTEndQrCode, setDisabledDTEndQrCode] = useState(true);
  const [dateTimePickeStartQrCodeValue, setDateTimePickerStartQrCodeOnChange] =
    useState(new Date());
  const [dateTimePickeEndQrCodeValue, setDateTimePickerEndQrCodeOnChange] =
    useState(new Date());
  const [textCreateQrCode, setTextCreateQrCode] = useState(
    "ยังไม่สร้าง Qr Code"
  );
  const [checkNameCreatedList, setCheckNameCreatedList] = useState([]);
  const [qrCodeImageModal, setQrCodeImageModal] = useState(false);
  const [checkNameCreatedQrCode, setCheckNameCreatedQrCode] = useState(null);
  const [eventImage, setEventImage] = useState("");
  const [eventShowImage, setEventShowImage] = useState(null);

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
  const [optionTermData, setOptionTermData] = useState(0);

  const [eventCode, setEventCode] = useState("");
  const [eventCodeStatic, setEventCodeStatic] = useState("");
  const [eventName, setEventName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [slfHour, setSlfHour] = useState("");
  const [location, setLocation] = useState("");
  const [detail, setDetail] = useState("");
  const [year, setYear] = useState("");

  const [timesEdit, setTimesEdit] = useState("");
  const [checkStartTimeRegEdit, setCheckStartTimeRegEdit] = useState(
    new Date()
  );
  const [checkEndTimeRegEdit, setCheckEndTimeRegEdit] = useState(new Date());
  const [disabledCheckEndTimeRegEdit, setDisabledCheckEndTimeRegEdit] =
    useState(false);

  const [modalEditCheckName, setModalEditCheckName] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setDateTimePickerStartQrCodeOnChange(null);
    setDateTimePickerEndQrCodeOnChange(null);
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
        Axios.post(ROOT_SERVER+"/queryEventByEventID", {
          user_participation_id: user_id_login,
          event_id: event_id,
        }).then(async (response) => {
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
              setOptionTermData(response.data.eventData[0].term);
            }
          }
        });

        Axios.post(ROOT_SERVER+"/queryUserDataByID", {
          user_id: user_id_login,
        }).then((response) => {
          if (response.data.status === 1) {
            setUserData(response.data.userData);
          }
        });

        Axios.post(
          ROOT_SERVER+"/queryUserParticipationBystatusAndEventID",
          {
            status: 1,
            event_id: event_id,
          }
        ).then((response) => {
          if (response.data.status === 1) {
            setUserParticipationList(response.data.userParticipationList);
          }
        });
      } else {
        localStorage.removeItem("token");
        window.location = "/auth/login";
      }
    });
  }, []);

  const showModalRequestUserAttend = async () => {
    setModalRequestUserAttend(true);
    try {
      const { data } = await Axios.post(
        ROOT_SERVER+"/queryUserParticipationBystatusAndEventID",
        {
          status: 0,
          event_id: event_id,
        }
      );
      if (data.status === 1) {
        setUserParticipationRequestList(data.userParticipationList);
      }
    } catch (error) {
      this.setState({ error });
    }
  };

  const showModalUserData = async (user_id) => {
    setModalUserData(true);
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
          setEventImage(imageObjectURL);
          setEventShowImage(imageObjectURL);
          console.log(imageObjectURL);
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
              user_image: imageObjectURL,
            },
          ]);
        }
      }
    } catch (error) {
      this.setState({ error });
    }
  };

  const showModalNotice = async () => {
    setModalNotice(true);
    setEventAnnounceList([]);
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

  const addEventAnnounce = async () => {
    let dataEventAnnounce = document.getElementById("data").value;

    Swal.fire({
      title: "คุณต้องการประกาศภายในกิจกรรมหรือไม่?",
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
            ROOT_SERVER+"/addEventAnnounce",
            {
              data: dataEventAnnounce,
              event_id: event_id,
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

  const deleteEventAnnounce = (announce_id) => {
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
            ROOT_SERVER+"/deleteEventAnnounce",
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

  const deleteCheckNameCreated = (times) => {
    Swal.fire({
      title: "คุณต้องลบการสร้างการเช็คชื่อหรือไม่?",
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
            ROOT_SERVER+"/deleteCheckNameCreatedByEventID",
            {
              times: times,
              event_id: event_id,
            }
          );
          console.log(data);
          if (data.status === 1) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "ลบการสร้างการเช็คชื่อสำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "ลบการสร้างการเช็คชื่อไม่สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            window.location.reload(false);
          }
        } catch (error) {}
      }
    });
  };

  const deleteUserParticipation = (user_participation_id, up_role) => {
    Swal.fire({
      title: "ต้องการถอน" + up_role + "หรือไม่?",
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
            ROOT_SERVER+"/deleteUserParticipation",
            {
              user_participation_id: user_participation_id,
              event_id: event_id,
            }
          );
          if (data) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "ถอน" + up_role + "สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "ถอน" + up_role + "ไม่สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            window.location.reload(false);
          }
        } catch (error) {}
      }
    });
  };

  const approveUserParticipation = (user_participation_id) => { 
    Swal.fire({
      title: "อนุญาติให้เข้าร่วมหรือไม่?",
      text: " ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "	#198754",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (parseInt(eventData[0].members_number) >= parseInt(eventData[0].quantity)) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "จำนวนผู้เข้าร่วมเต็มแล้ว",
            showConfirmButton: false,
            timer: 3000,
          });
         return
        }
        try {
          const { data } = await Axios.post(
            ROOT_SERVER+"/approveUserParticipation",
            {
              user_participation_id: user_participation_id,
              event_id: event_id,
            }
          );
          if (data) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "อนุญาติให้เข้าร่วมสำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "อนุญาติให้เข้าร่วมไม่สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            window.location.reload(false);
          }
        } catch (error) {}
      }
    });
  };

  const generateQrCode = async () => {
    try {
      const times = document.getElementById("times").value;
      const textQrCode = event_id + "_" + times;
      if (
        times === "" ||
        dateTimePickeStartQrCodeValue === null ||
        dateTimePickeEndQrCodeValue === null
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
      setTextCreateQrCode("สร้าง QR Code สำเร็จ");
      const response = await QRCode.toDataURL(textQrCode);
      setImageUrl(response);
    } catch (error) {
      console.log(error);
    }
  };

  const showModalCheckName = async () => {
    setImageUrl("");
    setTextCreateQrCode("ยังไม่สร้าง Qr Code");
    setModalCheckName(true);
    setDateTimePickerStartQrCodeOnChange(null);
    setDateTimePickerEndQrCodeOnChange(null);
    setDisabledDTEndQrCode(true);

    const { data } = await Axios.post(
      ROOT_SERVER+"/queryCheckNameCreatedListByEventID",
      {
        event_participation_id: 0,
        event_id: event_id,
      }
    );
    console.log(data);
    if (data.status === 1) {
      setCheckNameCreatedList(data.checkNameCreatedList);
    }
  };

  const onChangeHandlerDTStartQrCode = async (newValueS) => {
    setDateTimePickerStartQrCodeOnChange(newValueS);
    setDisabledDTEndQrCode(false);

    if (newValueS === null) {
      setDisabledDTEndQrCode(true);
      setDateTimePickerEndQrCodeOnChange(null);
    } else if (
      newValueS > dateTimePickeEndQrCodeValue &&
      dateTimePickeEndQrCodeValue != null
    ) {
      setDateTimePickerEndQrCodeOnChange(null);
      setDisabledDTEndQrCode(true);
    }
  };

  const onChangeHandlerDTEndQrCode = async (newValueE) => {
    setDateTimePickerEndQrCodeOnChange(newValueE);
    if (newValueE === null) {
      setDateTimePickerEndQrCodeOnChange(null);
      setDisabledDTEndQrCode(true);
    } else if (
      newValueE < dateTimePickeStartQrCodeValue &&
      dateTimePickeStartQrCodeValue != null
    ) {
      setDateTimePickerEndQrCodeOnChange(null);
      setDisabledDTEndQrCode(true);
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

  const onChangeHandlerCheckNameDTStartEdit = async (newValueSE) => {
    setCheckStartTimeRegEdit(newValueSE);
    setDisabledCheckEndTimeRegEdit(false);

    if (newValueSE === null) {
      setDisabledCheckEndTimeRegEdit(true);
      setCheckEndTimeRegEdit(null);
    } else if (
      newValueSE > checkEndTimeRegEdit &&
      checkEndTimeRegEdit != null
    ) {
      setCheckEndTimeRegEdit(null);
      setDisabledCheckEndTimeRegEdit(true);
    }
  };

  const onChangeHandlerCheckNameDTEndEdit = async (newValueEE) => {
    setCheckEndTimeRegEdit(newValueEE);
    if (newValueEE === null) {
      setCheckEndTimeRegEdit(null);
      setDisabledCheckEndTimeRegEdit(true);
    } else if (
      newValueEE < checkStartTimeRegEdit &&
      checkStartTimeRegEdit != null
    ) {
      setCheckEndTimeRegEdit(null);
      setDisabledCheckEndTimeRegEdit(true);
    }
  };

  const updateEventCreate = async () => {
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

        if (parseInt(quantity) < parseInt(eventData[0].members_number)) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "จำนวนผู้เข้าร่วมที่ตั้งห้ามน้อยกว่าจำนวนผู้เข้าร่วมในปัจจุบัน",
            showConfirmButton: false,
            timer: 3000,
          });
         return
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

          let imageStatus = 0;
          if (eventImage === eventShowImage) {
            imageStatus = 1;
          }

          let eventCodeStatus = 0;
          if (eventCode === eventCodeStatic) {
            eventCodeStatus = 1;
          }

          fd.append("event_code", eventCode);
          fd.append("name", eventName);
          fd.append("slf_hour", slfHour);
          fd.append("quantity", quantity);
          fd.append("term", optionTermData);
          fd.append("year", year);
          fd.append("location", location);
          fd.append("pre_start_time_reg", pre_start_time_reg);
          fd.append("pre_end_time_reg", pre_end_time_reg);
          fd.append("event_start_time_reg", event_start_time_reg);
          fd.append("event_end_time_reg", event_end_time_reg);
          fd.append("create_status", 1);
          fd.append("detail", detail);
          fd.append("image", eventImage);
          fd.append("id", event_id);
          fd.append("imageStatus", imageStatus);
          fd.append("eventCodeStatus", eventCodeStatus);
          fd.append("event_role_id", eventData[0].event_role_id);
          fd.append("branch_id", eventData[0].branch_id);
          fd.append("faculty_id", eventData[0].faculty_id);

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
            setModalDetailEvent(false);
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "แก้ไขข้อมูลกิจกรรมไม่สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setModalDetailEvent(false);
            window.location.reload(false);
          }
        } catch (error) {
          this.setState({ error });
        }
      }
    });
  };

  const addCreateCheckName = async () => {
    const fd = new FormData();
    try {
      const times = document.getElementById("times").value;
      const imageUrlQrCode = imageUrl;

      Swal.fire({
        title: "ต้องการสร้างการเช็คชื่อหรือไม่?",
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
            times === "" ||
            imageUrlQrCode === "" ||
            dateTimePickeStartQrCodeValue === null ||
            dateTimePickeEndQrCodeValue === null
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

          const dtStart =
            dateTimePickeStartQrCodeValue.getFullYear() +
            "-" +
            (dateTimePickeStartQrCodeValue.getMonth() + 1) +
            "-" +
            dateTimePickeStartQrCodeValue.getDate() +
            " " +
            dateTimePickeStartQrCodeValue.getHours() +
            ":" +
            dateTimePickeStartQrCodeValue.getMinutes();
          const dtEnd =
            dateTimePickeEndQrCodeValue.getFullYear() +
            "-" +
            (dateTimePickeEndQrCodeValue.getMonth() + 1) +
            "-" +
            dateTimePickeEndQrCodeValue.getDate() +
            " " +
            dateTimePickeEndQrCodeValue.getHours() +
            ":" +
            dateTimePickeEndQrCodeValue.getMinutes();

          const { data } = await Axios.post(
            ROOT_SERVER+"/addCheckNameCreated",
            {
              times: times,
              image: imageUrlQrCode,
              check_start_time_reg: dtStart,
              check_end_time_reg: dtEnd,
              event_id: event_id,
            }
          );
          console.log(data);
          if (data.status === 1) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "สร้างการเช็คชื่อสำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setModalCheckName(false);
            
          } else if (data.status === -1) {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "ครั้งเช็คชื่อซ้ำ",
              showConfirmButton: false,
              timer: 3000,
            });
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "สร้างการเช็คชื่อไม่สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setModalCheckName(false);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const showQrCodeImageModal = async (times) => {
    try {
      setQrCodeImageModal(true);
      const { data } = await Axios.post(
        ROOT_SERVER+"/queryCheckNameCreatedQrCode",
        {
          times: times,
          event_id: event_id,
        }
      );
      console.log(data);
      if (data.status === 1) {
        console.log(data.checkNameCreatedQrCode);
        setCheckNameCreatedQrCode(data.checkNameCreatedQrCode);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showModalDetailEvent = async () => {
    try {
      setModalDetailEvent(true);
      setDisabledDTPreEnd(false);
      setDisabledDTPreStart(false);
      setDisabledDTEnd(false);
    } catch (error) {
      console.log(error);
    }
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

  const showModalEditCheckName = async (
    times,
    check_start_time_reg,
    check_end_time_reg
  ) => {
    setTimesEdit("");
    setCheckStartTimeRegEdit(null);
    setCheckEndTimeRegEdit(null);
    
    const ch_dtStart =
      new Date(check_start_time_reg).getFullYear() +
      "-" +
      (new Date(check_start_time_reg).getMonth() + 1) +
      "-" +
      new Date(check_start_time_reg).getDate() +
      " " +
      new Date(check_start_time_reg).getHours() +
      ":" +
      new Date(check_start_time_reg).getMinutes();
    const ch_dtEnd =
      new Date(check_end_time_reg).getFullYear() +
      "-" +
      (new Date(check_end_time_reg).getMonth() + 1) +
      "-" +
      new Date(check_end_time_reg).getDate() +
      " " +
      new Date(check_end_time_reg).getHours() +
      ":" +
      new Date(check_end_time_reg).getMinutes(); 
    setTimesEdit(times);
    setCheckStartTimeRegEdit(new Date(ch_dtStart));
    setCheckEndTimeRegEdit(new Date(ch_dtEnd));
    setModalEditCheckName(true);
  };

  const updateCheckNameCreated = () => {

    Swal.fire({
      title: "ต้องการแก้ไขเวลาเช็คชื่อหรือไม่?",
      text: " ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "	#198754",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if(timesEdit === "" || checkStartTimeRegEdit === null || checkEndTimeRegEdit === null){
          Swal.fire({
            position: "center",
            icon: "error",
            title: "ข้อมูลไม่ครบ",
            showConfirmButton: false,
            timer: 3000,
          });
          return
        }
        try {
          const ch_dtStart =
          checkStartTimeRegEdit.getFullYear() +
            "-" +
            (checkStartTimeRegEdit.getMonth() + 1) +
            "-" +
            checkStartTimeRegEdit.getDate() +
            " " +
            checkStartTimeRegEdit.getHours() +
            ":" +
            checkStartTimeRegEdit.getMinutes();
          const ch_dtEnd =
          checkEndTimeRegEdit.getFullYear() +
            "-" +
            (checkEndTimeRegEdit.getMonth() + 1) +
            "-" +
            checkEndTimeRegEdit.getDate() +
            " " +
            checkEndTimeRegEdit.getHours() +
            ":" +
            checkEndTimeRegEdit.getMinutes();

            console.log(ch_dtStart);
            console.log(ch_dtEnd);
          const { data } = await Axios.post(
            ROOT_SERVER+"/updateCheckNameCreatedByEventID",
            {
              times: timesEdit,
              event_id: event_id,
              check_start_time_reg: ch_dtStart,
              check_end_time_reg: ch_dtEnd,
            }
          );
          console.log(data);
          if (data.status === 1) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "แก้ไขเวลาเช็คชื่อสำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "แก้ไขเวลาเช็คชื่อไม่สำเร็จ",
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
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
              <div className="rounded-t bg-white mb-0 px-3 py-3">
                <div className="text-center flex justify-between">
                  <h3 className="text-blueGray-700 text-xl font-bold">
                    ชื่อกิจกรรมที่สร้าง :{" "}
                    {eventData.length <= 0 ? "" : eventData[0].name}
                  </h3>
                  <h3 className="text-blueGray-700 text-xl font-bold text-right">
                    {eventData.length <= 0
                      ? ""
                      : eventData[0].members_number +
                        "/" +
                        eventData[0].quantity}
                  </h3>
                </div>
              </div>
              <div className="flex-auto px-4 lg:px-8 py-2  pt-0">
                <button
                  className="mt-3 bg-indigo-500 text-white active:bg-orange-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => showModalDetailEvent()}
                >
                  รายละเอียด{" "}
                  <MdIcons.MdOutlineAddBox style={{ display: "inline" }} />
                </button>
                <button
                  className="mt-3 bg-pink-500 text-white active:bg-orange-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => showModalNotice()}
                >
                  ประกาศ <TbIcons.TbFileSearch style={{ display: "inline" }} />
                </button>
                <button
                  className="mt-3 bg-orange-500 text-white active:bg-orange-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => showModalRequestUserAttend()}
                >
                  คำขอเข้าร่วม{" "}
                  <AiIcons.AiOutlineFieldTime style={{ display: "inline" }} />
                </button>
                <button
                  className="mt-3 bg-emerald-500 text-white active:bg-orange-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => showModalCheckName()}
                >
                  ข้อมูลการเช็คชื่อ{" "}
                  <TbIcons.TbFileSearch style={{ display: "inline" }} />
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
                          ผู้เข้าร่วมกิจกรรม
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
                              placeholder="ค้นหาชื่อ... "
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
                          ชื่อ/นามสกุล
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          ชื่อเล่น
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
                      {userParticipationList.length <= 0 ? (
                        <td
                          className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
                          colSpan={8}
                        >
                          ไม่มีผู้เข้าร่วม
                        </td>
                      ) : (
                        userParticipationList
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
                                  {key + 1}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.user_code}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.name_prefix +
                                    "" +
                                    val.name +
                                    " " +
                                    val.surname}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.nickname}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.ur_name}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.uf_name}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.ub_name}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1 text-right">
                                  <button
                                    className="bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => showModalUserData(val.id)}
                                  >
                                    <TbIcons.TbFileSearch
                                      style={{ display: "inline" }}
                                    />
                                  </button>
                                  <button
                                    className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() =>
                                      deleteUserParticipation(
                                        val.id,
                                        "ผู้เข้าร่วม"
                                      )
                                    }
                                  >
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
          </div>
        </div>
      </div>
      <Modal
        size="xl"
        show={modalUserData}
        onHide={() => setModalUserData(false)}
        aria-labelledby="example-modal-sizes-title-xl"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-xl">
            รายละเอียดผู้ใช้
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6  rounded-lg mt-16">
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="w-full px-4 flex justify-center">
                  <div className="relative">
                    <img
                      alt="..."
                      src={userData.length > 0 ? userData[0].user_image : ""}
                      className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"
                    />
                  </div>
                </div>
                <div className="w-full px-4 text-center mt-20">
                  <div className="flex justify-center py-4 lg:pt-4 pt-8">
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                        {userData.length > 0 ? userData[0].allEventCreate : ""}
                      </span>
                      <span className="text-sm text-blueGray-400">
                        กิจกรรมที่สร้าง
                      </span>
                    </div>
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                        {userData.length > 0
                          ? userData[0].allEventParticipation
                          : ""}
                      </span>
                      <span className="text-sm text-blueGray-400">
                        กิจกรรมที่เข้าร่วม
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center ">
                <h3 className="text-xl font-semibold leading-normal text-blueGray-700 mb-2">
                  {userData.length > 0
                    ? userData[0].name_prefix +
                      "" +
                      userData[0].name +
                      " " +
                      userData[0].surname +
                      " (" +
                      userData[0].nickname +
                      ")"
                    : ""}
                </h3>
                <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                  {userData.length > 0
                    ? "ระดับผู้ใช้ : " +
                      userData[0].ur_name +
                      ",   รหัสผู้ใช้ : " +
                      userData[0].user_code +
                      ",   ชั้นปี : " +
                      userData[0].student_year
                    : ""}
                </div>

                <div className="mb-2 text-blueGray-600">
                  <i className="fas fa-university mr-2 text-lg text-blueGray-400"></i>
                  {userData.length > 0
                    ? "สาขา : " +
                      userData[0].b_name +
                      ",   คณะ : " +
                      userData[0].f_name
                    : ""}
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      <Modal
        size="lg"
        show={modalDetailEvent}
        onHide={() => setModalDetailEvent(false)}
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
                    <option>
                      {eventData.length <= 0
                        ? null
                        : eventData[0].event_role_name}
                    </option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col sm={6} lg={4} xl={4}>
                <Form.Group className="mb-3">
                  <Form.Label>คณะ : </Form.Label>
                  <Form.Select size="sm" disabled>
                    <option>
                      {eventData.length <= 0 ? null : eventData[0].f_name}
                    </option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col sm={6} lg={4} xl={4}>
                <Form.Group className="mb-3">
                  <Form.Label>สาขา : </Form.Label>
                  <Form.Select size="sm" disabled>
                    <option>
                      {eventData.length <= 0 ? null : eventData[0].b_name}
                    </option>
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
                        } else {
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
                    onChange={(e) => {
                      const value = e.target.value;
                      if(!isNaN(+value)){
                        setQuantity(e.target.value)
                      } else {
                        setQuantity("")
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
                    <Form.Select
                      size="sm"
                      onChange={onChangeHandlerTerm}
                      defaultValue={
                        eventData.length <= 0 ? null : eventData[0].term
                      }
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
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="bg-teal-500 text-white active:bg-teal-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={() => updateEventCreate()}
          >
            ยืนยัน <AiIcons.AiOutlineSave style={{ display: "inline" }} />
          </button>
          <button
            className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
          >
            ยกเลิก <ImIcons.ImCancelCircle style={{ display: "inline" }} />
          </button>
        </Modal.Footer>
      </Modal>

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
          style={{ overflowY: "scroll", height: "520px" }}
        >
          {eventAnnounceList.length <= 0 ? (
            <div className="text-center  p-3">
              <Form.Label>ยังไม่มีการประกาศ</Form.Label>
            </div>
          ) : (
            <>
              <ToastContainer className="p-1 float-end">
                {eventAnnounceList.map((val, key) => {
                  return (
                    <Toast className=" float-end" style={{ width: "700px" }}>
                      <Toast.Header onClick={() => deleteEventAnnounce(val.id)}>
                        <img
                          src={val.user_image}
                          width="7%"
                          className="me-auto"
                          alt=""
                        />
                        <small className="rounded me-2 ">
                          {val.time_announce}
                        </small>
                      </Toast.Header>
                      <Toast.Body>{val.data}</Toast.Body>
                    </Toast>
                  );
                })}
              </ToastContainer>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <InputGroup className="mb-3">
            <Form.Control id="data" placeholder="กรอก..." maxLength={1000}/>
            <Button variant="success" onClick={() => addEventAnnounce()}>
              ประกาศ
            </Button>
          </InputGroup>
        </Modal.Footer>
      </Modal>

      <Modal
        size="xl"
        show={modalRequestUserAttend}
        onHide={() => setModalRequestUserAttend(false)}
        aria-labelledby="example-modal-sizes-title-xl"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-xl">
            คำขอเข้าร่วม
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="">
          <Container>
            <Row>
              <Col sm={6} lg={6} xl={6}>
                <Form.Label htmlFor="inputPassword5">ชื่อกิจกรรม : </Form.Label>
                <Form.Text id="passwordHelpBlock" muted>
                  {eventData.length <= 0 ? "" : " " + eventData[0].name}
                </Form.Text>
              </Col>
              <Col sm={6} lg={6} xl={6}>
                <Form.Label htmlFor="inputPassword5">จำนวน : </Form.Label>
                <Form.Text id="passwordHelpBlock" muted>
                  {" " + userParticipationRequestList.length} คน
                </Form.Text>
              </Col>

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
                            รหัสประจำตัว
                          </th>
                          <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                            ชื่อจริง/นามสกุล
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
                        {userParticipationRequestList.length <= 0 ? (
                          <td
                            className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
                            colSpan={6}
                          >
                            ไม่มีผู้ขอเข้าร่วม
                          </td>
                        ) : (
                          userParticipationRequestList.map((val, key) => {
                            return (
                              <tr>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {key + 1}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.user_code}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.name_prefix +
                                    "" +
                                    val.name +
                                    " " +
                                    val.surname}
                                </td>

                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.ur_name}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.uf_name}
                                </td>

                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.ub_name}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1 text-right">
                                  <button
                                    className="bg-indigo-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => showModalUserData(val.id)}
                                  >
                                    <TbIcons.TbFileSearch
                                      style={{ display: "inline" }}
                                    />
                                  </button>
                                  <button
                                    className="bg-teal-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() =>
                                      approveUserParticipation(val.id)
                                    }
                                  >
                                    <AiIcons.AiOutlineCheckSquare
                                      style={{ display: "inline" }}
                                    />
                                  </button>
                                  <button
                                    className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() =>
                                      deleteUserParticipation(
                                        val.id,
                                        "ผู้ขอเข้าร่วม"
                                      )
                                    }
                                  >
                                    <BsIcons.BsXSquare
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
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          {/* <button
            className="bg-teal-500 text-white active:bg-teal-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
          >
            ยือนุมัติทั้งหมด{" "}
            <AiIcons.AiOutlineCheckSquare style={{ display: "inline" }} />
          </button>
          <button
            className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
          >
            ไม่อนุมัติทั้งหมด{" "}
            <BsIcons.BsXSquare style={{ display: "inline" }} />
          </button> */}
        </Modal.Footer>
      </Modal>

      <Modal
        size="lg"
        show={modalCheckName}
        onHide={() => setModalCheckName(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            ข้อมูลการเช็คชื่อ
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="">
          <Tabs
            defaultActiveKey="home"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="home" title="สร้างการเช็คชื่อ">
              {/* <Form.Group>
                <Form.Label htmlFor="inputPassword5">ชื่อกิจกรรม : </Form.Label>
                <Form.Text id="passwordHelpBlock" muted>
                  uiouoo
                </Form.Text>
              </Form.Group> */}

              {/* <h3>Qr Code Scan by Web Camzzzzzzzzzzzzz</h3>
                         <QrReader
                         delay={300}
                         style={{width: '100%'}}
                         onError={handleErrorWebCam}
                         onScan={handleScanWebCam}
                         />
                         <h3>Scanned By WebCam Code: {scanResultWebCam}</h3> */}

              <Card className="mb-2 mt-2">
                <Card.Header> </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>เช็คชื่อครั้งที่ : </Form.Label>
                    <InputGroup className="mb-3">
                      <Form.Control
                        type="text"
                        id="times"
                        placeholder="ครั้งที่"
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
                  <Form.Group className="mb-3">
                    <Form.Label>ช่วงเวลากิจกรรม : </Form.Label>
                    <InputGroup className="mb-3">
                      <DateTimePicker
                        onChange={onChangeHandlerDTStartQrCode}
                        value={dateTimePickeStartQrCodeValue}
                        format="dd/MM/y HH:mm"
                      />
                      <InputGroup.Text>ถึง</InputGroup.Text>
                      <DateTimePicker
                        disabled={disabledDTEndQrCode}
                        onChange={onChangeHandlerDTEndQrCode}
                        value={dateTimePickeEndQrCodeValue}
                        format="dd/MM/y HH:mm"
                        minDate={dateTimePickeStartQrCodeValue}
                      />
                    </InputGroup>
                  </Form.Group>

                  <InputGroup>
                    <Button
                      variant="success"
                      className=""
                      style={{ zIndex: 0 }}
                      onClick={() => generateQrCode()}
                    >
                      สร้าง QR Code{" "}
                      <MdIcons.MdQrCode2 style={{ display: "inline" }} />
                    </Button>

                    <Form.Control
                      placeholder={textCreateQrCode}
                      aria-describedby="basic-addon2"
                      disabled
                    />
                  </InputGroup>
                </Card.Body>
              </Card>
              {imageUrl ? (
                <div>
                  <a href={imageUrl} download>
                    <img className="object-center" src={imageUrl} alt="img" />
                  </a>
                </div>
              ) : null}
              <div className="text-center ">
                <button
                  className="bg-teal-500 text-white active:bg-teal-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => addCreateCheckName()}
                >
                  ยืนยันการสร้าง{" "}
                  <AiIcons.AiOutlineSave style={{ display: "inline" }} />
                </button>
              </div>
            </Tab>
            <Tab eventKey="profile" title="ผลลัพธ์การสร้าง">
              <Link to={"/admin/userCheckNameList/" + event_id}>
                {" "}
                <button
                  className="mb-3 bg-teal-500 text-white active:bg-teal-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                  type="button"
                >
                  ตรวจสอบรายชื่อผู้ที่เช็คชื่อ{" "}
                  <AiIcons.AiFillCheckSquare style={{ display: "inline" }} />
                </button>
              </Link>

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
                          <Form.Label>ช่วงเวลากิจกรรม : </Form.Label>
                          <InputGroup className="mb-3">
                            <Form.Control
                              defaultValue={val.check_start_time_reg_ch}
                              disabled
                            />
                            <InputGroup.Text>ถึง</InputGroup.Text>
                            <Form.Control
                              defaultValue={val.check_end_time_reg_ch}
                              disabled
                            />
                          </InputGroup>
                        </Form.Group>
                        <div className="float-end">
                          <InputGroup>
                            <Button
                              variant="info"
                              onClick={() => showQrCodeImageModal(val.times)}
                            >
                              QR Code{" "}
                              <AiIcons.AiOutlineEye
                                style={{ display: "inline" }}
                              />
                            </Button>

                            <Button
                              variant="warning"
                              onClick={() =>
                                showModalEditCheckName(
                                  val.times,
                                  val.check_start_time_reg,
                                  val.check_end_time_reg
                                )
                              }
                            >
                              แก้ไข{" "}
                              <AiIcons.AiOutlineEdit
                                style={{ display: "inline" }}
                              />
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => deleteCheckNameCreated(val.times)}
                            >
                              ลบ{" "}
                              <AiIcons.AiOutlineDelete
                                style={{ display: "inline" }}
                              />
                            </Button>
                          </InputGroup>
                        </div>
                      </Card.Body>
                    </Card>
                  );
                })
              )}
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      <Modal
        size="lg"
        show={modalEditCheckName}
        onHide={() => setModalEditCheckName(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            แก้ไขวันเช็คชื่อ
          </Modal.Title>
        </Modal.Header>
        <Modal.Body> 
              <Card className="mb-3">
                <Card.Header>เช็คชื่อครั้งที่ {timesEdit}</Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>ช่วงเวลากิจกรรม : </Form.Label>
                    <InputGroup className="mb-3">
                      <DateTimePicker
                        onChange={onChangeHandlerCheckNameDTStartEdit}
                        value={checkStartTimeRegEdit}
                        format="dd/MM/y HH:mm"
                      />
                      <InputGroup.Text>ถึง</InputGroup.Text>
                      <DateTimePicker
                        disabled={disabledCheckEndTimeRegEdit}
                        onChange={onChangeHandlerCheckNameDTEndEdit}
                        value={checkEndTimeRegEdit}
                        format="dd/MM/y HH:mm"
                        minDate={checkStartTimeRegEdit}
                      />
                    </InputGroup>
                  </Form.Group>
                </Card.Body>
              </Card> 
        </Modal.Body>
        <Modal.Footer>
          <button
            className="bg-teal-500 text-white active:bg-teal-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={() => updateCheckNameCreated()}
          >
            ยืนยัน <AiIcons.AiOutlineSave style={{ display: "inline" }} />
          </button>
          <button
            className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={() => setModalEditCheckName(false)}
          >
            ยกเลิก <ImIcons.ImCancelCircle style={{ display: "inline" }} />
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        size="lg"
        show={qrCodeImageModal}
        onHide={() => setQrCodeImageModal(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">Qr Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {checkNameCreatedQrCode ? (
            <div>
              <a href={checkNameCreatedQrCode[0].qr_code} download>
                <img
                  width={500}
                  className="object-center"
                  src={checkNameCreatedQrCode[0].qr_code}
                  alt="img"
                />
              </a>
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
}

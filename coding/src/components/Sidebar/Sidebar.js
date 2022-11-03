/*eslint-disable*/
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import NotificationDropdown from "components/Dropdowns/NotificationDropdown.js";
import UserDropdown from "components/Dropdowns/UserDropdown.js";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as BsIcons from "react-icons/bs";
import * as TbIcons from "react-icons/tb";
import { ROOT_SERVER } from "layouts/rootServer.js";

export default function Sidebar() {
  const [userDataShow, setUserDataShow] = useState([]);
  const [collapseShow, setCollapseShow] = useState("hidden");
  var user_login_id = parseInt(
    localStorage.getItem("user_id_login").split(",")[0]
  );
  var user_role_id = parseInt(
    localStorage.getItem("user_id_login").split(",")[1]
  );

  useEffect(() => {
    Axios.post(ROOT_SERVER+"/queryUserDataByID", {
      user_id: user_login_id,
    }).then((response) => {
      if (response.data.status === 1) {
        setUserDataShow(response.data.userData);
      }
    });
  }, []);

  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Toggler */}
          <button
            className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>
          {/* Brand */}
          <Link
            style={{ textDecoration: "none" }}
            className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
            to="/admin/dashboard"
          >
            MSU Event
          </Link>
          {/* User */}
          <ul className="md:hidden items-center flex flex-wrap list-none">
            {/* <li className="inline-block relative">
              <NotificationDropdown />
            </li> */}
            <li className="inline-block relative">
              <UserDropdown />
            </li>
          </ul>
          {/* Collapse */}
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >
            {/* Collapse header */}
            <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link
                    style={{ textDecoration: "none" }}
                    className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                    to="/admin/dashboard"
                  >
                    MSU Event
                  </Link>
                </div>
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                    onClick={() => setCollapseShow("hidden")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
            {/* Form */}
            <form className="mt-6 mb-4 md:hidden">
              <div className="mb-3 pt-0">
                <h4 className=" md:min-w-full text-blueGray-500 text-sm uppercase font-bold block no-underline text-center">
                  {userDataShow.length > 0
                    ? userDataShow[0].name_prefix +
                      "" +
                      userDataShow[0].name +
                      " " +
                      userDataShow[0].surname +
                      " (ระดับผู้ใช้ : " +
                      userDataShow[0].ur_name +
                      ")"
                    : ""}
                </h4>
              </div>
            </form>

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            {/* Heading */}
            <h6 className="px-3 md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              เมนูหลัก
            </h6>
            {/* Navigation */}

            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              <li className="items-center">
                <Link
                  style={{ textDecoration: "none" }}
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/dashboard") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                  to="/admin/dashboard"
                >
                  <AiIcons.AiFillHome
                    className={
                      "mr-2 text-sm " +
                      (window.location.href.indexOf("/admin/dashboard") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                    style={{ display: "inline" }}
                  />{" "}
                  หน้าหลัก
                </Link>
              </li>

              {user_role_id === 6 ? (
                <>
                  <li className="items-center">
                    <Link
                      style={{ textDecoration: "none" }}
                      className={
                        "text-xs uppercase py-3 font-bold block " +
                        (window.location.href.indexOf(
                          "/admin/basicDataForAdmin"
                        ) !== -1
                          ? "text-lightBlue-500 hover:text-lightBlue-600"
                          : "text-blueGray-700 hover:text-blueGray-500")
                      }
                      to="/admin/basicDataForAdmin"
                    >
                      <BsIcons.BsFillGrid1X2Fill
                        className={
                          "mr-2 text-sm " +
                          (window.location.href.indexOf(
                            "/admin/basicDataForAdmin"
                          ) !== -1
                            ? "opacity-75"
                            : "text-blueGray-300")
                        }
                        style={{ display: "inline" }}
                      />{" "}
                      ข้อมูลพื้นฐาน
                    </Link>
                  </li>
                  <li className="items-center">
                    <Link
                      style={{ textDecoration: "none" }}
                      className={
                        "text-xs uppercase py-3 font-bold block " +
                        (window.location.href.indexOf(
                          "/admin/userDataForAdmin"
                        ) !== -1
                          ? "text-lightBlue-500 hover:text-lightBlue-600"
                          : "text-blueGray-700 hover:text-blueGray-500")
                      }
                      to="/admin/userDataForAdmin"
                    >
                      <BsIcons.BsPeopleFill
                        className={
                          "mr-2 text-sm " +
                          (window.location.href.indexOf(
                            "/admin/userDataForAdmin"
                          ) !== -1
                            ? "opacity-75"
                            : "text-blueGray-300")
                        }
                        style={{ display: "inline" }}
                      />{" "}
                      ข้อมูลผู้ใช้ทั้งหมด
                    </Link>
                  </li>

                  <li className="items-center">
                    <Link
                      style={{ textDecoration: "none" }}
                      className={
                        "text-xs uppercase py-3 font-bold block " +
                        (window.location.href.indexOf(
                          "/admin/eventDataForAdmin"
                        ) !== -1
                          ? "text-lightBlue-500 hover:text-lightBlue-600"
                          : "text-blueGray-700 hover:text-blueGray-500")
                      }
                      to="/admin/eventDataForAdmin"
                    >
                      <IoIcons.IoIosCreate
                        className={
                          "mr-2 text-sm " +
                          (window.location.href.indexOf(
                            "/admin/eventDataForAdmin"
                          ) !== -1
                            ? "opacity-75"
                            : "text-blueGray-300")
                        }
                        style={{ display: "inline" }}
                      />{" "}
                      ข้อมูลกิจกรรมทั้งหมด
                    </Link>
                  </li>
                </>
              ) : null}
              <>
                {" "}
                <li className="items-center">
                  <Link
                    style={{ textDecoration: "none" }}
                    className={
                      "text-xs uppercase py-3 font-bold block " +
                      (window.location.href.indexOf("/admin/eventCreate") !== -1
                        ? "text-lightBlue-500 hover:text-lightBlue-600"
                        : "text-blueGray-700 hover:text-blueGray-500")
                    }
                    to="/admin/eventCreate"
                  >
                    <IoIcons.IoIosCreate
                      className={
                        "mr-2 text-sm " +
                        (window.location.href.indexOf("/admin/eventCreate") !==
                        -1
                          ? "opacity-75"
                          : "text-blueGray-300")
                      }
                      style={{ display: "inline" }}
                    />{" "}
                    กิจกรรมที่สร้าง
                  </Link>
                </li>
                <li className="items-center">
                  <Link
                    style={{ textDecoration: "none" }}
                    className={
                      "text-xs uppercase py-3 font-bold block " +
                      (window.location.href.indexOf("/admin/eventAttend") !== -1
                        ? "text-lightBlue-500 hover:text-lightBlue-600"
                        : "text-blueGray-700 hover:text-blueGray-500")
                    }
                    to="/admin/eventAttend"
                  >
                    <BsIcons.BsPeopleFill
                      className={
                        "mr-2 text-sm " +
                        (window.location.href.indexOf("/admin/eventAttend") !==
                        -1
                          ? "opacity-75"
                          : "text-blueGray-300")
                      }
                      style={{ display: "inline" }}
                    />{" "}
                    กิจกรรมที่เข้าร่วม
                  </Link>
                </li>
                {user_role_id !== 1 &&
                user_role_id !== 5 &&
                user_role_id !== 6 ? (
                  <li className="items-center">
                    <Link
                      style={{ textDecoration: "none" }}
                      className={
                        "text-xs uppercase py-3 font-bold block " +
                        (window.location.href.indexOf(
                          "/admin/eventCreateFromStudentForOfficer"
                        ) !== -1
                          ? "text-lightBlue-500 hover:text-lightBlue-600"
                          : "text-blueGray-700 hover:text-blueGray-500")
                      }
                      to="/admin/eventCreateFromStudentForOfficer"
                    >
                      <AiIcons.AiOutlineFieldTime
                        className={
                          "mr-2 text-sm " +
                          (window.location.href.indexOf(
                            "/admin/eventCreateFromStudentForOfficer"
                          ) !== -1
                            ? "opacity-75"
                            : "text-blueGray-300")
                        }
                        style={{ display: "inline" }}
                      />{" "}
                      กิจกรรมที่รอการอนุมัติการสร้างจากนิสิต
                    </Link>
                  </li>
                ) : null}
              </>
            </ul>
            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            {/* Heading */}
            <h6 className="px-3 md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              เมนูรอง
            </h6>
            {/* Navigation */}

            <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
              {user_role_id === 6 ? (
                <>
                  <li className="items-center">
                    <Link
                      style={{ textDecoration: "none" }}
                      className={
                        "text-xs uppercase py-3 font-bold block " +
                        (window.location.href.indexOf(
                          "/admin/reportCountEventRole"
                        ) !== -1
                          ? "text-lightBlue-500 hover:text-lightBlue-600"
                          : "text-blueGray-700 hover:text-blueGray-500")
                      }
                      to="/admin/reportCountEventRole"
                    >
                      <TbIcons.TbReportSearch
                        className={
                          "mr-2 text-sm " +
                          (window.location.href.indexOf(
                            "/admin/reportCountEventRole"
                          ) !== -1
                            ? "opacity-75"
                            : "text-blueGray-300")
                        }
                        style={{ display: "inline" }}
                      />{" "}
                      รายงานจำนวนกิจกรรมในแต่ละระดับ
                    </Link>
                  </li>

                  <li className="items-center">
                    <Link
                      style={{ textDecoration: "none" }}
                      className={
                        "text-xs uppercase py-3 font-bold block " +
                        (window.location.href.indexOf(
                          "/admin/reportMostCountEventDate"
                        ) !== -1
                          ? "text-lightBlue-500 hover:text-lightBlue-600"
                          : "text-blueGray-700 hover:text-blueGray-500")
                      }
                      to="/admin/reportMostCountEventDate"
                    >
                      <TbIcons.TbReportSearch
                        className={
                          "mr-2 text-sm " +
                          (window.location.href.indexOf(
                            "/admin/reportMostCountEventDate"
                          ) !== -1
                            ? "opacity-75"
                            : "text-blueGray-300")
                        }
                        style={{ display: "inline" }}
                      />{" "}
                      รายงานจำนวนกิจกรรมที่จัดตั้งยาวนาน/สั้น ที่สุด
                    </Link>
                  </li>

                  <li className="items-center">
                    <Link
                      style={{ textDecoration: "none" }}
                      className={
                        "text-xs uppercase py-3 font-bold block " +
                        (window.location.href.indexOf(
                          "/admin/reportMostMemberNumber"
                        ) !== -1
                          ? "text-lightBlue-500 hover:text-lightBlue-600"
                          : "text-blueGray-700 hover:text-blueGray-500")
                      }
                      to="/admin/reportMostMemberNumber"
                    >
                      <TbIcons.TbReportSearch
                        className={
                          "mr-2 text-sm " +
                          (window.location.href.indexOf(
                            "/admin/reportMostMemberNumber"
                          ) !== -1
                            ? "opacity-75"
                            : "text-blueGray-300")
                        }
                        style={{ display: "inline" }}
                      />{" "}
                      รายงานข้อมูลกิจกรรมที่มีการเข้าร่วมมาก/น้อย ที่สุด
                    </Link>
                  </li>
                </>
              ) : user_role_id !== 1 ? (
                <>
                  <li className="items-center">
                    <Link
                      style={{ textDecoration: "none" }}
                      className={
                        "text-xs uppercase py-3 font-bold block " +
                        (window.location.href.indexOf(
                          "/admin/offerEventForOfficer"
                        ) !== -1
                          ? "text-lightBlue-500 hover:text-lightBlue-600"
                          : "text-blueGray-700 hover:text-blueGray-500")
                      }
                      to="/admin/offerEventForOfficer"
                    >
                      <FaIcons.FaPeopleArrows
                        className={
                          "mr-2 text-sm " +
                          (window.location.href.indexOf(
                            "/admin/offerEventForOfficer"
                          ) !== -1
                            ? "opacity-75"
                            : "text-blueGray-300")
                        }
                        style={{ display: "inline" }}
                      />{" "}
                      กิจกรรมที่นิสิตเสนอ
                    </Link>
                  </li>
                  {user_role_id > 2 && user_role_id < 6 ? (
                    <></>
                  ) : // <li className="items-center">
                  //   <Link
                  //     style={{ textDecoration: "none" }}
                  //     className={
                  //       "text-xs uppercase py-3 font-bold block " +
                  //       (window.location.href.indexOf(
                  //         "/admin/addUserSameRole"
                  //       ) !== -1
                  //         ? "text-lightBlue-500 hover:text-lightBlue-600"
                  //         : "text-blueGray-700 hover:text-blueGray-500")
                  //     }
                  //     to="/admin/addUserSameRole"
                  //   >
                  //     <IoIcons.IoIosPersonAdd
                  //       className={
                  //         "mr-2 text-sm " +
                  //         (window.location.href.indexOf(
                  //           "/admin/addUserSameRole"
                  //         ) !== -1
                  //           ? "opacity-75"
                  //           : "text-blueGray-300")
                  //       }
                  //       style={{ display: "inline" }}
                  //     />{" "}
                  //     เพิ่มข้อมูลผู้ใช้ในระดับเดียวกัน
                  //   </Link>
                  // </li>
                  null}
                </>
              ) : (
                <li className="items-center">
                  <Link
                    style={{ textDecoration: "none" }}
                    className={
                      "text-xs uppercase py-3 font-bold block " +
                      (window.location.href.indexOf("/admin/offerEvent") !== -1
                        ? "text-lightBlue-500 hover:text-lightBlue-600"
                        : "text-blueGray-700 hover:text-blueGray-500")
                    }
                    to="/admin/offerEvent"
                  >
                    <FaIcons.FaPeopleArrows
                      className={
                        "mr-2 text-sm " +
                        (window.location.href.indexOf("/admin/offerEvent") !==
                        -1
                          ? "opacity-75"
                          : "text-blueGray-300")
                      }
                      style={{ display: "inline" }}
                    />{" "}
                    เสนอกิจกรรม
                  </Link>
                </li>
              )}

              <li className="items-center">
                <Link
                  style={{ textDecoration: "none" }}
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/notice") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                  to="/admin/notice"
                >
                  <AiIcons.AiFillNotification
                    className={
                      "mr-2 text-sm " +
                      (window.location.href.indexOf("/admin/notice") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                    style={{ display: "inline" }}
                  />{" "}
                  ประกาศแจ้งเตือน
                </Link>
              </li>

              <li className="items-center">
                <Link
                  style={{ textDecoration: "none" }}
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/checkName") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                  to="/admin/checkName"
                >
                  <AiIcons.AiFillCheckSquare
                    className={
                      "mr-2 text-sm " +
                      (window.location.href.indexOf("/admin/checkName") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                    style={{ display: "inline" }}
                  />{" "}
                  เช็คชื่อ
                </Link>
              </li>

              {user_role_id !== 1 ? (
                <li className="items-center">
                  <Link
                    style={{ textDecoration: "none" }}
                    className={
                      "text-xs uppercase py-3 font-bold block " +
                      (window.location.href.indexOf(
                        "/admin/studentLoanFundForOfficer"
                      ) !== -1
                        ? "text-lightBlue-500 hover:text-lightBlue-600"
                        : "text-blueGray-700 hover:text-blueGray-500")
                    }
                    to="/admin/studentLoanFundForOfficer"
                  >
                    <BsIcons.BsClipboardData
                      className={
                        "mr-2 text-sm " +
                        (window.location.href.indexOf(
                          "/admin/studentLoanFundForOfficer"
                        ) !== -1
                          ? "opacity-75"
                          : "text-blueGray-300")
                      }
                      style={{ display: "inline" }}
                    />{" "}
                    ข้อมูล กยศ. นิสิต
                  </Link>
                </li>
              ) : (
                <li className="items-center">
                  <Link
                    style={{ textDecoration: "none" }}
                    className={
                      "text-xs uppercase py-3 font-bold block " +
                      (window.location.href.indexOf(
                        "/admin/studentLoanFund/" + user_login_id
                      ) !== -1
                        ? "text-lightBlue-500 hover:text-lightBlue-600"
                        : "text-blueGray-700 hover:text-blueGray-500")
                    }
                    to={"/admin/studentLoanFund/" + user_login_id}
                  >
                    <BsIcons.BsClipboardData
                      className={
                        "mr-2 text-sm " +
                        (window.location.href.indexOf(
                          "/admin/studentLoanFund/" + user_login_id
                        ) !== -1
                          ? "opacity-75"
                          : "text-blueGray-300")
                      }
                      style={{ display: "inline" }}
                    />{" "}
                    ข้อมูล กยศ.
                  </Link>
                </li>
              )}

              {/* <li className="inline-flex">
                <a
                  href="https://www.creative-tim.com/learning-lab/tailwind/react/overview/notus"
                  target="_blank"
                  className="text-blueGray-700 hover:text-blueGray-500 text-sm block mb-4 no-underline font-semibold"
                >
                  <i className="fab fa-react mr-2 text-blueGray-300 text-base"></i>
                  React
                </a>
              </li> */}
            </ul>

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            {/* Heading */}
          </div>
        </div>
      </nav>
    </>
  );
}

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
import { ROOT_SERVER } from "layouts/rootServer.js";

export default function ReportMostMemberNumber() {
  const [eventDataShow, setEventDataShow] = useState(false);
  const [eventList, setEventList] = useState([]);
  const [eventImageList, setEventImageList] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [eventImageData, setEventImageData] = useState(null);
  const [searchEventByName, setSearchEventByName] = useState("");
  const [eventRoleList, setEventRoleList] = useState([]);
  const [mostMemberNumber, setMostMemberNumber] = useState([]);
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

  async function queryMostMemberNumber() {
    let response = await Axios.post(ROOT_SERVER+"/queryMostMemberNumber", { 
      event_role_id: 0,
    });
    console.log(response);
    if (response.data.status === 1) { 
      setMostMemberNumber(response.data.mostMemberNumber); 
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    authen(token);
    queryMostMemberNumber();
    queryEventRoleList();
  }, []);

  const onChangeEventByEventRole = async (e) => {
    setMostMemberNumber([]);
    let event_role_id = parseInt(
      e.target.childNodes[e.target.selectedIndex].getAttribute("id")
    );
    try {
      const { data } = await Axios.post(
        ROOT_SERVER+"/queryMostMemberNumber",
        { 
          event_role_id: event_role_id,
        }
      );
      if (data.status === 1) { 
        setMostMemberNumber(data.mostMemberNumber); 
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
                  รายงานข้อมูลกิจกรรมที่มีการเข้าร่วมมาก/น้อย ที่สุด{"("+mostMemberNumber.length+")"}
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
            <div className="w-full ">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white ">
                <div className="rounded-t mb-0 px-4 py-3 border-0"></div>
                <div className="block w-full overflow-x-auto">
                  <table className="items-center w-full bg-transparent border-collapse">
                    <thead>
                      <tr>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          #
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          รหัสกิจกรรม
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          ชื่อกิจกรรม
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          ระดับกิจกรรม
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          คณะ
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                        สาขา
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                        จำนวนผู้เข้าร่วม
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          สถานะกิจกรรม
                        </th> 
                      </tr>
                    </thead>
                    <tbody>
                      {mostMemberNumber.length <= 0 ? (
                        <td
                          className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
                          colSpan={8}
                        >
                          ไม่มีกิจกรรม
                        </td>
                      ) : (
                        mostMemberNumber
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
                                  {val.event_code}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.name} 
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.event_role_name}
                                </td>

                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                 {val.f_name}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.b_name}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                {val.members_number+"/"+val.quantity} 
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.event_time_status}
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
    </>
  );
}

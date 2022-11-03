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
import { ROOT_SERVER } from "layouts/rootServer.js";

export default function BasicDataForAdmin() {
  const [eventCreateWorkingList, setEventCreateWorkingList] = useState([]);
  const [userRoleList, setUserRoleList] = useState([]);
  const [searchFaculty, setSearchFaculty] = useState("");
  const [searchBranch, setSearchBranch] = useState("");
  const [modalEditFaculty, setModalEditFaculty] = useState(false);
  const [modalAddBranch, setModalAddBranch] = useState(false);
  const [modalAddFaculty, setModalAddFaculty] = useState(false);
  const [facultyData, setFacultyData] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const [modalEditBranch, setModalEditBranch] = useState(false);
  const [branchList, setBranchList] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageNumber2, setPageNumber2] = useState(0);
  const [optionFacultyData, setOptionFacultyData] = useState(-1);
  const [selectFacultyEditData, setSelectFacultyEditData] = useState("");
  const [branchName, setBranchName] = useState("");
  const [facultyName, setFacultyName] = useState("");
  const user_id_login = parseInt(
    localStorage.getItem("user_id_login").split(",")[0]
  );
  const user_role_id_login = parseInt(
    localStorage.getItem("user_id_login").split(",")[1]
  );

  const usersPerPage = 10;
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
  }, []);

  const showModalEditFaculty = async (f_id) => {

    setModalEditFaculty(true);
    try {
      const { data } = await Axios.post(ROOT_SERVER+"/queryFaculty", {
        f_id: f_id,
      });
      if (data.status === 1) {
        setFacultyData(data.facultyList);  
        setFacultyName(data.facultyList[0].name)
      }
    } catch (error) {
      this.setState({ error });
    }
  };

  const showModalEditBranch = async (b_id,f_id,f_name) => {
    setSelectFacultyEditData(f_id+" : "+f_name)
    setOptionFacultyData(f_id)
    setModalEditBranch(true); 
    try {
      const { data } = await Axios.post(ROOT_SERVER+"/queryBranch", {
        b_id: b_id,
      });
      if (data.status === 1) {
        setBranchData(data.branchList);
        setBranchName(data.branchList[0].name)
      }
    } catch (error) {
      this.setState({ error });
    }
  };

  const pageCount = Math.ceil(
    facultyList.length / usersPerPage
  );

  const pageCount2 = Math.ceil(
    branchList.length / usersPerPage
  );

  const addFaculty = async () => {
    let f_name = document.getElementById("f_name").value;
    Swal.fire({
      title: "ต้องการเพิ่มคณะหรือไม่?",
      text: " ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "	#198754",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (f_name === "" ) {
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
            ROOT_SERVER+"/addFaculty",
            {
                f_name: f_name, 
            }
          );
          if (data) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "เพิ่มคณะสำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setModalAddFaculty(false);
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "เพิ่มคณะไม่สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setModalAddFaculty(false);
            window.location.reload(false);
          }
        } catch (error) {
          this.setState({ error });
        }
      }
    });
  };

  const addBranch = async () => {
    console.log(optionFacultyData)
    let b_name = document.getElementById("b_name").value; 
    Swal.fire({
      title: "ต้องการเพิ่มสาขาหรือไม่?",
      text: " ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "	#198754",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (b_name === "" || optionFacultyData === -1) {
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
            ROOT_SERVER+"/addBranch",
            {
                b_name: b_name, 
                b_f_id: optionFacultyData,
            }
          );
          if (data) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "เพิ่มสาขาสำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setModalAddBranch(false);
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "เพิ่มสาขาไม่สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setModalAddBranch(false);
            window.location.reload(false);
          }
        } catch (error) {
          this.setState({ error });
        }
      }
    });
  };

  const deleteFaculty = async (f_id) => { 
    Swal.fire({
      title: "ต้องการลบคณะหรือไม่?",
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
            ROOT_SERVER+"/deleteFaculty",
            {
                f_id: f_id,  
            }
          );
          if (data) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "ลบคณะสำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            }); 
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "ลบคณะไม่สำเร็จ",
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

  const deleteBranch = async (b_id) => { 
    Swal.fire({
      title: "ต้องการลบสาขาหรือไม่?",
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
            ROOT_SERVER+"/deleteBranch",
            {
                b_id: b_id,  
            }
          );
          if (data) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "ลบสาขาสำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            }); 
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "ลบสาขาไม่สำเร็จ",
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

  const showModalAddBranch = async () => {
    setModalAddBranch(true)
    setOptionFacultyData(-1)
  };

  const onChangeHandlerFaculty = async (e) => {
    const optionHandlerData =
      e.target.childNodes[e.target.selectedIndex].getAttribute("id"); 
      setOptionFacultyData(optionHandlerData)
  };

  const EditFaculty = async () => { 
    let f_id = document.getElementById("e_f_id").value; 
    let f_name = document.getElementById("e_f_name").value; 
    console.log(f_id+""+f_name)
    Swal.fire({
      title: "ต้องการแก้ไขคณะหรือไม่?",
      text: " ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "	#198754",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (f_id === "" || f_name === "") {
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
            ROOT_SERVER+"/editFaculty",
            {
                f_id: f_id, 
                f_name: f_name,
            }
          ); 
          if (data) {
            
            Swal.fire({
              position: "center",
              icon: "success",
              title: "แก้ไขคณะสำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setModalEditFaculty(false);
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "เแก้ไขคณะไม่สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setModalEditFaculty(false);
            window.location.reload(false);
          }
        } catch (error) {
          this.setState({ error });
        }
      }
    });
  };

    const editBranch = async () => { 
        console.log(optionFacultyData)
    let b_id = document.getElementById("e_b_id").value; 
    let b_name = document.getElementById("e_b_name").value;  
    Swal.fire({
      title: "ต้องการแก้ไขสาขาหรือไม่?",
      text: " ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "	#198754",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (b_id === "" || b_name === "" || parseInt(optionFacultyData) === -1) {
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
            ROOT_SERVER+"/editBranch",
            {
                b_id: b_id, 
                b_name: b_name,
                f_id: parseInt(optionFacultyData), 
            }
          ); 
          if (data) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "แก้ไขสาขาสำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setModalEditBranch(false);
            window.location.reload(false);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "แก้ไขสาขาไม่สำเร็จ",
              showConfirmButton: false,
              timer: 3000,
            });
            setModalEditBranch(false);
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
                  onClick={() => setModalAddFaculty(true)}
                >
                  เพิ่มคณะ{" "}
                  <MdIcons.MdOutlineAddBox style={{ display: "inline" }} />
                </button>
                <button
                  className="mt-3 bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => showModalAddBranch()}
                >
                  เพิ่มสาขา{" "}
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
                          คณะ{"(" + facultyList.length + ")"}
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
                              placeholder="ค้นหาชื่อคณะ... "
                              className="border-0 px-4 py-1 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
                              onChange={(e) => {
                                setSearchFaculty(e.target.value);
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
                          รหัสคณะ
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          ชื่อคณะ
                        </th>

                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {facultyList.length <= 0 ? (
                        <td
                          className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
                          colSpan={4}
                        >
                          ไม่มีข้อมูล
                        </td>
                      ) : (
                        facultyList
                        .slice(pagesVisited, pagesVisited + usersPerPage)
                          .filter((val) => {
                            if (searchFaculty === "") {
                              return val;
                            } else if (
                              val.name
                                .toLowerCase()
                                .includes(searchFaculty.toLowerCase())
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
                                    onClick={() => showModalEditFaculty(val.id)}
                                  >
                                    <AiIcons.AiOutlineEdit />
                                  </button>
                                  <button
                                    className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => deleteFaculty(val.id)}
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
                  {facultyList.length <= 0 ? null :<div className="d-flex justify-content-center py-3">
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
                          สาขา{"(" + branchList.length + ")"}
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
                              placeholder="ค้นหาชื่อสาขา... "
                              className="border-0 px-4 py-1 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
                              onChange={(e) => {
                                setSearchBranch(e.target.value);
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
                          รหัสสาขา
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          ชื่อสาขา
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          รหัสคณะ
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          ชื่อคณะ
                        </th>

                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {branchList.length <= 0 ? (
                        <td
                          className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
                          colSpan={5}
                        >
                          ไม่มีข้อมูล
                        </td>
                      ) : (
                        branchList
                        .slice(pagesVisited2, pagesVisited2 + usersPerPage)
                          .filter((val) => {
                            if (searchBranch === "") {
                              return val;
                            } else if (
                              val.name
                                .toLowerCase()
                                .includes(searchBranch.toLowerCase())
                            ) {
                              return val;
                            }
                          })
                          .map((val, key) => {
                            return (
                              <tr>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {pagesVisited2 +key + 1}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.id}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.name}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.faculty_id}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                  {val.f_name}
                                </td>

                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1 text-right">
                                    <button
                                    className=" bg-orange-500 text-white active:bg-orange-600  font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => showModalEditBranch(val.id,val.faculty_id,val.f_name)}
                                  >
                                    <AiIcons.AiOutlineEdit />
                                  </button>
                                  <button
                                    className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => deleteBranch(val.id)}
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
                  {branchList.length <= 0 ? null : <div className="d-flex justify-content-center py-3">
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
        show={modalEditFaculty}
        onHide={() => setModalEditFaculty(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            แก้ไขข้อมูลคณะ
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="">
          <Container>
            <Row>
              <Col sm={12} lg={4} xl={4}>
                <Form.Group className="mb-3">
                  <Form.Label>รหัสคณะ : </Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    value={facultyData.length > 0 ? facultyData[0].id : ""}
                    id="e_f_id"
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col sm={12} lg={8} xl={8}>
                <Form.Group className="mb-3">
                  <Form.Label>ชื่อคณะ : </Form.Label>
                  <Form.Control
                    type="text"
                    size="sm"
                    onChange={e => setFacultyName(e.target.value)}
                    value={facultyName || ""} 
                    id="e_f_name"
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
            onClick={() => EditFaculty()}
          >
            ยืนยัน <AiIcons.AiOutlineSave style={{ display: "inline" }} />
          </button>
          <button
            onClick={() => setModalEditFaculty(false)}
            className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
          >
            ยกเลิก <ImIcons.ImCancelCircle style={{ display: "inline" }} />
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        size="lg"
        show={modalAddBranch}
        onHide={() => setModalAddBranch(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">เพิ่มสาขา</Modal.Title>
        </Modal.Header>
        <Modal.Body className="">
          <Container>
            <Row>
              <Col sm={12} lg={4} xl={4}>
                <Form.Group className="mb-3">
                  <Form.Label>รหัสสาขา : </Form.Label>
                  <Form.Control
                    type="text"
                    size="sm" 
                    id="b_id"
                    placeholder="อัตโนมัติ"
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col sm={12} lg={8} xl={8}>
                <Form.Group className="mb-3">
                  <Form.Label>ชื่อสาขา : </Form.Label>
                  <Form.Control
                    type="text"
                    size="sm" 
                    id="b_name"
                    maxLength={100}
                  />
                </Form.Group>
              </Col>
              <Col sm={12} lg={12} xl={12}>
                <Form.Group className="mb-3">
                  <Form.Label>รหัสคณะ : </Form.Label> 
                <Form.Select size="sm" onChange={onChangeHandlerFaculty} >
                <option id={-1}>เลือก</option>
                  {facultyList.map((val, key) => {
                    return (
                      <option id={val.id}>
                        {val.id+" : "+val.name}  
                      </option>
                    );
                  })}
                </Form.Select> 
                </Form.Group>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="bg-teal-500 text-white active:bg-teal-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
             onClick={() => addBranch()}
          >
            ยืนยัน <AiIcons.AiOutlineSave style={{ display: "inline" }} />
          </button>
          <button
            onClick={() => setModalAddBranch(false)}
            className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
          >
            ยกเลิก <ImIcons.ImCancelCircle style={{ display: "inline" }} />
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        size="lg"
        show={modalAddFaculty}
        onHide={() => setModalAddFaculty(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">เพิ่มคณะ</Modal.Title>
        </Modal.Header>
        <Modal.Body className="">
          <Container>
            <Row>
              <Col sm={12} lg={4} xl={4}>
                <Form.Group className="mb-3">
                  <Form.Label>รหัสคณะ : </Form.Label>
                  <Form.Control
                    type="text"
                    size="sm" 
                    id="f_id"
                    placeholder="อัตโนมัติ"
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col sm={12} lg={8} xl={8}>
                <Form.Group className="mb-3">
                  <Form.Label>ชื่อคณะ : </Form.Label>
                  <Form.Control
                    type="text"
                    size="sm" 
                    id="f_name"
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
            onClick={() => addFaculty()}
          >
            ยืนยัน <AiIcons.AiOutlineSave style={{ display: "inline" }} />
          </button>
          <button
            onClick={() => setModalAddFaculty(false)}
            className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
          >
            ยกเลิก <ImIcons.ImCancelCircle style={{ display: "inline" }} />
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        size="lg"
        show={modalEditBranch}
        onHide={() => setModalEditBranch(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            แก้ไขข้อมูลสาขา
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="">
          <Container>
            <Row>
              <Col sm={12} lg={4} xl={4}>
                <Form.Group className="mb-3">
                  <Form.Label>รหัสสาขา : </Form.Label>
                  <Form.Control type="text" size="sm" id="e_b_id"  defaultValue={branchData.length > 0 ? branchData[0].id : ""} disabled/>
                </Form.Group>
              </Col>
              <Col sm={12} lg={8} xl={8}>
                <Form.Group className="mb-3">
                  <Form.Label>ชื่อระดับสาขา : </Form.Label>
                  <Form.Control type="text" size="sm" id="e_b_name" onChange={e => setBranchName(e.target.value)}
                    value={branchName || ""} maxLength={100} />
                </Form.Group>
              </Col>
              <Col sm={12} lg={12} xl={12}>
                <Form.Group className="mb-3">
                  <Form.Label>รหัสคณะ : </Form.Label> 
                <Form.Select size="sm" onChange={onChangeHandlerFaculty} defaultValue={selectFacultyEditData}>
                <option id={-1}>เลือก</option>
                  {facultyList.map((val, key) => {
                    return (
                      <option id={val.id}>
                        {val.id+" : "+val.name}  
                      </option>
                    );
                  })}
                </Form.Select> 
                </Form.Group>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="bg-teal-500 text-white active:bg-teal-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={() => editBranch()}
          >
            ยืนยัน <AiIcons.AiOutlineSave style={{ display: "inline" }} />
          </button>
          <button
            onClick={() => setModalEditBranch(false)}
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

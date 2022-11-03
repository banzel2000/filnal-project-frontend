import React, { useState,useEffect } from "react";
import { createPopper } from "@popperjs/core";
import { Link } from "react-router-dom";
import Axios from "axios";
import { ROOT_SERVER } from "layouts/rootServer.js";

const UserDropdown = () => {
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  let user_id_login = parseInt(
    localStorage.getItem("user_id_login").split(",")[0]
  );
  const [userImage, setUserImage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

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
      }
    });
  }, []);

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id_login");
    localStorage.removeItem("user_role_id_login");
    window.location = "/auth/Login";
  };

  return (
    <>
      <a
        className="text-blueGray-500 block"
        href="#pablo"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <div className="items-center flex">
          <span className="w-12 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full">
            <img
              alt="..."
              src={userImage}
              className="w-full rounded-full align-middle border-none shadow-lg"
            />
          </span>
        </div>
      </a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
        }
      >
        <Link
          style={{ textDecoration: "none" }}
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
          }
          to="/admin/profile"
        >
          ข้อมูลส่วนตัว
        </Link>

        <div className="h-0 my-2 border border-solid border-blueGray-100" /> 
        <div className="h-0 my-2 border border-solid border-white" />
        <a
          style={{ textDecoration: "none" }} 
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
          }
          onClick={logOut}
        >
          ออกจากระบบ
        </a>
      </div>
    </>
  );
};

export default UserDropdown;

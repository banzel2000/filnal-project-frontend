import React, { useEffect, useState } from "react";
import Axios from "axios";
import UserDropdown from "components/Dropdowns/UserDropdown.js";
import { ROOT_SERVER } from "layouts/rootServer.js";

export default function Navbar() {
  const [userDataShow, setUserDataShow] = useState([]);

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
      user_id: localStorage.getItem("user_id_login").split(",")[0],
    }).then((response) => {
      if (response.data.status === 1) {
        setUserDataShow(response.data.userData);
      }
    });
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
        <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
          {/* Brand */}
          <a
            style={{ textDecoration: "none" }}
            className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
            href="#pablo"
            onClick={(e) => e.preventDefault()}
          >
            {userDataShow.length > 0
              ? userDataShow[0].name_prefix +
                "" +
                userDataShow[0].name +
                " " +
                userDataShow[0].surname +
                " (ระดับผู้ใช้ : " +
                userDataShow[0].ur_name+")"
              : ""}
          </a>
          {/* Form */}

          {/* User */}
          <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
            <UserDropdown />
          </ul>
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
}

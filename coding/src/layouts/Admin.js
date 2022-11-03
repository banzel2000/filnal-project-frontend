import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components

import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

// views

import Dashboard from "views/admin/Dashboard.js"; 
import EventCreate from "views/admin/eventCreate";
import EventAttend from "views/admin/eventAttend";
import OfferEvent from "views/admin/offerEvent";
import Notice from "views/admin/notice";
import CheckName from "views/admin/checkName";
import StudentLoanFund from "views/admin/studentLoanFund";
import Profile from "views/admin/profile";

import DetailEventCreate from "views/admin/detailEventCreate";
import SetStatusUserAttend from "views/admin/setStatusUserAttend";
import DetailEventAttend from "views/admin/detailEventAttend";
import DetailSetStatusUserAttend from "views/admin/detailSetStatusUserAttend";
import OfferEventForOfficer from "views/admin/offerEventForOfficer";
import StudentLoanFundForOfficer from "views/admin/studentLoanFundForOfficer";
import EventCreateFromStudentForOfficer from "views/admin/eventCreateFromStudentForOfficer"; 

import UserDataForAdmin from "views/admin/userDataForAdmin";
import EventDataForAdmin from "views/admin/eventDataForAdmin";
import BasicDataForAdmin from "views/admin/basicDataForAdmin";
import UserCheckNameList from "views/admin/userCheckNameList";
import ReportCountEventRole from "views/admin/reportCountEventRole";
import ReportMostCountEventDate from "views/admin/reportMostCountEventDate";
import ReportMostMemberNumber from "views/admin/reportMostMemberNumber";
 
export default function Admin() {
  return (
    <> 
          <Switch>
            <Route path="/admin/dashboard" exact component={Dashboard} /> 
            <Route path="/admin/eventCreate" exact component={EventCreate} />
            <Route path="/admin/eventAttend" exact component={EventAttend} />
            <Route path="/admin/offerEvent" exact component={OfferEvent} />
            <Route path="/admin/notice" exact component={Notice} />
            <Route path="/admin/checkName" exact component={CheckName} />
            <Route path="/admin/studentLoanFund/:user_id" exact component={StudentLoanFund} />
            <Route path="/admin/profile" exact component={Profile} />
            <Route path="/admin/detailEventAttend/:event_id" exact component={DetailEventAttend} />
            <Route path="/admin/detailEventCreate/:event_id" exact component={DetailEventCreate} />
            <Route path="/admin/setStatusUserAttend" exact component={SetStatusUserAttend} /> 
            <Route path="/admin/detailSetStatusUserAttend/:event_id" exact component={DetailSetStatusUserAttend} />

            <Route path="/admin/offerEventForOfficer" exact component={OfferEventForOfficer} />
            <Route path="/admin/studentLoanFundForOfficer" exact component={StudentLoanFundForOfficer} />
            <Route path="/admin/eventCreateFromStudentForOfficer" exact component={EventCreateFromStudentForOfficer} /> 
            <Route path="/admin/userCheckNameList/:event_id" exact component={UserCheckNameList} />

            <Route path="/admin/userDataForAdmin" exact component={UserDataForAdmin} />
            <Route path="/admin/eventDataForAdmin" exact component={EventDataForAdmin} />
            <Route path="/admin/basicDataForAdmin" exact component={BasicDataForAdmin} />
            <Route path="/admin/reportCountEventRole" exact component={ReportCountEventRole} />
            <Route path="/admin/reportMostCountEventDate" exact component={ReportMostCountEventDate} />
            <Route path="/admin/reportMostMemberNumber" exact component={ReportMostMemberNumber} />
            <Redirect from="/admin" to="/admin/dashboard" />
          </Switch> 
    </>
  );
}

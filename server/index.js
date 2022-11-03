var express = require("express");
var cors = require("cors");
var app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;
var jwt = require("jsonwebtoken");
const secret = "eventproject";
const mysql = require("mysql2");
const { uploadFile } = require("./upload");
const { escape } = require("mysql2");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "eventproject",

  // host: "202.28.34.205",
  // user: "62011211041",
  // password: "62011211041",
  // database: "62011211041",
  // port: "3306"

});

app.post("/login", (req, res, next) => {
  db.query(
    "SELECT * FROM `user` WHERE email = "+ escape(req.body.email),
    function (err, results, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (results.length === 0) {
        res.send({ status: "error2", message: "no user" });
        return;
      }
      bcrypt.compare(
        req.body.password,
        results[0].password,
        function (err, result) {
          if (result) {
            var token = jwt.sign({ id: results[0].id }, secret, {
              expiresIn: "1h",
            });
            res.send({
              status: "ok",
              message: "success",
              token,
              user_id_login: results[0].id + "," + results[0].user_role_id,
            });
          } else {
            res.send({ status: "not ok", message: "failed" });
          }
        }
      );
    }
  );
});

app.post("/authen", (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, secret);
    res.send({ status: "ok", decoded });
  } catch (err) {
    res.send({ status: "err", message: err.message });
  }
});

app.post("/addUser", uploadFile, (req, res, next) => {
  const {
    ur_id,
    f_id,
    b_id,
    user_code,
    name_prefix,
    name,
    surname,
    nickname,
    student_year,
    image,
    email,
    password,
  } = req.body; 
  db.query(
    "SELECT * FROM `user` WHERE email = "+escape(email),
    function (err, result, fields) { 
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (result.length !== 0) {
        res.send({ status: -1, message: "have user" });
        return;
      }

      db.query(
        "SELECT * FROM `user` WHERE user_code = " +escape(user_code),
        function (err, userCodeCheck, fields) {
          if (userCodeCheck.length !== 0) {
            res.send({ status: 0, message: "have user code" });
            return;
          }
          bcrypt.hash(password, saltRounds, function (err, hash) {
            db.query(
              "INSERT INTO `user`(user_code,name_prefix,`name`,surname,nickname,student_year,email,image,`password`,user_role_id,branch_id,faculty_id) \n " +
              "VALUES("+escape(user_code)+","+escape(name_prefix)+","+escape(name)+","+escape(surname)+","+escape(nickname)+","+escape(student_year)+","+escape(email)+","+escape(req.file.filename)+","+escape(hash)+","+escape(ur_id)+","+escape(b_id)+","+escape(f_id)+")",
             
              function (err, results, fields) {
                if (results) { 
                  res.send({ status: 1 });
                }
              }
            );
          });
        }
      );
    }
  );
});

app.post("/queryEventList", (req, res, next) => {
  let sqlEventRole = "";
  let event_role_id = req.body.event_role_id;
  if (event_role_id !== 0) {
    sqlEventRole += "AND er.id = " + escape(event_role_id);
  }
 
  db.query(
    "	 SELECT e.*,er.`name` event_role_name,f.`name` f_name,b.`name` b_name, \n" +
      "		CONCAT(CONVERT(TIME(e.pre_start_time_reg),VARCHAR(5)), ' น. ',DAY(e.pre_start_time_reg),'/',MONTH(e.pre_start_time_reg),'/',YEAR(e.pre_start_time_reg)+543 ) p_time_start,\n" +
      "		CONCAT(CONVERT(TIME(e.pre_end_time_reg),VARCHAR(5)), ' น. ',DAY(e.pre_end_time_reg),'/',MONTH(e.pre_end_time_reg),'/',YEAR(e.pre_end_time_reg)+543) p_time_end,\n" +
      "	  CONCAT(CONVERT(TIME(e.event_start_time_reg),VARCHAR(5)), ' น. ',DAY(e.event_start_time_reg),'/',MONTH(e.event_start_time_reg),'/',YEAR(e.event_start_time_reg)+543) time_start,\n" +
      "	  CONCAT(CONVERT(TIME(e.event_end_time_reg),VARCHAR(5)), ' น. ',DAY(e.event_end_time_reg),'/',MONTH(e.event_end_time_reg),'/',YEAR(e.event_end_time_reg)+543) time_end, (\n" +
      "	 \n" +
      "      	SELECT DECODE_ORACLE(COUNT(event_id) , null, 0,COUNT(event_id)) result\n" +
      "      	FROM event_participation \n" +
      "      		WHERE request_status = 1 AND event_id = e.id) members_number,\n" +
      "					   (CASE  WHEN CURRENT_TIMESTAMP BETWEEN e.pre_start_time_reg AND e.pre_end_time_reg THEN 'เปิดให้ขอเข้าร่วม'\n" +
      "						 WHEN CURRENT_TIMESTAMP > e.pre_end_time_reg THEN 'ปิดรับการขอเข้าร่วม' \n" +
      "							ELSE 'ยังไม่เปิดให้ขอเข้าร่วม' END) event_pre_time_status,\n" +
      "					   (CASE  WHEN CURRENT_TIMESTAMP BETWEEN e.event_start_time_reg AND e.event_end_time_reg THEN 'กิจกรรมกำลังดำเนินการ'\n" +
      "						 WHEN CURRENT_TIMESTAMP > e.event_end_time_reg THEN 'กิจกรรมจบลงแล้ว' \n" +
      "							ELSE 'กิจกรรมยังไม่เริ่ม' END) event_time_status,DECODE_ORACLE((\n" +
      "      			SELECT ep.request_status \n" +
      "      			FROM event_participation ep\n" +
      "      				WHERE ep.user_participation_id = " +
      escape(req.body.user_id) +
      "\n" +
      "       AND event_id = e.id) , null, -1, 0, 0,(\n" +
      "      					SELECT ep.request_status 	 \n" +
      "      					FROM event_participation ep\n" +
      "      						WHERE ep.user_participation_id = " +
      escape(req.body.user_id) +
      "\n" +
      "       AND event_id = e.id)\n" +
      "      						) request_status,DECODE_ORACLE(" +
      escape(req.body.user_id) +
      " , e.user_create_id, 1, 0) event_create_status\n" +
      "					\n" +
      "      FROM `event` e\n" +
      "            INNER JOIN event_role er ON e.event_role_id = er.id\n" +
      "      			INNER JOIN faculty f ON e.faculty_id = f.id\n" +
      "      	 	  INNER JOIN branch b ON e.branch_id = b.id\n" +
      "            WHERE e.create_status = 1 " +
      sqlEventRole +
      " \n" +
      "      			ORDER BY e.event_end_time_reg DESC",
    function (err, eventList, fields) {
      
      res.send({ status: 1, message: "success", eventList });
    }
  );
});

app.post("/queryEventCreateByUserCreateID", (req, res, next) => {
  let event_status = req.body.event_status;
  let sqlCheckEventStatus = "";
  if (event_status === "working") {
    sqlCheckEventStatus += "AND CURRENT_TIMESTAMP <= e.event_end_time_reg";
  } else if (event_status === "ended") {
    sqlCheckEventStatus += "AND CURRENT_TIMESTAMP > e.event_end_time_reg";
  }
  db.query(
    "SELECT e.*,er.`name` event_role_name,(\n" +
      "	 \n" +
      "      	SELECT DECODE_ORACLE(COUNT(event_id) , null, 0,COUNT(event_id)) result\n" +
      "      	FROM event_participation \n" +
      "      		WHERE request_status = 1 AND event_id = e.id) members_number,\n" +
      "					   (CASE  WHEN CURRENT_TIMESTAMP BETWEEN e.pre_start_time_reg AND e.pre_end_time_reg THEN 'เปิดให้ขอเข้าร่วม'\n" +
      "						 WHEN CURRENT_TIMESTAMP > e.pre_end_time_reg THEN 'ปิดรับการขอเข้าร่วม' \n" +
      "							ELSE 'ยังไม่เปิดให้ขอเข้าร่วม' END) event_pre_time_status,\n" +
      "					   (CASE  WHEN CURRENT_TIMESTAMP BETWEEN e.event_start_time_reg AND e.event_end_time_reg THEN 'กิจกรรมกำลังดำเนินการ'\n" +
      "						 WHEN CURRENT_TIMESTAMP > e.event_end_time_reg THEN 'กิจกรรมจบลงแล้ว' \n" +
      "							ELSE 'กิจกรรมยังไม่เริ่ม' END) event_time_status \n" +
      "FROM `event` e\n" +
      "  INNER JOIN event_role er ON e.event_role_id = er.id\n" +
      "  WHERE e.create_status = 1 " +
      sqlCheckEventStatus +
      " AND e.user_create_id = " +
      escape(req.body.user_create_id),
    function (err, eventCreateList, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (eventCreateList.length === 0) {
        res.send({ status: 0, message: "no event" });
        return;
      } else {
        res.send({ status: 1, message: "success", eventCreateList });
      }
    }
  );
});

app.post("/queryEventParticipationByUserParticipationID", (req, res, next) => {
  let event_status = req.body.event_status;
  let sqlCheckEventStatus = "";
  if (event_status === "working") {
    sqlCheckEventStatus += "AND CURRENT_TIMESTAMP <= e.event_end_time_reg";
  } else if (event_status === "ended") {
    sqlCheckEventStatus += "AND CURRENT_TIMESTAMP > e.event_end_time_reg";
  }
  db.query(
    "SELECT e.*,er.`name` event_role_name, u.name_prefix, u.`name` u_name, u.surname u_surname, ep.pass_status, ( \n" +
      "						SELECT DECODE_ORACLE(COUNT(event_id) , null, 0,COUNT(event_id)) result\n" +
      "              	FROM event_participation \n" +
      "              		WHERE request_status = 1 AND event_id = e.id) members_number,\n" +
      "        					   (CASE  WHEN CURRENT_TIMESTAMP BETWEEN e.pre_start_time_reg AND e.pre_end_time_reg THEN 'เปิดให้ขอเข้าร่วม'\n" +
      "        						 WHEN CURRENT_TIMESTAMP > e.pre_end_time_reg THEN 'ปิดรับการขอเข้าร่วม' \n" +
      "        							ELSE 'ยังไม่เปิดให้ขอเข้าร่วม' END) event_pre_time_status,\n" +
      "        					   (CASE  WHEN CURRENT_TIMESTAMP BETWEEN e.event_start_time_reg AND e.event_end_time_reg THEN 'กิจกรรมกำลังดำเนินการ'\n" +
      "        						 WHEN CURRENT_TIMESTAMP > e.event_end_time_reg THEN 'กิจกรรมจบลงแล้ว' \n" +
      "        							ELSE 'กิจกรรมยังไม่เริ่ม' END) event_time_status \n" +
      "        FROM  event_participation ep\n" +
      "					INNER JOIN `event` e ON ep.event_id = e.id\n" +
      "          INNER JOIN event_role er ON e.event_role_id = er.id\n" +
      "INNER JOIN `user` u ON e.user_create_id = u.id\n" +
      "  WHERE e.create_status = 1 AND ep.request_status = 1 " +
      sqlCheckEventStatus +
      " AND ep.user_participation_id = " +
      escape(req.body.user_participation_id),
    function (err, eventParticipationList, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (eventParticipationList.length === 0) {
        res.send({ status: 0, message: "no event" });
        return;
      } else {
        res.send({ status: 1, message: "success", eventParticipationList });
      }
    }
  );
});

app.post("/queryEventByEventID", (req, res, next) => {
  db.query(
    "SELECT e.*,er.`name` event_role_name,f.`name` f_name,b.`name` b_name,u.name_prefix,u.`name` u_name,u.surname,ur.`name` ur_name, \n" +
      "		CONCAT(CONVERT(TIME(e.pre_start_time_reg),VARCHAR(5)), ' น. ',DAY(e.pre_start_time_reg),'/',MONTH(e.pre_start_time_reg),'/',YEAR(e.pre_start_time_reg)+543 ) p_time_start,\n" +
      "		CONCAT(CONVERT(TIME(e.pre_end_time_reg),VARCHAR(5)), ' น. ',DAY(e.pre_end_time_reg),'/',MONTH(e.pre_end_time_reg),'/',YEAR(e.pre_end_time_reg)+543) p_time_end,\n" +
      "	  CONCAT(CONVERT(TIME(e.event_start_time_reg),VARCHAR(5)), ' น. ',DAY(e.event_start_time_reg),'/',MONTH(e.event_start_time_reg),'/',YEAR(e.event_start_time_reg)+543) time_start,\n" +
      "	  CONCAT(CONVERT(TIME(e.event_end_time_reg),VARCHAR(5)), ' น. ',DAY(e.event_end_time_reg),'/',MONTH(e.event_end_time_reg),'/',YEAR(e.event_end_time_reg)+543) time_end, \n" +
      "		CONCAT(YEAR(e.pre_start_time_reg),'/',MONTH(e.pre_start_time_reg),'/',DAY(e.pre_start_time_reg),' ',CONVERT(TIME(e.pre_start_time_reg),VARCHAR(5))) p_time_start_eng,\n" +
      "		CONCAT(YEAR(e.pre_end_time_reg),'/',MONTH(e.pre_end_time_reg),'/',DAY(e.pre_end_time_reg),' ',CONVERT(TIME(e.pre_end_time_reg),VARCHAR(5))) p_time_end_eng,\n" +
      "	  CONCAT(YEAR(e.event_start_time_reg),'/',MONTH(e.event_start_time_reg),'/',DAY(e.event_start_time_reg),' ',CONVERT(TIME(e.event_start_time_reg),VARCHAR(5))) time_start_eng,\n" +
      "	  CONCAT(YEAR(e.event_end_time_reg),'/',MONTH(e.event_end_time_reg),'/',DAY(e.event_end_time_reg),' ',CONVERT(TIME(e.event_end_time_reg),VARCHAR(5))) time_end_eng, (\n" +
      "	 \n" +
      "	SELECT DECODE_ORACLE(COUNT(event_id) , null, 0,COUNT(event_id)) result	\n" +
      "	FROM event_participation \n" +
      "		WHERE request_status = 1 AND event_id = e.id) members_number,DECODE_ORACLE((\n" +
      "		\n" +
      "			SELECT ep.request_status 	 \n" +
      "			FROM event_participation ep\n" +
      "				WHERE ep.user_participation_id = " +
      escape(req.body.user_participation_id) +
      " AND event_id = e.id) , null, -1, 0, 0,(\n" +
      "				\n" +
      "					SELECT ep.request_status 	 \n" +
      "					FROM event_participation ep\n" +
      "						WHERE ep.user_participation_id = " +
      escape(req.body.user_participation_id) +
      " AND event_id = e.id)\n" +
      "						) request_status,\n" +
      "					   (CASE  WHEN CURRENT_TIMESTAMP BETWEEN e.pre_start_time_reg AND e.pre_end_time_reg THEN 'เปิดให้ขอเข้าร่วม'\n" +
      "						 WHEN CURRENT_TIMESTAMP > e.pre_end_time_reg THEN 'ปิดรับการขอเข้าร่วม' \n" +
      "							ELSE 'ยังไม่เปิดให้ขอเข้าร่วม' END) event_pre_time_status\n" +
      "						\n" +
      "FROM `event` e\n" +
      "      INNER JOIN event_role er ON e.event_role_id = er.id\n" +
      "			INNER JOIN faculty f ON e.faculty_id = f.id\n" +
      "			INNER JOIN branch b ON e.branch_id = b.id\n" +
      "			INNER JOIN `user` u ON e.user_create_id = u.id\n" +
      "			INNER JOIN user_role ur ON u.user_role_id = ur.id\n" +
      "      WHERE e.id = " +
      escape(req.body.event_id),
    function (err, eventData, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (eventData.length === 0) {
        res.send({ status: 0, message: "no event" });
        return;
      } else {
        res.send({ status: 1, message: "success", eventData });
      }
    }
  );
});

app.post("/queryEventCreatedListByID", (req, res, next) => {
  db.query(
    "SELECT * FROM `event` WHERE user_create_id = " + escape(req.body.user_id),
    function (err, eventData, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (eventData.length === 0) {
        res.send({ status: "error2", message: "no event" });
        return;
      } else {
        res.send({ status: "1", message: "success", eventData });
      }
    }
  );
});

app.post("/queryEventRoleList", (req, res, next) => {
  let whereSql = "";
  if (req.body.er_id !== -1) {
    whereSql += "WHERE id = " + escape(req.body.er_id);
  }
  db.query(
    "SELECT * FROM event_role " + whereSql,
    function (err, eventRoleList, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (eventRoleList.length === 0) {
        res.send({ status: 0, message: "no event" });
        return;
      } else {
        res.send({ status: 1, message: "success", eventRoleList });
      }
    }
  );
});

app.post("/queryEventRoleByID", (req, res, next) => {
  db.query(
    "SELECT * FROM event_role WHERE id = " + escape(req.body.er_id),
    function (err, eventRoleData, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (eventRoleData.length === 0) {
        res.send({ status: 0, message: "not have" });
        return;
      } else {
        res.send({ status: 1, message: "success", eventRoleData });
      }
    }
  );
});

app.post("/queryBranch", (req, res, next) => {
  let whereSql = "";
  if (req.body.b_id !== -1) {
    whereSql += "WHERE b.id = " + escape(req.body.b_id);
  }
  db.query(
    "SELECT b.*, f.name f_name FROM `branch` b\n" +
      "INNER JOIN faculty f ON b.faculty_id = f.id " +
      whereSql,
    function (err, branchList, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (branchList.length === 0) {
        res.send({ status: 0, message: "no event" });
        return;
      } else {
        res.send({ status: 1, message: "success", branchList });
      }
    }
  );
});

app.post("/queryBranchByFacultyID", (req, res, next) => {
  db.query(
    "SELECT b.*, f.name f_name FROM `branch` b\n" +
      "INNER JOIN faculty f ON b.faculty_id = f.id\n " +
      "WHERE f.id = " +
      escape(req.body.f_id),
    function (err, branchList, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (branchList.length === 0) {
        res.send({ status: 0, message: "no event" });
        return;
      } else {
        res.send({ status: 1, message: "success", branchList });
      }
    }
  );
});

app.post("/queryFaculty", (req, res, next) => {
  let whereSql = "";
  if (req.body.f_id !== -1) {
    whereSql += "WHERE id = " + escape(req.body.f_id);
  }
  db.query(
    "SELECT * FROM `faculty` " + whereSql,
    function (err, facultyList, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (facultyList.length === 0) {
        res.send({ status: 0, message: "no event" });
        return;
      } else {
        res.send({ status: 1, message: "success", facultyList });
      }
    }
  );
});

app.get("/queryUser", (req, res, next) => {
  db.query(
    "SELECT u.*, ur.`name` ur_name, f.`name` f_name,b.`name` b_name,  \n" +
      "         CONCAT(u.name_prefix, '',u.`name`,' ',u.surname ) fullName\n" +
      "FROM `user` u\n" +
      "INNER JOIN user_role ur ON ur.id = u.user_role_id\n" +
      "      INNER JOIN faculty f ON u.faculty_id = f.id\n" +
      "      INNER JOIN branch b ON u.branch_id = b.id \n" +
      "WHERE ur.id != 6 \n" +
      "ORDER BY u.user_role_id",
    function (err, userList, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (userList.length === 0) {
        res.send({ status: 0, message: "no user" });
        return;
      } else {
        res.send({ status: 1, message: "success", userList });
      }
    }
  );
});

app.post("/queryUserRole", (req, res, next) => {
  let sqlAdmin = "";
  let adminStatus = req.body.adminStatus;
  if (adminStatus == 0) {
    sqlAdmin += "WHERE id != 6";
  }
  db.query(
    "SELECT * FROM user_role " + sqlAdmin,
    function (err, userRoleList, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (userRoleList.length === 0) {
        res.send({ status: 0, message: "not have" });
        return;
      } else {
        res.send({ status: 1, message: "success", userRoleList });
      }
    }
  );
});

app.post("/queryUserRoleByID", (req, res, next) => {
  db.query(
    "SELECT * FROM user_role WHERE id = " + escape(req.body.ur_id),
    function (err, userRoleData, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (userRoleData.length === 0) {
        res.send({ status: 0, message: "not have" });
        return;
      } else {
        res.send({ status: 1, message: "success", userRoleData });
      }
    }
  );
});

app.post("/addEventCreate", uploadFile, async (req, res, next) => {
  const {
    event_code,
    name,
    slf_hour,
    quantity,
    term,
    year,
    location,
    pre_start_time_reg,
    pre_end_time_reg,
    event_start_time_reg,
    event_end_time_reg,
    detail,
    image,
    create_status,
    user_create_id,
    event_role_id,
    branch_id,
    faculty_id,
  } = req.body;
  db.query(
    "SELECT * FROM `event` WHERE create_status = 1 AND event_code = "+escape(event_code),
    function (err, result, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (result.length !== 0) {
        res.send({ status: -1, message: "have event" });
        return;
      }
      db.query(
        "INSERT INTO `event`(event_code,`name`,slf_hour,quantity,term,`year`,location,pre_start_time_reg,pre_end_time_reg,event_start_time_reg,event_end_time_reg,detail,image,create_status,user_create_id,event_role_id,branch_id,faculty_id) \n"+
        "VALUES ("+escape(event_code)+","+escape(name)+","+escape(slf_hour)+","+escape(quantity)+","+escape(term)+","+escape(year)+","+escape(location)+","+escape(pre_start_time_reg)+","+escape(pre_end_time_reg)+","+escape(event_start_time_reg)+","+escape(event_end_time_reg)+","+escape(detail)+","+escape(req.file.filename)+","+escape(create_status)+","+escape(user_create_id)+","+escape(event_role_id)+","+escape(branch_id)+","+escape(faculty_id)+")",
        
        function (err, results, fields) {
          if (results) {
            res.send({ status: 1, data: results.insertId });
          }
        }
      );
    }
  );
});

app.post("/updateEventCreate", uploadFile, async (req, res, next) => {
  const {
    event_code,
    name,
    slf_hour,
    quantity,
    term,
    year,
    location,
    pre_start_time_reg,
    pre_end_time_reg,
    event_start_time_reg,
    event_end_time_reg,
    detail,
    image,
    create_status,
    event_role_id,
    branch_id,
    faculty_id,
    id,
    imageStatus,
    eventCodeStatus,
  } = req.body;

  let sqlImage = "";
  if (imageStatus == 0) {
    sqlImage = " image = " + escape(req.file.filename) + ",\n";
  }
   
  db.query(
    "SELECT * FROM `event` WHERE create_status = 1 AND event_code = "+escape(event_code),
    function (err, result, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (result.length !== 0 && eventCodeStatus == 0) {
        res.send({ status: -1, message: "have event" });
        return;
      }
      db.query(
        "UPDATE `event` SET\n" +
          "	event_code = "+escape(event_code)+",\n" +
          "	`name` = "+escape(name)+",\n" +
          "	slf_hour = "+escape(slf_hour)+",\n" +
          "	quantity = "+escape(quantity)+",\n" +
          "	term = "+escape(term)+",\n" +
          "	`year` = "+escape(year)+",\n" +
          "	location = "+escape(location)+",\n" +
          "	pre_start_time_reg = "+escape(pre_start_time_reg)+",\n" +
          "	pre_end_time_reg = "+escape(pre_end_time_reg)+",\n" +
          "	event_start_time_reg = "+escape(event_start_time_reg)+",\n" +
          "	event_end_time_reg = "+escape(event_end_time_reg)+",\n" +
          "	create_status = "+escape(create_status)+",\n" +
          "	event_role_id = "+escape(event_role_id)+",\n" +
          "	branch_id = "+escape(branch_id)+",\n" +
          "	faculty_id = "+escape(faculty_id)+",\n" +
          sqlImage +
          "	detail = "+escape(detail)+"\n" +
          "\n WHERE id = "+escape(id), 
        function (err, results, fields) {
          if (results) {
            res.send({ status: 1 });
          }
        }
      );
    }
  );
});

app.post(
  "/addEventCreateImageCreateProof",
  uploadFile,
  async (req, res, next) => {
    const { e_id, image } = req.body;
    db.query(
      "UPDATE `event`\n" +
        "SET image_create_proof = " +
        escape(req.file.filename) +
        " \n" +
        "WHERE id = " +
        escape(e_id),
      function (err, results, fields) {
        if (results) {
          res.send({ status: 1 });
        }
      }
    );
  }
);

app.post("/addEventParticipation", (req, res, next) => {
  db.query(
    "INSERT INTO event_participation(request_status,pass_status,user_participation_id,event_id) VALUES(0,0,"+escape(req.body.user_participation_id)+","+escape(req.body.event_id)+")", 
    function (err, results, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      res.send({ status: "1" });
    }
  );
});

app.post("/queryEventParticipationWaitingByUserID", (req, res, next) => {
  db.query(
    "SELECT e.*,er.`name` event_role_name, ep.user_participation_id,	\n" +
      "        (SELECT DECODE_ORACLE(COUNT(sq2.event_id) , null, 0,COUNT(sq2.event_id)) result	\n" +
      "        	FROM event_participation sq2\n" +
      "        		WHERE sq2.request_status = 1 AND sq2.event_id = e.id) members_number\n" +
      "        FROM event_participation ep\n" +
      "        INNER JOIN `event` e ON ep.event_id = e.id\n" +
      "        INNER JOIN event_role er ON e.event_role_id = er.id\n" +
      "        WHERE ep.request_status = 0 AND ep.user_participation_id = "+escape(req.body.user_participation_id), 
    function (err, eventParticipationWaitingList, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (eventParticipationWaitingList.length === 0) {
        res.send({ status: "error2", message: "no event" });
        return;
      } else {
        res.send({
          status: 1,
          message: "success",
          eventParticipationWaitingList,
        });
      }
    }
  );
});

app.post("/queryEventCreateWaitingByUserID", (req, res, next) => {
  let sqlByUserId = "";
  if (req.body.user_role_id === 1) {
    sqlByUserId = "AND e.user_create_id = " + escape(req.body.user_create_id);
  }
  db.query(
    "SELECT e.*,er.`name` event_role_name , u.user_code, u.name_prefix, u.`name` u_name ,u.surname u_surname, f.name f_name, b.name b_name, (\n" +
      "        	SELECT DECODE_ORACLE(COUNT(event_id) , null, 0,COUNT(event_id)) result	\n" +
      "        	FROM event_participation\n" +
      "        		WHERE request_status = 1 AND event_id = e.id) members_number\n" +
      "FROM `event` e\n" +
      "INNER JOIN event_role er ON e.event_role_id = er.id\n" +
      "INNER JOIN faculty f ON e.faculty_id = f.id\n" +
      "INNER JOIN branch b ON e.branch_id = b.id\n" +
      "INNER JOIN `user` u ON e.user_create_id = u.id\n" +
      "   WHERE e.create_status = 0 AND e.faculty_id = " +
      escape(req.body.f_id)+
      " AND e.branch_id = " +
      escape(req.body.b_id) +
      " " +
      sqlByUserId,
    function (err, eventCreateWaitingList, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (eventCreateWaitingList.length > 0) {
        res.send({ status: 1, eventCreateWaitingList });
      } else {
        res.send({ status: 0 });
        return;
      }
    }
  );
});

app.post("/deleteEventCreateWaitingByEventID", (req, res, next) => {
  db.query(
    "DELETE FROM `event` WHERE id = " + escape(req.body.event_id),
    function (err, result, fields) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      if (result.length > 0) {
        res.json({ status: 1 });
      } else {
        res.json({ status: 0 });
        return;
      }
    }
  );
});

app.post("/deleteEventParticipationWaitingByEventID", (req, res, next) => {
  db.query(
    "DELETE FROM event_participation WHERE user_participation_id = "+escape(req.body.user_participation_id)+" AND event_id = " + escape(req.body.event_id),
    function (err, result, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (result.length > 0) {
        res.send({ status: 1 });
      } else {
        res.send({ status: 0 });
        return;
      }
    }
  );
});

app.post("/queryOfferEventWaiting", (req, res, next) => {
  let userIdSql = "";
  if (req.body.user_role_id == 1) {
    userIdSql = "oef.user_from_id = " + escape(req.body.user_id);
  } else {
    userIdSql = "oet.user_to_id = " + escape(req.body.user_id);
  }
  db.query(
    "SELECT oef.*, oet.user_to_id, oet.offer_status, \n" +
      "	uf.name_prefix uf_name_prefix, uf.`name` uf_name, uf.surname uf_surname, urf.`name` urf_name,\n" +
      "	ut.name_prefix ut_name_prefix, ut.`name` ut_name, ut.surname ut_surname, ur.`name` urt_name\n" +
      "    FROM offer_event_from oef \n" +
      "    INNER JOIN offer_event_to oet ON oef.id = oet.offer_event_from_id\n" +
      "    INNER JOIN `user` ut ON oet.user_to_id = ut.id \n" +
      "		 INNER JOIN `user` uf ON oef.user_from_id = uf.id \n" +
      "    INNER JOIN user_role ur ON ut.user_role_id = ur.id\n" +
      "			INNER JOIN user_role urf ON uf.user_role_id = urf.id \n" +
      "WHERE oet.offer_status = 0 AND " +
      userIdSql, 
    function (err, eventOfferWaitingList, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (eventOfferWaitingList.length > 0) {
        res.send({ status: 1, eventOfferWaitingList });
      }
    }
  );
});

app.post("/queryOfferEventPass", (req, res, next) => {
  let userIdSql = "";
  if (req.body.user_role_id == 1) {
    userIdSql = "oef.user_from_id = " + escape(req.body.user_id);
  } else {
    userIdSql = "oet.user_to_id = " + escape(req.body.user_id);
  }
  db.query(
    "SELECT oef.*, oet.user_to_id, oet.offer_status, \n" +
      "	uf.name_prefix uf_name_prefix, uf.`name` uf_name, uf.surname uf_surname, urf.`name` urf_name,\n" +
      "	ut.name_prefix ut_name_prefix, ut.`name` ut_name, ut.surname ut_surname, ur.`name` urt_name\n" +
      "    FROM offer_event_from oef \n" +
      "    INNER JOIN offer_event_to oet ON oef.id = oet.offer_event_from_id\n" +
      "    INNER JOIN `user` ut ON oet.user_to_id = ut.id \n" +
      "		 INNER JOIN `user` uf ON oef.user_from_id = uf.id \n" +
      "    INNER JOIN user_role ur ON ut.user_role_id = ur.id\n" +
      "			INNER JOIN user_role urf ON uf.user_role_id = urf.id \n" +
      "WHERE oet.offer_status != 0 AND " +
      userIdSql, 
    function (err, eventOfferPassList, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (eventOfferPassList.length > 0) {
        res.send({ status: 1, eventOfferPassList });
      }
    }
  );
});

app.post("/queryOfferEventByEventID", (req, res, next) => {
  db.query(
    "SELECT oef.*, oet.reple, oet.user_to_id, oet.offer_status, \n" +
      "	uf.name_prefix uf_name_prefix, uf.`name` uf_name, uf.surname uf_surname, urf.`name` urf_name,\n" +
      "	ut.name_prefix ut_name_prefix, ut.`name` ut_name, ut.surname ut_surname, ur.`name` urt_name\n" +
      "    FROM offer_event_from oef \n" +
      "    INNER JOIN offer_event_to oet ON oef.id = oet.offer_event_from_id\n" +
      "    INNER JOIN `user` ut ON oet.user_to_id = ut.id \n" +
      "		 INNER JOIN `user` uf ON oef.user_from_id = uf.id \n" +
      "    INNER JOIN user_role ur ON ut.user_role_id = ur.id\n" +
      "			INNER JOIN user_role urf ON uf.user_role_id = urf.id \n" +
      "WHERE oef.id = " + escape(req.body.offer_event_id),
    function (err, eventOfferDataByEventID, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (eventOfferDataByEventID.length > 0) {
        res.send({ status: 1, eventOfferDataByEventID });
      } else {
        res.send({ status: 0 });
        return;
      }
    }
  );
});

app.post("/deleteOfferEventWaitingByEventID", (req, res, next) => {
  db.query(
    "DELETE oef, oet\n" +
      "FROM offer_event_from oef\n" +
      "INNER JOIN offer_event_to oet ON oef.id = oet.offer_event_from_id\n" +
      "WHERE oef.id = " + escape(req.body.offer_event_from_id),
    function (err, result, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (result.length > 0) {
        res.send({ status: 1 });
      } else {
        res.send({ status: 0 });
        return;
      }
    }
  );
});

app.post("/addOfferEvent", (req, res, next) => {
  db.query(
    "INSERT INTO offer_event_from (`name`, detail, user_from_id)\n" +
      "VALUES (" +
      escape(req.body.name) +
      "," +
      escape(req.body.detail) +
      "," +
      escape(req.body.user_from_id) +
      ")",

    [],
    function (err, result, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      db.query(
        "INSERT INTO offer_event_to (offer_status, user_to_id, reple, offer_event_from_id) \n" +
          "VALUES (" +
          escape(req.body.offer_status) +
          ", " +
          escape(req.body.user_to_id) +
          ", " +
          escape(req.body.reple) +
          ", " +
          escape(result.insertId) +
          ")",
        function (err, results, fields) {
          if (err) {
            res.send({ status: "error2", message: err });
            return;
          }
          if (results) {
            res.send({ status: 1 });
          } else {
            res.send({ status: 0 });
            return;
          }
        }
      );
    }
  );
});

app.post("/repleOfferEvent", (req, res, next) => {
  db.query(
    "UPDATE offer_event_to \n" +
      "SET offer_status = " +
      escape(req.body.offer_status) +
      ", \n" +
      "reple = " +
      escape(req.body.reple) +
      " \n" +
      "WHERE id = " +
      escape(req.body.id),
    function (err, editStatus, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (req.body.offer_status == 2) {
        db.query(
          "INSERT INTO offer_event_from (`name`, detail, user_from_id)\n" +
            "VALUES (" +
            escape(req.body.name) +
            "," +
            escape(req.body.detail) +
            "," +
            escape(req.body.user_from_id) +
            ")", 
          function (err, result, fields) {
            if (err) {
              res.send({ status: "error", message: err });
              return;
            }
            db.query(
              "INSERT INTO offer_event_to (offer_status, user_to_id, offer_event_from_id) \n" +
                "VALUES ( 0, " +
                escape(req.body.user_to_id) +
                ", " +
                escape(result.insertId) +
                ")", 
              function (err, results, fields) {
                if (err) {
                  res.send({ status: "error", message: err });
                  return;
                }
                if (results) {
                  res.send({ status: 1 });
                } else {
                  res.send({ status: 0 });
                  return;
                }
              }
            );
          }
        );
      } else {
        res.send({ status: 1 });
      }
    }
  );
});

app.post("/queryAllUserToOfferEvent", (req, res, next) => {
  let sqlFacultyId = "";
  if (req.body.f_id != 0) {
    sqlFacultyId = "AND u.faculty_id =" + escape(req.body.f_id);
  }
  db.query(
    "SELECT u.*, ur.`name` ur_name,f.`name` f_name, b.`name` b_name\n" +
      "FROM `user` u\n" +
      "INNER JOIN user_role ur ON u.user_role_id = ur.id\n" +
      "INNER JOIN faculty f ON u.faculty_id = f.id\n" +
      "INNER JOIN branch b ON u.branch_id = b.id\n" +
      "WHERE u.user_role_id = 5 OR (u.user_role_id != 1 AND u.user_role_id != 6 " +
      sqlFacultyId +
      ")\n" +
      "ORDER BY u.user_role_id",
    function (err, userToOfferEventList, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (userToOfferEventList.length > 0) {
        res.send({ status: 1, userToOfferEventList });
      } else {
        res.send({ status: 0 });
        return;
      }
    }
  );
});

app.post("/queryUserDataByID", (req, res, next) => {
  db.query(
    "SELECT u.*, ur.`name` ur_name, f.id f_id, f.`name` f_name, b.id b_id, b.`name` b_name,\n" +
      "      	DECODE_ORACLE(ur.`name` ,'นิสิต' , 'สาขา',\n" +
      "      		'อาจารย์','สาขา',\n" +
      "      		'เลขาภาควิชา','สาขา',\n" +
      "      		'เจ้าหน้าที่คณะ','คณะ',\n" +
      "      		'เจ้าหน้าที่มหาวิทยาลัย','มหาวิทยาลัย',null) er_name,\n" +
      "      		(SELECT er.id \n" +
      "      		FROM event_role er \n" +
      "						WHERE er.`name` = er_name\n" +
      "      		) er_id, \n" +
      "      		DECODE_ORACLE((SELECT COUNT(e.user_create_id )\n" +
      "      		FROM `event` e\n" +
      "						WHERE e.create_status = 1 AND e.user_create_id = u.id\n" +
      "						GROUP BY e.user_create_id	\n" +
      "      		), null, 0,(SELECT COUNT(e.user_create_id )\n" +
      "      		FROM `event` e\n" +
      "						WHERE e.create_status = 1 AND e.user_create_id = u.id\n" +
      "						GROUP BY e.user_create_id	\n" +
      "      		))allEventCreate,\n" +
      "					DECODE_ORACLE((SELECT COUNT(ep.user_participation_id )\n" +
      "      		FROM event_participation ep\n" +
      "						WHERE ep.request_status = 1 AND ep.user_participation_id = u.id\n" +
      "						GROUP BY  ep.user_participation_id\n" +
      "      		), null, 0,(SELECT COUNT(ep.user_participation_id )\n" +
      "      		FROM event_participation ep\n" +
      "						WHERE ep.request_status = 1 AND ep.user_participation_id = u.id\n" +
      "						GROUP BY  ep.user_participation_id\n" +
      "      		))  allEventParticipation\n" +
      "					\n" +
      "      FROM `user` u\n" +
      "      INNER JOIN user_role ur ON u.user_role_id = ur.id\n" +
      "      INNER JOIN faculty f ON u.faculty_id = f.id\n" +
      "      INNER JOIN branch b ON u.branch_id = b.id \n" +
      "      WHERE u.id = " +
      escape(req.body.user_id),
    function (err, userData, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      res.send({ status: 1, userData });
    }
  );
});

app.post("/queryUserImageByID/:id", (req, res, next) => {
  try {
    db.query(
      "SELECT image FROM `user` WHERE id = " + escape(req.params.id),
      function (err, result) {
        if (err) {
          console.log("query error");
          console.log(result);
          return;
        }
        console.log(result);
        res.status(200).sendFile(`/${result[0]["image"]}`, { root: "public" });
      }
    );
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post("/queryEventImageByID/:id", (req, res, next) => {
  try {
    db.query(
      "SELECT image FROM `event` WHERE id = " + escape(req.params.id),
      function (err, result, fields) {
        if (err) {
          console.log("query error");
          console.log(result);
          return;
        } 
        res.status(200).sendFile(`/${result[0]["image"]}`, { root: "public" });
      }
    );
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post("/queryEventImageCreateProofByID/:id", (req, res, next) => {
  try {
    db.query(
      "SELECT image_create_proof FROM `event` WHERE id = " + escape(req.params.id),
      function (err, result, fields) {
        if (err) {
          console.log("query error");
          console.log(result);
          return;
        }
        res
          .status(200)
          .sendFile(`/${result[0]["image_create_proof"]}`, { root: "public" });
      }
    );
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post("/queryUserParticipationBystatusAndEventID", (req, res, next) => {
  db.query(
    "SELECT u.*,f.`name` uf_name,b.`name` ub_name,ur.`name` ur_name,ep.request_status,\n" +
      "         CONCAT(u.name_prefix, '',u.`name`,' ',u.surname ) fullName\n" +
      "      FROM event_participation ep \n" +
      "					INNER JOIN `event` e ON ep.event_id = e.id\n" +
      "      		INNER JOIN `user` u ON ep.user_participation_id = u.id\n" +
      "      		INNER JOIN user_role ur ON u.user_role_id = ur.id\n" +
      "					INNER JOIN faculty f ON u.faculty_id = f.id\n" +
      "      		INNER JOIN branch b ON u.branch_id = b.id\n" +
      "       WHERE ep.request_status = "+escape(req.body.status)+" AND ep.event_id = "+escape(req.body.event_id), 
    function (err, userParticipationList, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      res.send({ status: 1, userParticipationList });
    }
  );
});

app.get("/queryAllEventYear", (req, res, next) => {
  db.query(
    "SELECT e.`year`\n" +
      "FROM `event` e\n" +
      "WHERE e.create_status = 1\n" +
      "GROUP BY e.`year`\n" +
      "ORDER BY e.`year`",
    function (err, allEventYear, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      res.send({ status: 1, allEventYear });
    }
  );
});

app.post("/querySLFEventByUserID", (req, res, next) => {
  db.query(
    "SELECT e.*,ep.pass_status, er.name er_name, DECODE_ORACLE(ep.pass_status , 0, 'กำลังดำเนินการ',1,'ผ่าน',2,'ไม่ผ่าน',null) pass_status_result,(\n" +
      "   SELECT DECODE_ORACLE(COUNT(event_id) , null, 0,COUNT(event_id)) result\n" +
      "   FROM event_participation \n" +
      "     WHERE request_status = 1 AND event_id = e.id) members_number\n" +
      "FROM event_participation ep\n" +
      "INNER JOIN `event` e on ep.event_id = e.id\n" +
      "INNER JOIN event_role er on e.event_role_id = er.id\n" +
      "WHERE ep.pass_status = 1 AND e.slf_hour != 0 AND e.term = " +
      escape(req.body.term) +
      " AND e.`year` = " +
      escape(req.body.year) +
      "  AND ep.user_participation_id = " +
      escape(req.body.user_participation_id),
    function (err, SLFEventList, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      res.send({ status: 1, SLFEventList });
    }
  );
});

app.post("/querySLFEventMonthCountList", (req, res, next) => {
  db.query(
    "			SELECT MONTH(e.event_end_time_reg) month_name, COUNT(MONTH(e.event_end_time_reg)) month_count\n" +
      "			FROM event_participation ep\n" +
      "			INNER JOIN `event` e on ep.event_id = e.id \n" +
      "      INNER JOIN event_role er on e.event_role_id = er.id \n" +
      "      WHERE ep.pass_status = 1 AND e.slf_hour != 0 AND e.term = " +
      escape(req.body.term) +
      "\n" +
      "      AND e.`year` = " +
      escape(req.body.year) +
      " \n" +
      "      AND ep.user_participation_id = " +
      escape(req.body.user_participation_id) +
      "\n" +
      "			GROUP BY MONTH(e.event_end_time_reg)",
    function (err, SLFEventMonthCountList, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (SLFEventMonthCountList.length > 0) {
        res.send({ status: 1, SLFEventMonthCountList });
      }
    }
  );
});

app.post("/queryEventAnnounceByEventID", (req, res, next) => {
  db.query(
    "SELECT en.* ,u.name_prefix, u.id user_id, u.`name`, u.surname, u.image,\n" +
      "CONCAT(CONVERT(TIME(en.time_reg),VARCHAR(5)), ' น. ',DAY(en.time_reg),'/',MONTH(en.time_reg),'/',YEAR(en.time_reg)+543 ) time_announce\n" +
      "FROM event_announce en\n" +
      "INNER JOIN `event` e ON en.event_id = e.id\n" +
      "INNER JOIN `user` u ON e.user_create_id = u.id\n" +
      "WHERE en.event_id = "+escape(req.body.event_id)+"\n" +
      "ORDER BY en.time_reg", 
    function (err, eventAnnounceList, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (eventAnnounceList.length > 0) {
        res.send({ status: 1, eventAnnounceList });
      } else {
        res.send({ status: 0 });
        return;
      }
    }
  );
});

app.post("/addEventAnnounce", (req, res, next) => {
  db.query(
    "INSERT INTO event_announce(`data`,event_id) VALUES("+escape(req.body.data)+","+escape(req.body.event_id)+")", 
    function (err, results, fields) {
      if (results) {
        res.send({ status: 1 });
      }
    }
  );
});

app.post("/addEventAnnounceAdmin", (req, res, next) => {
  db.query(
    "INSERT INTO announce(`data`,user_id) VALUES("+escape(req.body.data)+","+escape(req.body.u_id)+")", 
    function (err, results, fields) {
      if (results) {
        res.send({ status: 1 });
      }
    }
  );
});

app.post("/deleteEventAnnounce", (req, res, next) => {
  db.query(
    "DELETE FROM event_announce WHERE id = " +escape(req.body.announce_id),
    function (err, results, fields) {
      if (results) {
        res.send({ status: 1 });
      }
    }
  );
});

app.post("/deleteEventAnnounceAdmin", (req, res, next) => {
  db.query(
    "DELETE FROM announce WHERE id = " +escape(req.body.announce_id), 
    function (err, results, fields) {
      if (results) {
        res.send({ status: 1 });
      }
    }
  );
});

app.post("/deleteUserParticipation", (req, res, next) => {
  db.query(
    "DELETE FROM event_participation WHERE user_participation_id = "+escape(req.body.user_participation_id)+" AND event_id = "+escape(req.body.event_id), 
    function (err, results, fields) {
      if (results) {
        res.send({ status: 1 });
      }
    }
  );
});

app.post("/approveUserParticipation", (req, res, next) => {
  db.query(
    "UPDATE event_participation\n" +
      "SET request_status = 1\n" +
      "WHERE user_participation_id = "+escape(req.body.user_participation_id)+" AND event_id = "+escape(req.body.event_id), 
    function (err, results, fields) {
      if (results) {
        res.send({ status: 1 });
      }
    }
  );
});

app.post("/queryEventParticipationAnnounce", (req, res, next) => {
  db.query(
    "SELECT e.id,e.`name` e_name, er.`name` er_name, CONCAT(u.name_prefix, '',u.`name`,' ',u.surname ) fu_name, ur.`name` ur_name\n" +
      "FROM event_participation ep\n" +
      "LEFT JOIN event_announce ea ON ep.event_id = ea.event_id\n" +
      "INNER JOIN `event` e ON ep.event_id = e.id\n" +
      "INNER JOIN event_role er ON e.event_role_id = er.id\n" +
      "INNER JOIN `user` u ON e.user_create_id = u.id\n" +
      "INNER JOIN user_role ur ON u.user_role_id = ur.id\n" +
      "WHERE ep.request_status = 1 AND ep.user_participation_id = "+escape(req.body.user_participation_id)+"\n" +
      "GROUP BY ep.event_id", 
    function (err, eventParticipationAnnounceList, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (eventParticipationAnnounceList.length > 0) {
        res.send({ status: 1, eventParticipationAnnounceList });
      }
    }
  );
});

app.post("/queryEventAnnounceAdmin", (req, res, next) => {
  db.query(
    "SELECT a.* ,u.name_prefix, u.`name`, u.surname, u.image,\n" +
      "CONCAT(CONVERT(TIME(a.time_reg),VARCHAR(5)), ' น. ',DAY(a.time_reg),'/',MONTH(a.time_reg),'/',YEAR(a.time_reg)+543 ) time_announce\n" +
      "FROM announce a\n" +
      "INNER JOIN `user` u ON a.user_id = u.id \n" +
      "ORDER BY a.time_reg",
    function (err, eventAnnounceAdminList, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (eventAnnounceAdminList.length > 0) {
        res.send({ status: 1, eventAnnounceAdminList });
      } else {
        res.send({ status: 0 });
        return;
      }
    }
  );
});

app.post("/queryCheckNameUserParticipationByEventID", (req, res, next) => {
  let sqlStatus = "";
  if (req.body.status === 0) {
    sqlStatus += "= 0";
  } else {
    sqlStatus += "!= 0";
  }
  db.query(
    "SELECT  u.*, f.`name` uf_name, b.`name` ub_name, ur.`name` ur_name, ep.request_status, ep.pass_status,\n" +
      "        CONCAT(u.name_prefix, '',u.`name`,' ',u.surname ) fullName,\n" +
      "				SUM(DECODE_ORACLE(cnp.check_name_status ,null ,0,cnp.check_name_status)) check_name_paticipation_time,\n" +
      "				(SELECT COUNT(cnc.event_id) FROM check_name_created cnc WHERE cnc.event_id = ep.event_id GROUP BY cnc.event_id) check_name_create_time,\n" +
      "				ROUND((SUM(DECODE_ORACLE(cnp.check_name_status ,null ,0,cnp.check_name_status))/(SELECT COUNT(cnc.event_id) FROM check_name_created cnc WHERE cnc.event_id = ep.event_id GROUP BY cnc.event_id))*100,2) avg_check_name \n" +
      "      FROM event_participation ep \n" +
      "					INNER JOIN `event` e ON ep.event_id = e.id\n" +
      "      		INNER JOIN `user` u ON ep.user_participation_id = u.id\n" +
      "      		INNER JOIN user_role ur ON u.user_role_id = ur.id\n" +
      "					INNER JOIN faculty f ON u.faculty_id = f.id\n" +
      "      		INNER JOIN branch b ON u.branch_id = b.id\n" +
      "					LEFT JOIN check_name_participation cnp ON ep.id = cnp.event_participation_id\n" +
      "      WHERE ep.request_status = 1 AND ep.pass_status " +
      sqlStatus +
      " AND ep.event_id = " +
      escape(req.body.event_id) +
      "\n" +
      "			GROUP BY ep.id ",
    function (err, checkNameUserParticipationList, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (checkNameUserParticipationList) {
        res.send({ status: 1, checkNameUserParticipationList });
      }
    }
  );
});

app.post("/passEvent", (req, res, next) => {
  db.query(
    "UPDATE event_participation\n" +
      "SET pass_status = 1\n" +
      "WHERE user_participation_id = "+escape(req.body.user_participation_id)+" AND event_id = "+escape(req.body.event_id), 
    function (err, results, fields) {
      if (results) {
        res.send({ status: 1 });
      }
    }
  );
});

app.post("/notPassEvent", (req, res, next) => {
  db.query(
    "UPDATE event_participation\n" +
      "SET pass_status = -1\n" +
      "WHERE user_participation_id = "+escape(req.body.user_participation_id)+" AND event_id = "+escape(req.body.event_id), 
    function (err, results, fields) {
      if (results) {
        res.send({ status: 1 });
      }
    }
  );
});

app.post("/allPassEvent", (req, res, next) => {
  const all_user_participation = req.body.all_user_participation_id;
  for (let i = 0; i < all_user_participation.length; i++) {
    db.query(
      "UPDATE event_participation\n" +
        "SET pass_status = 1\n" +
        "WHERE user_participation_id = " +
        escape(all_user_participation[i].id)+
        " AND event_id =" +
        escape(req.body.event_id)
    );
  }

  res.send({ status: 1 });
});

app.post("/allNotPassEvent", (req, res, next) => {
  const all_user_participation = req.body.all_user_participation_id;
  for (let i = 0; i < all_user_participation.length; i++) {
    db.query(
      "UPDATE event_participation\n" +
        "SET pass_status = -1\n" +
        "WHERE user_participation_id = " +
        escape(all_user_participation[i].id) +
        " AND event_id =" +
        escape(req.body.event_id)
    );
  }
  res.send({ status: 1 });
});

app.post("/addFaculty", (req, res, next) => {
  db.query(
    "INSERT INTO faculty(`name`) VALUES("+escape(req.body.f_name)+")", 
    function (err, results, fields) {
      if (results) {
        res.send({ status: 1 });
      }
    }
  );
});

app.post("/addBranch", (req, res, next) => {
  db.query(
    "INSERT INTO branch(`name`,faculty_id) VALUES("+escape(req.body.b_name)+","+escape(req.body.b_f_id)+")", 
    function (err, results, fields) {
      if (results) {
        res.send({ status: 1 });
      }
    }
  );
});

app.post("/deleteFaculty", (req, res, next) => {
  db.query(
    "DELETE FROM faculty WHERE id = "+escape(req.body.f_id), 
    function (err, results, fields) {
      if (results) {
        res.send({ status: 1 });
      }
    }
  );
});

app.post("/deleteBranch", (req, res, next) => {
  db.query(
    "DELETE FROM branch WHERE id = "+escape(req.body.b_id), 
    function (err, results, fields) {
      if (results) {
        res.send({ status: 1 });
      }
    }
  );
});

app.post("/editFaculty", (req, res, next) => {
  db.query(
    "UPDATE faculty\n" +
      "SET `name` = " +
      escape(req.body.f_name) +
      " \n" +
      "WHERE id = " +
      escape(req.body.f_id),
    function (err, results, fields) {
      if (results) {
        res.send({ status: 1 });
      }
    }
  );
});

app.post("/editBranch", (req, res, next) => {
  db.query(
    "UPDATE branch\n" +
      "SET `name` = " +
      escape(req.body.b_name) +
      ", \n" +
      "faculty_id =" +
      escape(req.body.f_id) +
      " \n" +
      "WHERE id = " +
      escape(req.body.b_id),
    function (err, results, fields) {
      if (results) {
        res.send({ status: 1 });
      }
    }
  );
});

app.post("/addEventRole", (req, res, next) => {
  db.query(
    "INSERT INTO event_role(`name`) VALUES("+escape(req.body.er_name)+")",
    function (err, results, fields) {
      if (results) {
        res.send({ status: 1 });
      }
    }
  );
});

app.post("/editEventRole", (req, res, next) => {
  db.query(
    "UPDATE event_role\n" +
      "SET `name` = " +
      escape(req.body.er_name) +
      " \n" +
      "WHERE id = " +
      escape(req.body.er_id),
    function (err, results, fields) {
      if (results) {
        res.send({ status: 1 });
      }
    }
  );
});

app.post("/deleteEventRole", (req, res, next) => {
  db.query(
    "DELETE FROM event_role WHERE id = " + escape(req.body.er_id),
    function (err, results, fields) {
      if (results) {
        res.send({ status: 1 });
      }
    }
  );
});

app.post("/addUserRole", (req, res, next) => {
  db.query(
    "INSERT INTO user_role(`name`) VALUES("+escape(req.body.ur_name)+")", 
    function (err, results, fields) {
      if (results) {
        res.send({ status: 1 });
      }
    }
  );
});

app.post("/editUserRole", (req, res, next) => {
  db.query(
    "UPDATE user_role\n" +
      "SET `name` = " +
      escape(req.body.ur_name) +
      " \n" +
      "WHERE id = " +
      escape(req.body.ur_id),
    function (err, results, fields) {
      if (results) {
        res.send({ status: 1 });
      }
    }
  );
});

app.post("/deleteUserRole", (req, res, next) => {
  db.query(
    "DELETE FROM user_role WHERE id = " +escape(req.body.ur_id),
    function (err, results, fields) {
      if (results) {
        res.send({ status: 1 });
      }
    }
  );
});

app.post("/deleteUser", (req, res, next) => {
  db.query(
    "DELETE FROM `user` WHERE id = " +escape(req.body.u_id),
    function (err, results, fields) {
      if (results) {
        res.send({ status: 1 });
      }
    }
  );
});

app.post("/updateUserData", uploadFile, (req, res, next) => {
  const {
    email,
    nickname,
    name_prefix,
    name,
    surname,
    student_year,
    image,
    imageStatus,
  } = req.body;

  let sqlImage = "";
  if (imageStatus == 0) {
    sqlImage = " image = " + escape(req.file.filename) + ",\n";
  }

  db.query(
    "UPDATE `user`\n" +
      "SET nickname = " +
      escape(nickname) +
      ", \n" +
      "name_prefix = " +
      escape(name_prefix) +
      ", \n" +
      "`name` = " +
      escape(name) +
      ", \n" +
      "surname = " +
      escape(surname) +
      ", \n" +
      sqlImage +
      " student_year = " +
      escape(student_year) +
      " \n" +
      "WHERE email = " +escape(email) ,
    function (err, results, fields) {
      if (results) {
        res.send({ status: 1 });
      }
    }
  );
});

app.post("/editPassword", (req, res, next) => {
  db.query(
    "SELECT * FROM `user` WHERE email = "+escape(req.body.email),
    function (err, results, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }

      bcrypt.compare(
        req.body.password,
        results[0].password,
        function (err, result) {
          if (result) {
            bcrypt.hash(
              req.body.new_password,
              saltRounds,
              function (err, hash) {
                db.query(
                  "UPDATE `user`\n" +
                    "SET password = " +
                    escape(hash) +
                    " \n" +
                    "WHERE email = " +escape(req.body.email) ,
                  function (err, results, fields) {
                    if (results) {
                      res.send({ status: 1 });
                    }
                  }
                );
              }
            );
          } else {
            res.send({ status: 0 });
          }
        }
      );
    }
  );
});

app.post("/editPasswordAdmin", (req, res, next) => {
  db.query(
    "SELECT * FROM `user` WHERE email = " +escape(req.body.email),
    function (err, results, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }

      bcrypt.hash(req.body.new_password, saltRounds, function (err, hash) {
        db.query(
          "UPDATE `user`\n" +
            "SET password = " +
            escape(hash) +
            " \n" +
            "WHERE email = " + escape(req.body.email),
          function (err, results, fields) {
            if (results) {
              res.send({ status: 1 });
            }
          }
        );
      });
    }
  );
});

app.post("/deleteEventParticipation", (req, res, next) => {
  db.query(
    "DELETE FROM event_participation WHERE user_participation_id = "+escape(req.body.u_id)+" AND event_id = "+escape(req.body.e_id), 
    function (err, results, fields) {
      if (results) {
        res.send({ status: 1 });
      }
    }
  );
});

app.post("/deleteEvent", (req, res, next) => {
  db.query(
    "DELETE FROM `event` WHERE id = " +escape(req.body.e_id),
    function (err, results, fields) {
      if (results) {
        res.send({ status: 1 });
      }
    }
  );
});

app.post("/queryAllUserSlf", (req, res, next) => {
  db.query(
    "SELECT u.id, u.user_code , ur.`name` ur_name, f.id f_id, f.`name` f_name, b.id b_id, b.`name` b_name,\n" +
      "CONCAT(u.name_prefix, '',u.`name`,' ',u.surname ) fullName,\n" +
      "            	DECODE_ORACLE(\n" +
      "							(SELECT SUM(e1.slf_hour )\n" +
      "            		FROM event_participation ep\n" +
      "								INNER JOIN `event` e1 ON ep.event_id = e1.id\n" +
      "      						WHERE ep.request_status = 1 AND ep.user_participation_id = u.id AND ep.pass_status = 1 AND e1.slf_hour != 0 AND e1.term = " +
      escape(req.body.term)+
      " AND e1.year = " +
      escape(req.body.year) +
      "\n" +
      "      						GROUP BY  ep.user_participation_id\n" +
      "            		), null, 0,(SELECT SUM(e1.slf_hour )\n" +
      "            		FROM event_participation ep\n" +
      "								INNER JOIN `event` e1 ON ep.event_id = e1.id\n" +
      "      						WHERE ep.request_status = 1 AND ep.user_participation_id = u.id AND ep.pass_status = 1 AND e1.slf_hour != 0 AND e1.term = " +
      escape(req.body.term) +
      " AND e1.year = " +
      escape(req.body.year) +
      "\n" +
      "      						GROUP BY  ep.user_participation_id\n" +
      "            		)) allSlfHour,\n" +
      "								\n" +
      "      					DECODE_ORACLE((SELECT COUNT(ep.user_participation_id )\n" +
      "            		FROM event_participation ep\n" +
      "								INNER JOIN `event` e1 ON ep.event_id = e1.id\n" +
      "      						WHERE ep.request_status = 1 AND ep.user_participation_id = u.id AND ep.pass_status = 1 AND e1.slf_hour != 0 AND e1.term = " +
      escape(req.body.term) +
      " AND e1.year = " +
      escape(req.body.year) +
      "\n" +
      "      						GROUP BY  ep.user_participation_id\n" +
      "            		), null, 0,(SELECT COUNT(ep.user_participation_id )\n" +
      "            		FROM event_participation ep\n" +
      "								INNER JOIN `event` e1 ON ep.event_id = e1.id\n" +
      "      						WHERE ep.request_status = 1 AND ep.user_participation_id = u.id AND ep.pass_status = 1 AND e1.slf_hour != 0 AND e1.term = " +
      escape(req.body.term) +
      " AND e1.year = " +
      escape(req.body.year) +
      "\n" +
      "      						GROUP BY  ep.user_participation_id\n" +
      "            		))  allEventParticipation\n" +
      "      			\n" +
      "            FROM `user` u\n" +
      "            INNER JOIN user_role ur ON u.user_role_id = ur.id\n" +
      "            INNER JOIN faculty f ON u.faculty_id = f.id\n" +
      "            INNER JOIN branch b ON u.branch_id = b.id \n" +
      "            WHERE ur.id = 1 AND f.id = " +
      escape(req.body.f_id) +
      " AND b.id = " +
      escape(req.body.b_id),
    function (err, userDataList, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (userDataList) {
        res.send({ status: 1, userDataList });
      }
    }
  );
});

app.post("/addCheckNameCreated", (req, res, next) => {
  const { times, image, check_start_time_reg, check_end_time_reg, event_id } =
    req.body;
  db.query(
    "SELECT * FROM check_name_created WHERE times = " +
    escape(times) +
      " AND event_id = " +
      escape(event_id),
    function (err, result, fields) {
      if (result.length > 0) {
        res.send({ status: -1, message: "have data" });
        return;
      }
      db.query(
        "INSERT INTO check_name_created(times,qr_code,check_start_time_reg,check_end_time_reg,event_id) \n"+
        "VALUES("+escape(times)+","+escape(image)+","+escape(check_start_time_reg)+","+escape(check_end_time_reg)+","+escape(event_id)+")", 
        function (err, results, fields) {
          if (results) {
            res.send({ status: 1 });
          }
        }
      );
    }
  );
});

app.post("/queryCheckNameCreatedListByEventID", (req, res, next) => {
  db.query(
    "SELECT cnc.* , CONCAT(CONVERT(TIME(cnc.check_start_time_reg),VARCHAR(5)), 'น. ',DAY(cnc.check_start_time_reg),'/',MONTH(cnc.check_start_time_reg),'/',YEAR(cnc.check_start_time_reg)+543 ) check_start_time_reg_ch, \n" +
      "      CONCAT(CONVERT(TIME(cnc.check_end_time_reg),VARCHAR(5)), 'น. ',DAY(cnc.check_end_time_reg),'/',MONTH(cnc.check_end_time_reg),'/',YEAR(cnc.check_end_time_reg)+543 ) check_end_time_reg_ch,\n" +
      "			\n" +
      "DECODE_ORACLE((SELECT cnp.check_name_status\n" +
      "FROM check_name_participation cnp\n" +
      "WHERE cnp.event_participation_id = " +
      escape(req.body.event_participation_id) +
      " AND cnp.check_name_created_id = cnc.id), null,0, \n" +
      "	(SELECT cnp.check_name_status\n" +
      "	FROM check_name_participation cnp\n" +
      "	WHERE cnp.event_participation_id = " +
      escape(req.body.event_participation_id) +
      " AND cnp.check_name_created_id = cnc.id)) check_name_status,\n" +
      "			 \n" +
      "DECODE_ORACLE((SELECT cnp.check_name_status\n" +
      "FROM check_name_participation cnp\n" +
      "WHERE cnp.event_participation_id = " +
      escape(req.body.event_participation_id) +
      " AND cnp.check_name_created_id = cnc.id), 1, 'เช็คชื่อทันเวลา', -1, 'เช็คชื่อสาย','ไม่ได้เช็คชื่อ')\n" +
      "			 check_name_status_name\n" +
      "			\n" +
      "      FROM `check_name_created`  cnc\n" +
      "      WHERE cnc.event_id = " +
      escape(req.body.event_id) +
      "\n" +
      "ORDER BY times",
    function (err, checkNameCreatedList, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (checkNameCreatedList.length > 0) {
        res.send({ status: 1, checkNameCreatedList });
      }
    }
  );
});

app.post("/queryCheckNameCreatedQrCode", (req, res, next) => {
  db.query(
    "SELECT qr_code\n" +
      "FROM `check_name_created`\n" +
      "WHERE times = "+escape(req.body.times)+" AND event_id = "+escape(req.body.event_id), 
    function (err, checkNameCreatedQrCode, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (checkNameCreatedQrCode.length > 0) {
        res.send({ status: 1, checkNameCreatedQrCode });
      }
    }
  );
});

app.post("/deleteCheckNameCreatedByEventID", (req, res, next) => {
  db.query(
    "DELETE FROM `check_name_created` WHERE times = "+escape(req.body.times)+" AND event_id = "+escape(req.body.event_id), 
    function (err, result, fields) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: 1 });
    }
  );
});

app.post("/updateCheckNameCreatedByEventID", (req, res, next) => {
  db.query(
    "UPDATE `check_name_created` SET check_start_time_reg = "+escape(req.body.check_start_time_reg)+", check_end_time_reg = "+escape(req.body.check_end_time_reg)+" WHERE times = "+escape(req.body.times)+" AND event_id = "+escape(req.body.event_id),
    function (err, result, fields) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: 1 });
    }
  );
});

app.post("/queryUserCheckNameList", (req, res, next) => {
  db.query(
    "SELECT u.user_code, CONCAT(u.name_prefix, '',u.`name`,' ',u.surname ) fullName ,ur.`name` ur_name,\n" +
      "DECODE_ORACLE(\n" +
      "	(SELECT cnp2.check_name_status\n" +
      "	FROM  `check_name_participation` cnp2 \n" +
      "	INNER JOIN check_name_created cnc2 ON cnp2.check_name_created_id = cnc2.id \n" +
      "	WHERE cnp2.event_participation_id = cnp.event_participation_id AND cnc2.times = " +
      escape(req.body.times) +
      ")\n" +
      "		, null, 'ไม่ได้เช็คชื่อ',1,'เช็คชื่อทันเวลา',-1,'เช็คชื่อสาย',\n" +
      "	(SELECT cnp2.check_name_status\n" +
      "	FROM  `check_name_participation` cnp2 \n" +
      "	INNER JOIN check_name_created cnc2 ON cnp2.check_name_created_id = cnc2.id \n" +
      "	WHERE cnp2.event_participation_id = cnp.event_participation_id AND cnc2.times = " +
      escape(req.body.times) +
      ")) ch_n_status\n" +
      "FROM event_participation ep\n" +
      "LEFT JOIN `check_name_participation` cnp ON ep.id = cnp.event_participation_id \n" +
      "INNER JOIN `user` u ON ep.user_participation_id = u.id\n" +
      "INNER JOIN user_role ur ON u.user_role_id = ur.id\n" +
      "WHERE ep.request_status = 1 AND ep.event_id = " +
      escape(req.body.event_id),
    function (err, userCheckNameList, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (userCheckNameList.length > 0) {
        res.send({ status: 1, userCheckNameList });
      }
    }
  );
});

app.post("/queryEventParticipationId", (req, res, next) => {
  db.query(
    "SELECT ep.id\n" +
      "      FROM event_participation ep\n" +
      "      WHERE ep.user_participation_id = "+escape(req.body.user_participation_id)+" AND ep.event_id = "+escape(req.body.event_id),
      function (err, userParticipationId, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }

      res.send({ status: 1, userParticipationId });
    }
  );
});

app.post("/addCheckNameByUserParticipation", (req, res, next) => {
  const check_name_status = -1;
  const time_reg = req.body.time_reg;
  const event_participation_id = req.body.event_participation_id;
  const check_name_created_id = req.body.check_name_created_id;
  db.query(
    "SELECT * \n" +
      "FROM `check_name_created` cnc \n" +
      "WHERE cnc.id = " +
      escape(check_name_created_id) +
      " AND " +
      escape(time_reg) +
      " BETWEEN cnc.check_start_time_reg AND cnc.check_end_time_reg",
    function (err, result, fields) {
      if (result.length > 0) {
        check_name_status = 1;
      }

      db.query(
        "INSERT INTO check_name_participation(check_name_status,time_reg,event_participation_id,check_name_created_id) VALUES(" +
        escape(check_name_status) +
          "," +
          escape(time_reg) +
          "," +
          escape(event_participation_id) +
          "," +
          escape(check_name_created_id) +
          ")",

        function (err, results, fields) {
          if (results) {
            res.send({ status: 1 });
          }
        }
      );
    }
  );
});

app.post("/deleteCheckNameParticipation", (req, res, next) => {
  db.query(
    "DELETE FROM `check_name_participation` WHERE event_participation_id = "+escape(req.body.event_participation_id)+" AND check_name_created_id = "+escape(req.body.check_name_created_id),
    function (err, result, fields) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: 1 });
    }
  );
});

app.get("/queryCountEventRole", (req, res, next) => {
  db.query(
    "SELECT er.* ,\n" +
      "	(SELECT COUNT(e.event_role_id)\n" +
      "		FROM `event` e\n" +
      "		WHERE e.create_status = 1 AND e.event_role_id = er.id\n" +
      "		GROUP BY e.event_role_id) count_event_role\n" +
      "FROM event_role er",
    function (err, countEventRole, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (countEventRole.length > 0) {
        res.send({ status: 1, countEventRole });
      }
    }
  );
});

app.post("/queryMostMemberNumber", (req, res, next) => {
  let sqlEventRole = "";
  let event_role_id = req.body.event_role_id;
  if (event_role_id !== 0) {
    sqlEventRole += "AND er.id = " + escape(event_role_id);
  }

  db.query(
    "SELECT e.*,er.`name` event_role_name,f.`name` f_name,b.`name` b_name, \n" +
      "      		CONCAT(CONVERT(TIME(e.pre_start_time_reg),VARCHAR(5)), ' น. ',DAY(e.pre_start_time_reg),'/',MONTH(e.pre_start_time_reg),'/',YEAR(e.pre_start_time_reg)+543 ) p_time_start,\n" +
      "      		CONCAT(CONVERT(TIME(e.pre_end_time_reg),VARCHAR(5)), ' น. ',DAY(e.pre_end_time_reg),'/',MONTH(e.pre_end_time_reg),'/',YEAR(e.pre_end_time_reg)+543) p_time_end,\n" +
      "      	  CONCAT(CONVERT(TIME(e.event_start_time_reg),VARCHAR(5)), ' น. ',DAY(e.event_start_time_reg),'/',MONTH(e.event_start_time_reg),'/',YEAR(e.event_start_time_reg)+543) time_start,\n" +
      "      	  CONCAT(CONVERT(TIME(e.event_end_time_reg),VARCHAR(5)), ' น. ',DAY(e.event_end_time_reg),'/',MONTH(e.event_end_time_reg),'/',YEAR(e.event_end_time_reg)+543) time_end, (\n" +
      "      	\n" +
      "            	SELECT DECODE_ORACLE(COUNT(event_id) , null, 0,COUNT(event_id)) result\n" +
      "            	FROM event_participation\n" +
      "            		WHERE request_status = 1 AND event_id = e.id) members_number,\n" +
      "      					   (CASE  WHEN CURRENT_TIMESTAMP BETWEEN e.pre_start_time_reg AND e.pre_end_time_reg THEN 'เปิดให้ขอเข้าร่วม'\n" +
      "      						 WHEN CURRENT_TIMESTAMP > e.pre_end_time_reg THEN 'ปิดรับการขอเข้าร่วม' \n" +
      "      							ELSE 'ยังไม่เปิดให้ขอเข้าร่วม' END) event_pre_time_status,\n" +
      "      					   (CASE  WHEN CURRENT_TIMESTAMP BETWEEN e.event_start_time_reg AND e.event_end_time_reg THEN 'กิจกรรมกำลังดำเนินการ'\n" +
      "      						 WHEN CURRENT_TIMESTAMP > e.event_end_time_reg THEN 'กิจกรรมจบลงแล้ว'\n" +
      "      							ELSE 'กิจกรรมยังไม่เริ่ม' END) event_time_status\n" +
      "            FROM `event` e\n" +
      "                  INNER JOIN event_role er ON e.event_role_id = er.id\n" +
      "            			INNER JOIN faculty f ON e.faculty_id = f.id\n" +
      "            	 	  INNER JOIN branch b ON e.branch_id = b.id\n" +
      "                  WHERE e.create_status = 1 " +
      sqlEventRole +
      "\n" +
      "            			ORDER BY members_number DESC",
    function (err, mostMemberNumber, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (mostMemberNumber.length > 0) {
        res.send({ status: 1, mostMemberNumber });
      }
    }
  );
});

app.post("/queryMostEventCountDate", (req, res, next) => {
  let sqlEventRole = "";
  let event_role_id = req.body.event_role_id;
  if (event_role_id !== 0) {
    sqlEventRole += "AND er.id = " + escape(event_role_id);
  }

  db.query(
    "SELECT e.*,er.`name` event_role_name,f.`name` f_name,b.`name` b_name, \n" +
      "      		CONCAT(CONVERT(TIME(e.pre_start_time_reg),VARCHAR(5)), ' น. ',DAY(e.pre_start_time_reg),'/',MONTH(e.pre_start_time_reg),'/',YEAR(e.pre_start_time_reg)+543 ) p_time_start,\n" +
      "      		CONCAT(CONVERT(TIME(e.pre_end_time_reg),VARCHAR(5)), ' น. ',DAY(e.pre_end_time_reg),'/',MONTH(e.pre_end_time_reg),'/',YEAR(e.pre_end_time_reg)+543) p_time_end,\n" +
      "      	  CONCAT(CONVERT(TIME(e.event_start_time_reg),VARCHAR(5)), ' น. ',DAY(e.event_start_time_reg),'/',MONTH(e.event_start_time_reg),'/',YEAR(e.event_start_time_reg)+543) time_start,\n" +
      "      	  CONCAT(CONVERT(TIME(e.event_end_time_reg),VARCHAR(5)), ' น. ',DAY(e.event_end_time_reg),'/',MONTH(e.event_end_time_reg),'/',YEAR(e.event_end_time_reg)+543) time_end, (\n" +
      "      	\n" +
      "            	SELECT DECODE_ORACLE(COUNT(event_id) , null, 0,COUNT(event_id)) result\n" +
      "            	FROM event_participation\n" +
      "            		WHERE request_status = 1 AND event_id = e.id) members_number,\n" +
      "      					   (CASE  WHEN CURRENT_TIMESTAMP BETWEEN e.pre_start_time_reg AND e.pre_end_time_reg THEN 'เปิดให้ขอเข้าร่วม'\n" +
      "      						 WHEN CURRENT_TIMESTAMP > e.pre_end_time_reg THEN 'ปิดรับการขอเข้าร่วม' \n" +
      "      							ELSE 'ยังไม่เปิดให้ขอเข้าร่วม' END) event_pre_time_status,\n" +
      "      					   (CASE  WHEN CURRENT_TIMESTAMP BETWEEN e.event_start_time_reg AND e.event_end_time_reg THEN 'กิจกรรมกำลังดำเนินการ'\n" +
      "      						 WHEN CURRENT_TIMESTAMP > e.event_end_time_reg THEN 'กิจกรรมจบลงแล้ว'\n" +
      "      							ELSE 'กิจกรรมยังไม่เริ่ม' END) event_time_status,\n" +
      "							(SELECT ABS(DATEDIFF(e1.event_start_time_reg, e1.event_end_time_reg)) AS count_event_date_time\n" +
      "								FROM `event` e1\n" +
      "								WHERE e1.id = e.id) event_count_date\n" +
      "            FROM `event` e\n" +
      "                  INNER JOIN event_role er ON e.event_role_id = er.id\n" +
      "            			INNER JOIN faculty f ON e.faculty_id = f.id\n" +
      "            	 	  INNER JOIN branch b ON e.branch_id = b.id\n" +
      "                  WHERE e.create_status = 1 " +
      sqlEventRole +
      "\n" +
      "            			ORDER BY event_count_date DESC",
    function (err, mostEventCountDate, fields) {
      if (err) {
        res.send({ status: "error", message: err });
        return;
      }
      if (mostEventCountDate.length > 0) {
        res.send({ status: 1, mostEventCountDate });
      }
    }
  );
});

app.listen(62041, () => {
  console.log("CORS-enabled web server listening on port 62041");
});

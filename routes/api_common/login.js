const express = require("express");
const router = express.Router();
const Joi = require("joi");
const Connection = require("../../modules/DataConnect");
const auth = require("../../modules/auth");
const jRes = require("../../modules/JResponse");

router.post("/", (req, res) => {
  let con = Connection.NewConnection();
  let UserID = 0;

  let userLogin;

  try {
    userLogin = {
      cellNo: req.body.cellNo.trim(),
      password: req.body.password,
      passwordHash: auth.hashPassword(req.body.password),
    };
  } catch (e) {
    res.send(jRes.getResponse(0, "Missing registration fields"));
    return;
  }

  con.connect(function (err) {
    if (err) {
      res.send(jRes.getResponse(0, "Login failed"));
      return;
    }

    con.query(
      `SELECT users.UserGUID, users.FullName, users.UserCellNo, users.UserPassword,users.DateRegistered,users.UserTypeID FROM users
        WHERE UserCellNo='${userLogin.cellNo}' AND UserPassword='${userLogin.passwordHash}' LIMIT 1;`,
      function (err, result, fields) {
        if (err) {
          res.send({ status: 0, message: "Invalid Cell Number or Password" });
        } else {
          let userRow = result[0];
          res.send({
            status: 1,
            message: "Login Success",
            session: auth.getJWT({
              id: userRow.UserGUID,
              user: userRow.UserCellNo,
              expire,
            }),
          });
        }
        con.end();
      }
    );
  });
});

module.exports = router;

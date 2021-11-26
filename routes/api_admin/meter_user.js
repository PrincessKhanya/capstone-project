const express = require("express");
const router = express.Router();
const Joi = require("joi");
const Connection = require("../../modules/DataConnect");
const jRes = require("../../modules/JResponse");

// Select Records
router.get("/", (req, res) => {
  let con = Connection.NewConnection();

  con.connect(function (err) {
    if (err) {
      res.send(jRes.getResponse(0, "Could not load meter_user list"));
      return;
    }

    con.query(
      `SELECT MeterUserID, MeterUserGUID, MeterID, UserID, DateAdded 
	 FROM meter_user `,
      function (err, result, fields) {
        if (err) {
          res.send([]);
        } else {
          res.send(result);
        }
        con.end();
      }
    );
  });
});

// List Records
router.get("/list", (req, res) => {
  let con = Connection.NewConnection();

  con.connect(function (err) {
    if (err) {
      res.send(jRes.getResponse(0, "Could not load meter_user list"));
      return;
    }

    con.query(
      `SELECT MeterUserID, MeterUserGUID, MeterID, UserID, DateAdded 
	 FROM meter_user `,
      function (err, result, fields) {
        if (err) {
          res.send({ key: "", show: {}, data: [] });
        } else {
          res.send({
            key: "MeterUserID",
            show: {
              MeterUserGUID: "Meter User GUID",
              MeterID: "Meter ID",
              UserID: "User ID",
              DateAdded: "Date Added",
            },
            data: result,
          });
        }
        con.end();
      }
    );
  });
});

// Select Record
router.get("/:MeterUserID", (req, res) => {
  let con = Connection.NewConnection();
  let iObject = { MeterUserID: req.params.MeterUserID };
  let scheme = Joi.object({
    MeterUserID: Joi.number().integer().required(),
  });

  let sResult = scheme.validate(iObject);

  if (sResult.error !== undefined) {
    res.status(400).send(sResult.error.details[0].message);
    return;
  }

  con.connect(function (err) {
    if (err) {
      res.status(400).send("Could not load meter_user record");
      return;
    }

    con.query(
      `SELECT MeterUserID, MeterUserGUID, MeterID, UserID, DateAdded 
	 FROM meter_user WHERE MeterUserID = ? `,
      [iObject.MeterUserID],
      function (err, result, fields) {
        if (err || result.length < 1) {
          res.status(400).send("Could not load meter_user record");
        } else {
          res.send(result[0]);
        }
        con.end();
      }
    );
  });
});

// Insert Record
router.post("/", (req, res) => {
  let con = Connection.NewConnection();
  let scheme = Joi.object({
    MeterUserGUID: Joi.string().guid().required(),
    MeterID: Joi.number().integer().required(),
    UserID: Joi.number().integer().required(),
    DateAdded: Joi.date().required(),
  });

  let sResult = scheme.validate(req.body);

  if (sResult.error !== undefined) {
    res.status(400).send(sResult.error.details[0].message);
    return;
  }
  let iObject = {
    MeterUserGUID: req.body.MeterUserGUID.trim(),
    MeterID: req.body.MeterID.trim(),
    UserID: req.body.UserID.trim(),
    DateAdded: req.body.DateAdded.trim(),
  };

  con.connect(function (err) {
    if (err) {
      res.status(400).send("Could not save meter_user");
      return;
    }

    con.query(
      `INSERT INTO meter_user(MeterUserGUID, MeterID, UserID, DateAdded) 
		VALUES(?, ?, ?, ?);`,
      [
        iObject.MeterUserGUID,
        iObject.MeterID,
        iObject.UserID,
        iObject.DateAdded,
      ],
      function (err, result, fields) {
        if (err) {
          res.status(400).send("Could not save meter_user");
        } else {
          res.send(jRes.getResponse(1, "meter_user saved"));
        }
        con.end();
      }
    );
  });
});

// Update Record
router.put("/", (req, res) => {
  let con = Connection.NewConnection();
  let scheme = Joi.object({
    MeterUserID: Joi.number().integer().required(),
    MeterUserGUID: Joi.string().guid().required(),
    MeterID: Joi.number().integer().required(),
    UserID: Joi.number().integer().required(),
    DateAdded: Joi.date().required(),
  });

  let sResult = scheme.validate(req.body);

  if (sResult.error !== undefined) {
    res.status(400).send(sResult.error.details[0].message);
    return;
  }
  let iObject = {
    MeterUserID: req.body.MeterUserID.trim(),
    MeterUserGUID: req.body.MeterUserGUID.trim(),
    MeterID: req.body.MeterID.trim(),
    UserID: req.body.UserID.trim(),
    DateAdded: req.body.DateAdded.trim(),
  };

  con.connect(function (err) {
    if (err) {
      res.status(400).send("Could not update meter_user");
      return;
    }

    con.query(
      `UPDATE meter_user SET MeterUserGUID = ?, MeterID = ?, UserID = ?, DateAdded = ? WHERE MeterUserID = ?`,
      [
        iObject.MeterUserGUID,
        iObject.MeterID,
        iObject.UserID,
        iObject.DateAdded,
        iObject.MeterUserID,
      ],
      function (err, result, fields) {
        if (err) {
          res.status(400).send("Could not update meter_user");
        } else {
          res.send(jRes.getResponse(1, "meter_user Updated"));
        }
        con.end();
      }
    );
  });
});

// Delete Record
router.delete("/:MeterUserID", (req, res) => {
  let con = Connection.NewConnection();
  let iObject = { MeterUserID: req.params.MeterUserID };
  let scheme = Joi.object({
    MeterUserID: Joi.number().integer().required(),
  });

  let sResult = scheme.validate(iObject);

  if (sResult.error !== undefined) {
    res.status(400).send(sResult.error.details[0].message);
    return;
  }

  con.connect(function (err) {
    if (err) {
      res.status(400).send("Could not delete meter_user record");
      return;
    }

    con.query(
      `DELETE FROM meter_user WHERE MeterUserID = ? `,
      [iObject.MeterUserID],
      function (err, result, fields) {
        if (err || result.affectedRows < 1) {
          res.status(400).send("Could not delete meter_user record");
        } else {
          res.send(jRes.getResponse(1, "Record Deleted"));
        }
        con.end();
      }
    );
  });
});
module.exports = router;

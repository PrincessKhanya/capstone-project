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
      res.send(jRes.getResponse(0, "Could not load meter_usage list"));
      return;
    }

    con.query(
      `SELECT MeterUsageID, UsageDate, CurrentUsage, DayUsage, MeterID 
	 FROM meter_usage `,
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
      res.send(jRes.getResponse(0, "Could not load meter_usage list"));
      return;
    }

    con.query(
      `SELECT MeterUsageID, UsageDate, CurrentUsage, DayUsage, MeterID 
	 FROM meter_usage `,
      function (err, result, fields) {
        if (err) {
          res.send({ key: "", show: {}, data: [] });
        } else {
          res.send({
            key: "MeterUsageID",
            show: {
              UsageDate: "Usage Date",
              CurrentUsage: "Current Usage",
              DayUsage: "Day Usage",
              MeterID: "Meter ID",
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
router.get("/:MeterUsageID", (req, res) => {
  let con = Connection.NewConnection();
  let iObject = { MeterUsageID: req.params.MeterUsageID };
  let scheme = Joi.object({
    MeterUsageID: Joi.number().integer().required(),
  });

  let sResult = scheme.validate(iObject);

  if (sResult.error !== undefined) {
    res.status(400).send(sResult.error.details[0].message);
    return;
  }

  con.connect(function (err) {
    if (err) {
      res.status(400).send("Could not load meter_usage record");
      return;
    }

    con.query(
      `SELECT MeterUsageID, UsageDate, CurrentUsage, DayUsage, MeterID 
	 FROM meter_usage WHERE MeterUsageID = ? `,
      [iObject.MeterUsageID],
      function (err, result, fields) {
        if (err || result.length < 1) {
          res.status(400).send("Could not load meter_usage record");
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
    UsageDate: Joi.date().required(),
    CurrentUsage: Joi.number().required(),
    DayUsage: Joi.number().required(),
    MeterID: Joi.number().integer().required(),
  });

  let sResult = scheme.validate(req.body);

  if (sResult.error !== undefined) {
    res.status(400).send(sResult.error.details[0].message);
    return;
  }
  let iObject = {
    UsageDate: req.body.UsageDate.trim(),
    CurrentUsage: req.body.CurrentUsage.trim(),
    DayUsage: req.body.DayUsage.trim(),
    MeterID: req.body.MeterID.trim(),
  };

  con.connect(function (err) {
    if (err) {
      res.status(400).send("Could not save meter_usage");
      return;
    }

    con.query(
      `INSERT INTO meter_usage(UsageDate, CurrentUsage, DayUsage, MeterID) 
		VALUES(?, ?, ?, ?);`,
      [
        iObject.UsageDate,
        iObject.CurrentUsage,
        iObject.DayUsage,
        iObject.MeterID,
      ],
      function (err, result, fields) {
        if (err) {
          res.status(400).send("Could not save meter_usage");
        } else {
          res.send(jRes.getResponse(1, "meter_usage saved"));
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
    MeterUsageID: Joi.number().integer().required(),
    UsageDate: Joi.date().required(),
    CurrentUsage: Joi.number().required(),
    DayUsage: Joi.number().required(),
    MeterID: Joi.number().integer().required(),
  });

  let sResult = scheme.validate(req.body);

  if (sResult.error !== undefined) {
    res.status(400).send(sResult.error.details[0].message);
    return;
  }
  let iObject = {
    MeterUsageID: req.body.MeterUsageID.trim(),
    UsageDate: req.body.UsageDate.trim(),
    CurrentUsage: req.body.CurrentUsage.trim(),
    DayUsage: req.body.DayUsage.trim(),
    MeterID: req.body.MeterID.trim(),
  };

  con.connect(function (err) {
    if (err) {
      res.status(400).send("Could not update meter_usage");
      return;
    }

    con.query(
      `UPDATE meter_usage SET UsageDate = ?, CurrentUsage = ?, DayUsage = ?, MeterID = ? WHERE MeterUsageID = ?`,
      [
        iObject.UsageDate,
        iObject.CurrentUsage,
        iObject.DayUsage,
        iObject.MeterID,
        iObject.MeterUsageID,
      ],
      function (err, result, fields) {
        if (err) {
          res.status(400).send("Could not update meter_usage");
        } else {
          res.send(jRes.getResponse(1, "meter_usage Updated"));
        }
        con.end();
      }
    );
  });
});

// Delete Record
router.delete("/:MeterUsageID", (req, res) => {
  let con = Connection.NewConnection();
  let iObject = { MeterUsageID: req.params.MeterUsageID };
  let scheme = Joi.object({
    MeterUsageID: Joi.number().integer().required(),
  });

  let sResult = scheme.validate(iObject);

  if (sResult.error !== undefined) {
    res.status(400).send(sResult.error.details[0].message);
    return;
  }

  con.connect(function (err) {
    if (err) {
      res.status(400).send("Could not delete meter_usage record");
      return;
    }

    con.query(
      `DELETE FROM meter_usage WHERE MeterUsageID = ? `,
      [iObject.MeterUsageID],
      function (err, result, fields) {
        if (err || result.affectedRows < 1) {
          res.status(400).send("Could not delete meter_usage record");
        } else {
          res.send(jRes.getResponse(1, "Record Deleted"));
        }
        con.end();
      }
    );
  });
});
module.exports = router;

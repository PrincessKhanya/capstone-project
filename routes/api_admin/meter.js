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
	  res.send(jRes.getResponse(0, "Could not load meter list"));
	  return;
	}

	con.query(
	`SELECT MeterID, MeterGUID, MeterNo, IDNumber, PassportNumber, RegName, RegLastName 
	 FROM meter `,
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
	  res.send(jRes.getResponse(0, "Could not load meter list"));
	  return;
	}

	con.query(
	`SELECT MeterID, MeterGUID, MeterNo, IDNumber, PassportNumber, RegName, RegLastName 
	 FROM meter `,
	  function (err, result, fields) {
		if (err) {
		  res.send({ key:"", show: {}, data: [] });
		} else {
		  res.send({
		  key: "MeterID",
		  show: { MeterGUID: "Meter GUID", MeterNo: "Meter No", IDNumber: "ID Number", PassportNumber: "Passport Number", RegName: "Reg Name", RegLastName: "Reg Last Name", },
		  data: result,
		  });
		}
		con.end();
	  }
	);
  });
});


// Select Record 
router.get("/:MeterID", (req, res) => 
{
  let con = Connection.NewConnection();
  let iObject = {  MeterID:req.params.MeterID };
  let scheme = Joi.object({
	MeterID: 	Joi.number().integer().required(), 
  });

  let sResult = scheme.validate(iObject);

  if (sResult.error !== undefined) {
	res.status(400).send(sResult.error.details[0].message);
	return;
  }

  con.connect(function (err) {
	if (err) {
	  res.status(400).send("Could not load meter record");
	  return;
	}

	con.query(
	`SELECT MeterID, MeterGUID, MeterNo, IDNumber, PassportNumber, RegName, RegLastName 
	 FROM meter WHERE MeterID = ? `,
	 [ iObject.MeterID ],
	  function (err, result, fields) {
		if (err || result.length<1) {
		  res.status(400).send("Could not load meter record");
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
MeterGUID : 	Joi.string().guid().required(), 
MeterNo : 	Joi.string().min(1).required(), 
IDNumber : 	Joi.string().min(1).required(), 
PassportNumber : 	Joi.string().min(1).required(), 
RegName : 	Joi.string().min(1).required(), 
RegLastName : 	Joi.string().min(1).required(), 
	});
  
	let sResult = scheme.validate(req.body);
  
	if (sResult.error !== undefined) {
	  res.status(400).send(sResult.error.details[0].message);
	  return;
	}
	let iObject = { 
MeterGUID : req.body.MeterGUID.trim(),
MeterNo : req.body.MeterNo.trim(),
IDNumber : req.body.IDNumber.trim(),
PassportNumber : req.body.PassportNumber.trim(),
RegName : req.body.RegName.trim(),
RegLastName : req.body.RegLastName.trim(),
	};
  
	con.connect(function (err) {
	  if (err) {
		res.status(400).send("Could not save meter");
		return;
	  }
  
	  con.query(
		`INSERT INTO meter(MeterGUID, MeterNo, IDNumber, PassportNumber, RegName, RegLastName) 
		VALUES(?, ?, ?, ?, ?, ?);`,
		[iObject.MeterGUID,iObject.MeterNo,iObject.IDNumber,iObject.PassportNumber,iObject.RegName,iObject.RegLastName],
		function (err, result, fields) {
		  if (err) {
			res.status(400).send("Could not save meter");
		  } else {
			res.send(jRes.getResponse(1,"meter saved"));
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
MeterID : 	Joi.number().integer().required(), 
MeterGUID : 	Joi.string().guid().required(), 
MeterNo : 	Joi.string().min(1).required(), 
IDNumber : 	Joi.string().min(1).required(), 
PassportNumber : 	Joi.string().min(1).required(), 
RegName : 	Joi.string().min(1).required(), 
RegLastName : 	Joi.string().min(1).required(), 
	});
  
	let sResult = scheme.validate(req.body);
  
	if (sResult.error !== undefined) {
	  res.status(400).send(sResult.error.details[0].message);
	  return;
	}
	let iObject = { 
MeterID : req.body.MeterID.trim(),
MeterGUID : req.body.MeterGUID.trim(),
MeterNo : req.body.MeterNo.trim(),
IDNumber : req.body.IDNumber.trim(),
PassportNumber : req.body.PassportNumber.trim(),
RegName : req.body.RegName.trim(),
RegLastName : req.body.RegLastName.trim(),
	};
  
	con.connect(function (err) {
	  if (err) {
		res.status(400).send("Could not update meter");
		return;
	  }
  
	  con.query(
		`UPDATE meter SET MeterGUID = ?, MeterNo = ?, IDNumber = ?, PassportNumber = ?, RegName = ?, RegLastName = ? WHERE MeterID = ?`, 
		[iObject.MeterGUID,iObject.MeterNo,iObject.IDNumber,iObject.PassportNumber,iObject.RegName,iObject.RegLastName , iObject.MeterID],
		function (err, result, fields) {
		  if (err) {
			res.status(400).send("Could not update meter");
		  } else {
			res.send(jRes.getResponse(1,"meter Updated"));
		  }
		  con.end();
		}
	  );
	});
  });

// Delete Record 
router.delete("/:MeterID", (req, res) => 
{
  let con = Connection.NewConnection();
  let iObject = {  MeterID:req.params.MeterID };
  let scheme = Joi.object({
	MeterID: 	Joi.number().integer().required(), 
  });

  let sResult = scheme.validate(iObject);

  if (sResult.error !== undefined) {
	res.status(400).send(sResult.error.details[0].message);
	return;
  }

  con.connect(function (err) {
	if (err) {
	  res.status(400).send("Could not delete meter record");
	  return;
	}

	con.query(
	`DELETE FROM meter WHERE MeterID = ? `,
	 [ iObject.MeterID ],
	  function (err, result, fields) {
		if (err || result.affectedRows<1) {
		  res.status(400).send("Could not delete meter record");
		} else {
		  res.send(jRes.getResponse(1,"Record Deleted"));
		}
		con.end();
	  }
	);
  });
});
module.exports = router;


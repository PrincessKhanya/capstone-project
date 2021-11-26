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
	  res.send(jRes.getResponse(0, "Could not load loadshedding list"));
	  return;
	}

	con.query(
	`SELECT SheddingGUID, Stage, SheddingDate, StartTime, EndTime, SuburbID 
	 FROM loadshedding `,
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
	  res.send(jRes.getResponse(0, "Could not load loadshedding list"));
	  return;
	}

	con.query(
	`SELECT SheddingGUID, Stage, SheddingDate, StartTime, EndTime, SuburbID 
	 FROM loadshedding `,
	  function (err, result, fields) {
		if (err) {
		  res.send({ key:"", show: {}, data: [] });
		} else {
		  res.send({
		  key: "SheddingGUID",
		  show: { SheddingGUID: "Shedding GUID", Stage: "Stage", SheddingDate: "Shedding Date", StartTime: "Start Time", EndTime: "End Time", SuburbID: "Suburb ID", },
		  data: result,
		  });
		}
		con.end();
	  }
	);
  });
});


// Select Record 
router.get("/:SheddingGUID", (req, res) => 
{
  let con = Connection.NewConnection();
  let iObject = {  SheddingGUID:req.params.SheddingGUID };
  let scheme = Joi.object({
	SheddingGUID: 	Joi.string().min(1).required(), 
  });

  let sResult = scheme.validate(iObject);

  if (sResult.error !== undefined) {
	res.status(400).send(sResult.error.details[0].message);
	return;
  }

  con.connect(function (err) {
	if (err) {
	  res.status(400).send("Could not load loadshedding record");
	  return;
	}

	con.query(
	`SELECT SheddingGUID, Stage, SheddingDate, StartTime, EndTime, SuburbID 
	 FROM loadshedding WHERE SheddingGUID = ? `,
	 [ iObject.SheddingGUID ],
	  function (err, result, fields) {
		if (err || result.length<1) {
		  res.status(400).send("Could not load loadshedding record");
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
SheddingGUID : 	Joi.string().min(1).required(), 
Stage : 	Joi.number().integer().required(), 
SheddingDate : 	Joi.date().required(), 
StartTime : 	Joi.date().required(), 
EndTime : 	Joi.date().required(), 
SuburbID : 	Joi.number().integer().required(), 
	});
  
	let sResult = scheme.validate(req.body);
  
	if (sResult.error !== undefined) {
	  res.status(400).send(sResult.error.details[0].message);
	  return;
	}
	let iObject = { 
SheddingGUID : req.body.SheddingGUID.trim(),
Stage : req.body.Stage.trim(),
SheddingDate : req.body.SheddingDate.trim(),
StartTime : req.body.StartTime.trim(),
EndTime : req.body.EndTime.trim(),
SuburbID : req.body.SuburbID.trim(),
	};
  
	con.connect(function (err) {
	  if (err) {
		res.status(400).send("Could not save loadshedding");
		return;
	  }
  
	  con.query(
		`INSERT INTO loadshedding(SheddingGUID, Stage, SheddingDate, StartTime, EndTime, SuburbID) 
		VALUES(?, ?, ?, ?, ?, ?);`,
		[iObject.SheddingGUID,iObject.Stage,iObject.SheddingDate,iObject.StartTime,iObject.EndTime,iObject.SuburbID],
		function (err, result, fields) {
		  if (err) {
			res.status(400).send("Could not save loadshedding");
		  } else {
			res.send(jRes.getResponse(1,"loadshedding saved"));
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
SheddingGUID : 	Joi.string().min(1).required(), 
Stage : 	Joi.number().integer().required(), 
SheddingDate : 	Joi.date().required(), 
StartTime : 	Joi.date().required(), 
EndTime : 	Joi.date().required(), 
SuburbID : 	Joi.number().integer().required(), 
	});
  
	let sResult = scheme.validate(req.body);
  
	if (sResult.error !== undefined) {
	  res.status(400).send(sResult.error.details[0].message);
	  return;
	}
	let iObject = { 
SheddingGUID : req.body.SheddingGUID.trim(),
Stage : req.body.Stage.trim(),
SheddingDate : req.body.SheddingDate.trim(),
StartTime : req.body.StartTime.trim(),
EndTime : req.body.EndTime.trim(),
SuburbID : req.body.SuburbID.trim(),
	};
  
	con.connect(function (err) {
	  if (err) {
		res.status(400).send("Could not update loadshedding");
		return;
	  }
  
	  con.query(
		`UPDATE loadshedding SET SheddingGUID = ?, Stage = ?, SheddingDate = ?, StartTime = ?, EndTime = ?, SuburbID = ? WHERE SheddingGUID = ?`, 
		[iObject.SheddingGUID,iObject.Stage,iObject.SheddingDate,iObject.StartTime,iObject.EndTime,iObject.SuburbID , iObject.SheddingGUID],
		function (err, result, fields) {
		  if (err) {
			res.status(400).send("Could not update loadshedding");
		  } else {
			res.send(jRes.getResponse(1,"loadshedding Updated"));
		  }
		  con.end();
		}
	  );
	});
  });

// Delete Record 
router.delete("/:SheddingGUID", (req, res) => 
{
  let con = Connection.NewConnection();
  let iObject = {  SheddingGUID:req.params.SheddingGUID };
  let scheme = Joi.object({
	SheddingGUID: 	Joi.string().min(1).required(), 
  });

  let sResult = scheme.validate(iObject);

  if (sResult.error !== undefined) {
	res.status(400).send(sResult.error.details[0].message);
	return;
  }

  con.connect(function (err) {
	if (err) {
	  res.status(400).send("Could not delete loadshedding record");
	  return;
	}

	con.query(
	`DELETE FROM loadshedding WHERE SheddingGUID = ? `,
	 [ iObject.SheddingGUID ],
	  function (err, result, fields) {
		if (err || result.affectedRows<1) {
		  res.status(400).send("Could not delete loadshedding record");
		} else {
		  res.send(jRes.getResponse(1,"Record Deleted"));
		}
		con.end();
	  }
	);
  });
});
module.exports = router;


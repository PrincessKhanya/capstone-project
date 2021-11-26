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
	  res.send(jRes.getResponse(0, "Could not load loadshedding_subscription list"));
	  return;
	}

	con.query(
	`SELECT SheddingGUID, DateAdded, SuburbID, UserID 
	 FROM loadshedding_subscription `,
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
	  res.send(jRes.getResponse(0, "Could not load loadshedding_subscription list"));
	  return;
	}

	con.query(
	`SELECT SheddingGUID, DateAdded, SuburbID, UserID 
	 FROM loadshedding_subscription `,
	  function (err, result, fields) {
		if (err) {
		  res.send({ key:"", show: {}, data: [] });
		} else {
		  res.send({
		  key: "SheddingGUID",
		  show: { SheddingGUID: "Shedding GUID", DateAdded: "Date Added", SuburbID: "Suburb ID", UserID: "User ID", },
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
	  res.status(400).send("Could not load loadshedding_subscription record");
	  return;
	}

	con.query(
	`SELECT SheddingGUID, DateAdded, SuburbID, UserID 
	 FROM loadshedding_subscription WHERE SheddingGUID = ? `,
	 [ iObject.SheddingGUID ],
	  function (err, result, fields) {
		if (err || result.length<1) {
		  res.status(400).send("Could not load loadshedding_subscription record");
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
DateAdded : 	Joi.date().required(), 
SuburbID : 	Joi.number().integer().required(), 
UserID : 	Joi.number().integer().required(), 
	});
  
	let sResult = scheme.validate(req.body);
  
	if (sResult.error !== undefined) {
	  res.status(400).send(sResult.error.details[0].message);
	  return;
	}
	let iObject = { 
SheddingGUID : req.body.SheddingGUID.trim(),
DateAdded : req.body.DateAdded.trim(),
SuburbID : req.body.SuburbID.trim(),
UserID : req.body.UserID.trim(),
	};
  
	con.connect(function (err) {
	  if (err) {
		res.status(400).send("Could not save loadshedding_subscription");
		return;
	  }
  
	  con.query(
		`INSERT INTO loadshedding_subscription(SheddingGUID, DateAdded, SuburbID, UserID) 
		VALUES(?, ?, ?, ?);`,
		[iObject.SheddingGUID,iObject.DateAdded,iObject.SuburbID,iObject.UserID],
		function (err, result, fields) {
		  if (err) {
			res.status(400).send("Could not save loadshedding_subscription");
		  } else {
			res.send(jRes.getResponse(1,"loadshedding_subscription saved"));
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
DateAdded : 	Joi.date().required(), 
SuburbID : 	Joi.number().integer().required(), 
UserID : 	Joi.number().integer().required(), 
	});
  
	let sResult = scheme.validate(req.body);
  
	if (sResult.error !== undefined) {
	  res.status(400).send(sResult.error.details[0].message);
	  return;
	}
	let iObject = { 
SheddingGUID : req.body.SheddingGUID.trim(),
DateAdded : req.body.DateAdded.trim(),
SuburbID : req.body.SuburbID.trim(),
UserID : req.body.UserID.trim(),
	};
  
	con.connect(function (err) {
	  if (err) {
		res.status(400).send("Could not update loadshedding_subscription");
		return;
	  }
  
	  con.query(
		`UPDATE loadshedding_subscription SET SheddingGUID = ?, DateAdded = ?, SuburbID = ?, UserID = ? WHERE SheddingGUID = ?`, 
		[iObject.SheddingGUID,iObject.DateAdded,iObject.SuburbID,iObject.UserID , iObject.SheddingGUID],
		function (err, result, fields) {
		  if (err) {
			res.status(400).send("Could not update loadshedding_subscription");
		  } else {
			res.send(jRes.getResponse(1,"loadshedding_subscription Updated"));
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
	  res.status(400).send("Could not delete loadshedding_subscription record");
	  return;
	}

	con.query(
	`DELETE FROM loadshedding_subscription WHERE SheddingGUID = ? `,
	 [ iObject.SheddingGUID ],
	  function (err, result, fields) {
		if (err || result.affectedRows<1) {
		  res.status(400).send("Could not delete loadshedding_subscription record");
		} else {
		  res.send(jRes.getResponse(1,"Record Deleted"));
		}
		con.end();
	  }
	);
  });
});
module.exports = router;


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
	  res.send(jRes.getResponse(0, "Could not load suburb list"));
	  return;
	}

	con.query(
	`SELECT SuburbID, SuburbName, CityID 
	 FROM suburb `,
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
	  res.send(jRes.getResponse(0, "Could not load suburb list"));
	  return;
	}

	con.query(
	`SELECT SuburbID, SuburbName, CityID 
	 FROM suburb `,
	  function (err, result, fields) {
		if (err) {
		  res.send({ key:"", show: {}, data: [] });
		} else {
		  res.send({
		  key: "SuburbID",
		  show: { SuburbName: "Suburb Name", CityID: "City ID", },
		  data: result,
		  });
		}
		con.end();
	  }
	);
  });
});


// Select Record 
router.get("/:SuburbID", (req, res) => 
{
  let con = Connection.NewConnection();
  let iObject = {  SuburbID:req.params.SuburbID };
  let scheme = Joi.object({
	SuburbID: 	Joi.number().integer().required(), 
  });

  let sResult = scheme.validate(iObject);

  if (sResult.error !== undefined) {
	res.status(400).send(sResult.error.details[0].message);
	return;
  }

  con.connect(function (err) {
	if (err) {
	  res.status(400).send("Could not load suburb record");
	  return;
	}

	con.query(
	`SELECT SuburbID, SuburbName, CityID 
	 FROM suburb WHERE SuburbID = ? `,
	 [ iObject.SuburbID ],
	  function (err, result, fields) {
		if (err || result.length<1) {
		  res.status(400).send("Could not load suburb record");
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
SuburbName : 	Joi.string().min(1).required(), 
CityID : 	Joi.number().integer().required(), 
	});
  
	let sResult = scheme.validate(req.body);
  
	if (sResult.error !== undefined) {
	  res.status(400).send(sResult.error.details[0].message);
	  return;
	}
	let iObject = { 
SuburbName : req.body.SuburbName.trim(),
CityID : req.body.CityID.trim(),
	};
  
	con.connect(function (err) {
	  if (err) {
		res.status(400).send("Could not save suburb");
		return;
	  }
  
	  con.query(
		`INSERT INTO suburb(SuburbName, CityID) 
		VALUES(?, ?);`,
		[iObject.SuburbName,iObject.CityID],
		function (err, result, fields) {
		  if (err) {
			res.status(400).send("Could not save suburb");
		  } else {
			res.send(jRes.getResponse(1,"suburb saved"));
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
SuburbID : 	Joi.number().integer().required(), 
SuburbName : 	Joi.string().min(1).required(), 
CityID : 	Joi.number().integer().required(), 
	});
  
	let sResult = scheme.validate(req.body);
  
	if (sResult.error !== undefined) {
	  res.status(400).send(sResult.error.details[0].message);
	  return;
	}
	let iObject = { 
SuburbID : req.body.SuburbID.trim(),
SuburbName : req.body.SuburbName.trim(),
CityID : req.body.CityID.trim(),
	};
  
	con.connect(function (err) {
	  if (err) {
		res.status(400).send("Could not update suburb");
		return;
	  }
  
	  con.query(
		`UPDATE suburb SET SuburbName = ?, CityID = ? WHERE SuburbID = ?`, 
		[iObject.SuburbName,iObject.CityID , iObject.SuburbID],
		function (err, result, fields) {
		  if (err) {
			res.status(400).send("Could not update suburb");
		  } else {
			res.send(jRes.getResponse(1,"suburb Updated"));
		  }
		  con.end();
		}
	  );
	});
  });

// Delete Record 
router.delete("/:SuburbID", (req, res) => 
{
  let con = Connection.NewConnection();
  let iObject = {  SuburbID:req.params.SuburbID };
  let scheme = Joi.object({
	SuburbID: 	Joi.number().integer().required(), 
  });

  let sResult = scheme.validate(iObject);

  if (sResult.error !== undefined) {
	res.status(400).send(sResult.error.details[0].message);
	return;
  }

  con.connect(function (err) {
	if (err) {
	  res.status(400).send("Could not delete suburb record");
	  return;
	}

	con.query(
	`DELETE FROM suburb WHERE SuburbID = ? `,
	 [ iObject.SuburbID ],
	  function (err, result, fields) {
		if (err || result.affectedRows<1) {
		  res.status(400).send("Could not delete suburb record");
		} else {
		  res.send(jRes.getResponse(1,"Record Deleted"));
		}
		con.end();
	  }
	);
  });
});
module.exports = router;


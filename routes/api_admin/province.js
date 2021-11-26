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
	  res.send(jRes.getResponse(0, "Could not load province list"));
	  return;
	}

	con.query(
	`SELECT ProvinceID, ProvinceName 
	 FROM province `,
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
	  res.send(jRes.getResponse(0, "Could not load province list"));
	  return;
	}

	con.query(
	`SELECT ProvinceID, ProvinceName 
	 FROM province `,
	  function (err, result, fields) {
		if (err) {
		  res.send({ key:"", show: {}, data: [] });
		} else {
		  res.send({
		  key: "ProvinceID",
		  show: { ProvinceID: "Province ID", ProvinceName: "Province Name", },
		  data: result,
		  });
		}
		con.end();
	  }
	);
  });
});


// Select Record 
router.get("/:ProvinceID", (req, res) => 
{
  let con = Connection.NewConnection();
  let iObject = {  ProvinceID:req.params.ProvinceID };
  let scheme = Joi.object({
	ProvinceID: 	Joi.number().integer().required(), 
  });

  let sResult = scheme.validate(iObject);

  if (sResult.error !== undefined) {
	res.status(400).send(sResult.error.details[0].message);
	return;
  }

  con.connect(function (err) {
	if (err) {
	  res.status(400).send("Could not load province record");
	  return;
	}

	con.query(
	`SELECT ProvinceID, ProvinceName 
	 FROM province WHERE ProvinceID = ? `,
	 [ iObject.ProvinceID ],
	  function (err, result, fields) {
		if (err || result.length<1) {
		  res.status(400).send("Could not load province record");
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
ProvinceID : 	Joi.number().integer().required(), 
ProvinceName : 	Joi.string().min(1).required(), 
	});
  
	let sResult = scheme.validate(req.body);
  
	if (sResult.error !== undefined) {
	  res.status(400).send(sResult.error.details[0].message);
	  return;
	}
	let iObject = { 
ProvinceID : req.body.ProvinceID.trim(),
ProvinceName : req.body.ProvinceName.trim(),
	};
  
	con.connect(function (err) {
	  if (err) {
		res.status(400).send("Could not save province");
		return;
	  }
  
	  con.query(
		`INSERT INTO province(ProvinceID, ProvinceName) 
		VALUES(?, ?);`,
		[iObject.ProvinceID,iObject.ProvinceName],
		function (err, result, fields) {
		  if (err) {
			res.status(400).send("Could not save province");
		  } else {
			res.send(jRes.getResponse(1,"province saved"));
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
ProvinceID : 	Joi.number().integer().required(), 
ProvinceName : 	Joi.string().min(1).required(), 
	});
  
	let sResult = scheme.validate(req.body);
  
	if (sResult.error !== undefined) {
	  res.status(400).send(sResult.error.details[0].message);
	  return;
	}
	let iObject = { 
ProvinceID : req.body.ProvinceID.trim(),
ProvinceName : req.body.ProvinceName.trim(),
	};
  
	con.connect(function (err) {
	  if (err) {
		res.status(400).send("Could not update province");
		return;
	  }
  
	  con.query(
		`UPDATE province SET ProvinceID = ?, ProvinceName = ? WHERE ProvinceID = ?`, 
		[iObject.ProvinceID,iObject.ProvinceName , iObject.ProvinceID],
		function (err, result, fields) {
		  if (err) {
			res.status(400).send("Could not update province");
		  } else {
			res.send(jRes.getResponse(1,"province Updated"));
		  }
		  con.end();
		}
	  );
	});
  });

// Delete Record 
router.delete("/:ProvinceID", (req, res) => 
{
  let con = Connection.NewConnection();
  let iObject = {  ProvinceID:req.params.ProvinceID };
  let scheme = Joi.object({
	ProvinceID: 	Joi.number().integer().required(), 
  });

  let sResult = scheme.validate(iObject);

  if (sResult.error !== undefined) {
	res.status(400).send(sResult.error.details[0].message);
	return;
  }

  con.connect(function (err) {
	if (err) {
	  res.status(400).send("Could not delete province record");
	  return;
	}

	con.query(
	`DELETE FROM province WHERE ProvinceID = ? `,
	 [ iObject.ProvinceID ],
	  function (err, result, fields) {
		if (err || result.affectedRows<1) {
		  res.status(400).send("Could not delete province record");
		} else {
		  res.send(jRes.getResponse(1,"Record Deleted"));
		}
		con.end();
	  }
	);
  });
});
module.exports = router;


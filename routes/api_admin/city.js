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
	  res.send(jRes.getResponse(0, "Could not load city list"));
	  return;
	}

	con.query(
	`SELECT CityID, CityName, ProvinceID 
	 FROM city `,
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
	  res.send(jRes.getResponse(0, "Could not load city list"));
	  return;
	}

	con.query(
	`SELECT CityID, CityName, ProvinceID 
	 FROM city `,
	  function (err, result, fields) {
		if (err) {
		  res.send({ key:"", show: {}, data: [] });
		} else {
		  res.send({
		  key: "CityID",
		  show: { CityName: "City Name", ProvinceID: "Province ID", },
		  data: result,
		  });
		}
		con.end();
	  }
	);
  });
});


// Select Record 
router.get("/:CityID", (req, res) => 
{
  let con = Connection.NewConnection();
  let iObject = {  CityID:req.params.CityID };
  let scheme = Joi.object({
	CityID: 	Joi.number().integer().required(), 
  });

  let sResult = scheme.validate(iObject);

  if (sResult.error !== undefined) {
	res.status(400).send(sResult.error.details[0].message);
	return;
  }

  con.connect(function (err) {
	if (err) {
	  res.status(400).send("Could not load city record");
	  return;
	}

	con.query(
	`SELECT CityID, CityName, ProvinceID 
	 FROM city WHERE CityID = ? `,
	 [ iObject.CityID ],
	  function (err, result, fields) {
		if (err || result.length<1) {
		  res.status(400).send("Could not load city record");
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
CityName : 	Joi.string().min(1).required(), 
ProvinceID : 	Joi.number().integer().required(), 
	});
  
	let sResult = scheme.validate(req.body);
  
	if (sResult.error !== undefined) {
	  res.status(400).send(sResult.error.details[0].message);
	  return;
	}
	let iObject = { 
CityName : req.body.CityName.trim(),
ProvinceID : req.body.ProvinceID.trim(),
	};
  
	con.connect(function (err) {
	  if (err) {
		res.status(400).send("Could not save city");
		return;
	  }
  
	  con.query(
		`INSERT INTO city(CityName, ProvinceID) 
		VALUES(?, ?);`,
		[iObject.CityName,iObject.ProvinceID],
		function (err, result, fields) {
		  if (err) {
			res.status(400).send("Could not save city");
		  } else {
			res.send(jRes.getResponse(1,"city saved"));
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
CityID : 	Joi.number().integer().required(), 
CityName : 	Joi.string().min(1).required(), 
ProvinceID : 	Joi.number().integer().required(), 
	});
  
	let sResult = scheme.validate(req.body);
  
	if (sResult.error !== undefined) {
	  res.status(400).send(sResult.error.details[0].message);
	  return;
	}
	let iObject = { 
CityID : req.body.CityID.trim(),
CityName : req.body.CityName.trim(),
ProvinceID : req.body.ProvinceID.trim(),
	};
  
	con.connect(function (err) {
	  if (err) {
		res.status(400).send("Could not update city");
		return;
	  }
  
	  con.query(
		`UPDATE city SET CityName = ?, ProvinceID = ? WHERE CityID = ?`, 
		[iObject.CityName,iObject.ProvinceID , iObject.CityID],
		function (err, result, fields) {
		  if (err) {
			res.status(400).send("Could not update city");
		  } else {
			res.send(jRes.getResponse(1,"city Updated"));
		  }
		  con.end();
		}
	  );
	});
  });

// Delete Record 
router.delete("/:CityID", (req, res) => 
{
  let con = Connection.NewConnection();
  let iObject = {  CityID:req.params.CityID };
  let scheme = Joi.object({
	CityID: 	Joi.number().integer().required(), 
  });

  let sResult = scheme.validate(iObject);

  if (sResult.error !== undefined) {
	res.status(400).send(sResult.error.details[0].message);
	return;
  }

  con.connect(function (err) {
	if (err) {
	  res.status(400).send("Could not delete city record");
	  return;
	}

	con.query(
	`DELETE FROM city WHERE CityID = ? `,
	 [ iObject.CityID ],
	  function (err, result, fields) {
		if (err || result.affectedRows<1) {
		  res.status(400).send("Could not delete city record");
		} else {
		  res.send(jRes.getResponse(1,"Record Deleted"));
		}
		con.end();
	  }
	);
  });
});
module.exports = router;


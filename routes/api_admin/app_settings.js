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
	  res.send(jRes.getResponse(0, "Could not load app_settings list"));
	  return;
	}

	con.query(
	`SELECT SettingID, SettingName, SettingValue 
	 FROM app_settings `,
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
	  res.send(jRes.getResponse(0, "Could not load app_settings list"));
	  return;
	}

	con.query(
	`SELECT SettingID, SettingName, SettingValue 
	 FROM app_settings `,
	  function (err, result, fields) {
		if (err) {
		  res.send({ key:"", show: {}, data: [] });
		} else {
		  res.send({
		  key: "SettingID",
		  show: { SettingName: "Setting Name", SettingValue: "Setting Value", },
		  data: result,
		  });
		}
		con.end();
	  }
	);
  });
});


// Select Record 
router.get("/:SettingID", (req, res) => 
{
  let con = Connection.NewConnection();
  let iObject = {  SettingID:req.params.SettingID };
  let scheme = Joi.object({
	SettingID: 	Joi.number().integer().required(), 
  });

  let sResult = scheme.validate(iObject);

  if (sResult.error !== undefined) {
	res.status(400).send(sResult.error.details[0].message);
	return;
  }

  con.connect(function (err) {
	if (err) {
	  res.status(400).send("Could not load app_settings record");
	  return;
	}

	con.query(
	`SELECT SettingID, SettingName, SettingValue 
	 FROM app_settings WHERE SettingID = ? `,
	 [ iObject.SettingID ],
	  function (err, result, fields) {
		if (err || result.length<1) {
		  res.status(400).send("Could not load app_settings record");
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
SettingName : 	Joi.string().min(1).required(), 
SettingValue : 	Joi.string().min(1).required(), 
	});
  
	let sResult = scheme.validate(req.body);
  
	if (sResult.error !== undefined) {
	  res.status(400).send(sResult.error.details[0].message);
	  return;
	}
	let iObject = { 
SettingName : req.body.SettingName.trim(),
SettingValue : req.body.SettingValue.trim(),
	};
  
	con.connect(function (err) {
	  if (err) {
		res.status(400).send("Could not save app_settings");
		return;
	  }
  
	  con.query(
		`INSERT INTO app_settings(SettingName, SettingValue) 
		VALUES(?, ?);`,
		[iObject.SettingName,iObject.SettingValue],
		function (err, result, fields) {
		  if (err) {
			res.status(400).send("Could not save app_settings");
		  } else {
			res.send(jRes.getResponse(1,"app_settings saved"));
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
SettingID : 	Joi.number().integer().required(), 
SettingName : 	Joi.string().min(1).required(), 
SettingValue : 	Joi.string().min(1).required(), 
	});
  
	let sResult = scheme.validate(req.body);
  
	if (sResult.error !== undefined) {
	  res.status(400).send(sResult.error.details[0].message);
	  return;
	}
	let iObject = { 
SettingID : req.body.SettingID.trim(),
SettingName : req.body.SettingName.trim(),
SettingValue : req.body.SettingValue.trim(),
	};
  
	con.connect(function (err) {
	  if (err) {
		res.status(400).send("Could not update app_settings");
		return;
	  }
  
	  con.query(
		`UPDATE app_settings SET SettingName = ?, SettingValue = ? WHERE SettingID = ?`, 
		[iObject.SettingName,iObject.SettingValue , iObject.SettingID],
		function (err, result, fields) {
		  if (err) {
			res.status(400).send("Could not update app_settings");
		  } else {
			res.send(jRes.getResponse(1,"app_settings Updated"));
		  }
		  con.end();
		}
	  );
	});
  });

// Delete Record 
router.delete("/:SettingID", (req, res) => 
{
  let con = Connection.NewConnection();
  let iObject = {  SettingID:req.params.SettingID };
  let scheme = Joi.object({
	SettingID: 	Joi.number().integer().required(), 
  });

  let sResult = scheme.validate(iObject);

  if (sResult.error !== undefined) {
	res.status(400).send(sResult.error.details[0].message);
	return;
  }

  con.connect(function (err) {
	if (err) {
	  res.status(400).send("Could not delete app_settings record");
	  return;
	}

	con.query(
	`DELETE FROM app_settings WHERE SettingID = ? `,
	 [ iObject.SettingID ],
	  function (err, result, fields) {
		if (err || result.affectedRows<1) {
		  res.status(400).send("Could not delete app_settings record");
		} else {
		  res.send(jRes.getResponse(1,"Record Deleted"));
		}
		con.end();
	  }
	);
  });
});
module.exports = router;


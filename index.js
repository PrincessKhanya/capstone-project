const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { engine } = require("express-handlebars");

const Connection = require("./modules/DataConnect");

const PORT = process.env.PORT || 8081;
require("dotenv").config();

app.use(express.json());
//app.use(express.urlencoded());

app.set("view engine", "hbs");
app.engine(
  "hbs",
  engine({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDi: __dirname + "/views/layouts/",
  })
);
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());
/*app.use("/api/province", require("./routes/api_common/province"));
app.use("/api/city", require("./routes/api_common/city"));
app.use("/api/suburb", require("./routes/api_common/suburb"));*/

app.use("/api/login", require("./routes/api_common/login"));
app.use("/api/register", require("./routes/api_common/register"));

// Admin Routes

app.get("/", (req, res) => {
  res.render("index", { title: "Home Page", condition: false });
});

app.get("/about/", (req, res) => {
  res.render("common/about", { title: "About", condition: false });
});

app.get("/register/", (req, res) => {
  res.render("register", { title: "Register Account", condition: false });
});

app.get("/admin/", (req, res) => {
  res.render("admin/index", { title: "Admin Panel", condition: false });
});

app.get("/meter_usage/", (req, res) => {
  res.render("common/meter_usage", { title: "Meter Usage", condition: false });
});

app.get("/meter_billing/", (req, res) => {
  res.render("common/meter_billing", {
    title: "Meter Billing",
    condition: false,
  });
});

app.use("/api/meter_usage", require("./routes/api_common/meter_usage"));
app.use("/api/meter_billing", require("./routes/api_common/meter_billing"));

app.get("/dashboard/", (req, res) => {
  let userID = 1;

  let dashSql = `
  SELECT 
  IFNULL( (SELECT meter_usage.CurrentUsage 
  FROM meter_usage 
  INNER JOIN meter_user ON meter_usage.MeterID=meter_user.MeterID 
  WHERE meter_user.UserID=${userID} ORDER BY meter_usage.UsageDate DESC LIMIT 1),0) AS 'usage',

  IFNULL( (SELECT CONCAT(UnitsPurchased,' Units - ', 'for  R ',AmountUsed,' - ',DATE_FORMAT(DateOfPurchase,'%d %M %Y'))
  FROM meter_billing 
  INNER JOIN meter_user ON meter_billing.MeterID=meter_user.MeterID 
  WHERE meter_user.UserID=${userID} ORDER BY meter_billing.DateOfPurchase DESC LIMIT 1),'No billing') AS 'billing',

  IFNULL((SELECT SettingValue from app_settings WHERE  SettingName='load_shedding_stage' LIMIT 1),0) as 'loadshedding'`;
  let con = Connection.NewConnection();

  con.connect(function (err) {
    if (err) {
      res.status(404).send("Not found");
      return;
    }

    con.query(dashSql, function (err, result, fields) {
      if (err) {
        res.status(404).send("Not found");
      } else {
        let dashValue = result[0];

        res.render("common/dashboard", {
          title: "Dashboard Panel",
          dashData: {
            usage: dashValue.usage,
            loadshedding:
              parseInt(dashValue.loadshedding) > 0
                ? "Load Shedding Stage " + dashValue.loadshedding
                : "No load Shedding",
            billing: dashValue.billing,
          },
          condition: false,
        });
      }
      con.end();
    });
  });
});

// admin view + api routes
app.use("/api/admin/app_settings", require("./routes/api_admin/app_settings"));
app.use("/admin/app_settings", require("./routes/view_admin/app_settings"));

app.use("/api/admin/city", require("./routes/api_admin/city"));
app.use("/admin/city", require("./routes/view_admin/city"));

app.use("/api/admin/loadshedding", require("./routes/api_admin/loadshedding"));
app.use("/admin/loadshedding", require("./routes/view_admin/loadshedding"));

app.use(
  "/api/admin/loadshedding_subscription",
  require("./routes/api_admin/loadshedding_subscription")
);
app.use(
  "/admin/loadshedding_subscription",
  require("./routes/view_admin/loadshedding_subscription")
);

app.use("/api/admin/meter", require("./routes/api_admin/meter"));
app.use("/admin/meter", require("./routes/view_admin/meter"));

app.use(
  "/api/admin/meter_billing",
  require("./routes/api_admin/meter_billing")
);
app.use("/admin/meter_billing", require("./routes/view_admin/meter_billing"));

app.use("/api/admin/meter_usage", require("./routes/api_admin/meter_usage"));
app.use("/admin/meter_usage", require("./routes/view_admin/meter_usage"));

app.use("/api/admin/meter_user", require("./routes/api_admin/meter_user"));
app.use("/admin/meter_user", require("./routes/view_admin/meter_user"));

app.use("/api/admin/province", require("./routes/api_admin/province"));
app.use("/admin/province", require("./routes/view_admin/province"));

app.use("/api/admin/suburb", require("./routes/api_admin/suburb"));
app.use("/admin/suburb", require("./routes/view_admin/suburb"));

app.use("/api/admin/user_type", require("./routes/api_admin/user_type"));
app.use("/admin/user_type", require("./routes/view_admin/user_type"));

app.use("/api/admin/users", require("./routes/api_admin/users"));
app.use("/admin/users", require("./routes/view_admin/users"));

app.listen(PORT);

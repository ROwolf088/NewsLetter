let express = require("express");
let app = express(); //new instance of express
const request = require("request");
let bodyParser = require("body-parser");

let https = require("https");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true })); //tell app to use it

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);

  const url = "https://us1.api.mailchimp.com/3.0/lists/e73d3d5788";

  const options = {
    method: "POST",
    auth: "rohit:59a9338f35b49af4d1aae882b153a25c-us1",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("running on port 3000");
});

//API key
// 016cc03ac22477dc67311200d8a4bf9d-us1

//List id
// e73d3d5788

const https = require("follow-redirects").https;
const fs = require("fs");
let currentAuthToken = process.env.MOMO_AUTH_TOKEN;

const saveConfig = (authToken) => {
  try {
    var data = fs.readFileSync(".env", { encoding: "utf8", flag: "r" });
    console.log({ authToken, currentAuthToken });
    data = data.replace(
      "MOMO_AUTH_TOKEN=" + currentAuthToken,
      "MOMO_AUTH_TOKEN=" + authToken
    );
    currentAuthToken = authToken;
    fs.writeFileSync(".env", data);
  } catch (error) {
    console.log({ error });
  }
};

setInterval(() => {
  var options = {
    method: "POST",
    hostname: process.env.HOST_NAME_1,
    path: "/public/login",
    headers: {
      "Content-Type": "text/plain",
    },
    maxRedirects: 20,
  };

  var req = https.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    // res.on("end", function (chunk) {
    //   var body = Buffer.concat(chunks);
    //   res_in_json = JSON.parse(body.toString());
    //   saveConfig(res_in_json.extra.AUTH_TOKEN);
    // });

    res.on("error", function (error) {
      console.error(error);
    });
  });

  var postData = `{\r\n\t\"user\": \"0358631412\",\r\n\t\"pass\": \"${process.env.MOMO_PASSWORD}\",\r\n\t\"msgType\": \"USER_LOGIN_MSG\",\r\n\t\"momoMsg\": {\r\n\t\t\"_class\": \"mservice.backend.entity.msg.LoginMsg\",\r\n\t\t\"isSetup\": false\r\n\t},\r\n\t\"extra\": {\r\n\t\t\"pHash\": \"+j6epxVd6MyIVFoIdSYZEwl5NKKgU0LEcTVs6/EgE+c1JWlUk/z4W/y+9SsMeb2+dlODczfaR/WXqB2hAgdmfHhbayxIXTye1MAzxiTwDOc=\",\r\n\t\t\"IDFA\": \"\",\r\n\t\t\"SIMULATOR\": true,\r\n\t\t\"TOKEN\": \"ctaI32nlRQqQ_zcFN__4wY:APA91bHgbXbtD6HqYBuFM2TnLLNnzAnbeE-eK1TUojqpW6TBo9gX9w2LNDEMsSYbeKDpJvgvQru25_YSca-5hR_ocifZX9zvjWEvneEmVBsXRCscZPUZokjsb0EID97U_pEd19O53PWW\",\r\n\t\t\"ONESIGNAL_TOKEN\": \"ctaI32nlRQqQ_zcFN__4wY:APA91bHgbXbtD6HqYBuFM2TnLLNnzAnbeE-eK1TUojqpW6TBo9gX9w2LNDEMsSYbeKDpJvgvQru25_YSca-5hR_ocifZX9zvjWEvneEmVBsXRCscZPUZokjsb0EID97U_pEd19O53PWW\",\r\n\t\t\"SECUREID\": \"73e720be6985ac52\",\r\n\t\t\"MODELID\": \"ec6dee5756fcc5627369b6875b27802b7e506bae41d33205c2f20492859eae58\",\r\n\t\t\"DEVICE_TOKEN\": \"\",\r\n\t\t\"checkSum\": \"1K2vc1iHr8e4d1TlKVqUiCOsIB3ipAgeO+fD0Odwhnm1PjidVLuzA6B+gyRxcBq/Cyn2v3iNayiCPlXq1BiPYg==\"\r\n\t},\r\n\t\"appVer\": 40060,\r\n\t\"appCode\": \"4.0.6\",\r\n\t\"lang\": \"vi\",\r\n\t\"deviceOS\": \"android\",\r\n\t\"channel\": \"APP\",\r\n\t\"buildNumber\": 0,\r\n\t\"appId\": \"vn.momo.platform\",\r\n\t\"cmdId\": \"1667610170005000000\",\r\n\t\"time\": 1667610170005\r\n}`;

  req.write(postData.toString());

  req.end();
}, 3600000);

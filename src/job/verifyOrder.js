const https = require("follow-redirects").https;
const fs = require("fs");
const Order = require("../models/order");
const Product = require("../models/product");
let lastVerificationTimestamp = parseInt(
  process.env.LAST_VERIFICATION_TIMESTAMP
);
let notifies;

const saveConfig = (timestamp) => {
  try {
    console.log({
      timestamp,
      lastVerificationTimestamp,
    });
    var data = fs.readFileSync(".env", { encoding: "utf8", flag: "r" });
    data = data.replace(
      "LAST_VERIFICATION_TIMESTAMP=" + lastVerificationTimestamp,
      "LAST_VERIFICATION_TIMESTAMP=" + timestamp
    );
    lastVerificationTimestamp = timestamp;
    fs.writeFileSync(".env", data);
  } catch (error) {
    console.log({ error });
  }
};

// setInterval(() => {
//   const options = {
//     method: "POST",
//     hostname: process.env.HOST_NAME_2,
//     path: "/hydra/v2/user/noti",
//     headers: {
//       Authorization: "Bearer " + process.env.MOMO_AUTH_TOKEN,
//       "Content-Type": "application/json",
//     },
//     maxRedirects: 20,
//   };

//   const req = https.request(options, function (res) {
//     var chunks = [];

//     res.on("data", function (chunk) {
//       chunks.push(chunk);
//     });

//     // res.on("end", function (chunk) {
//     //     var body = Buffer.concat(chunks);
//     //     notifies = JSON.parse(body)?.message?.data?.notifications;
//     // });

//     res.on("error", function (error) {
//       console.error(error);
//     });
//   });

//   const currentTimeStamp = Date.now();

//   const postData = JSON.stringify({
//     userId: "0358631412",
//     fromTime: lastVerificationTimestamp,
//     toTime: currentTimeStamp,
//     cursor: "",
//     limit: 500,
//   });

//   req.write(postData);

//   req.end();

//   notifies?.forEach(async (notify) => {
//     if (notify && notify?.transID != 0) {
//       const phoneNumber = notify?.sender;
//       const transactionInfo = JSON.parse(notify?.extra);
//       let amount = transactionInfo?.amount;
//       const last8digits = phoneNumber?.substring(phoneNumber.length - 8);
//       const orders = await Order.find({
//         phoneNumber: { $regex: `${last8digits}`, $options: "i" },
//       }).sort({ updatedAt: 1 });
//       if (orders?.length) {
//         for (let i = 0; i < orders.length; i++) {
//           const product = await Product.findById(orders[i].productId);
//           if (amount > 0) {
//             const orderPay =
//               parseInt(orders[i]?.amount) - parseInt(orders[i]?.paid);
//             if (amount >= orderPay) {
//               orders[i].status = true;
//               orders[i].paid += orderPay;
//               amount -= orderPay;
//               console.log(product.quantity - orders[i].amount / product.price);
//               product.quantity =
//                 product.quantity - orders[i].amount / product.price;
//             } else {
//               orders[i].paid += amount;
//               amount = 0;
//             }
//             await orders[i].save();
//           } else break;
//           await product.save();
//         }
//       }
//     }
//   });

//   saveConfig(currentTimeStamp);
// }, 5000);

const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

exports.main = async (event) => {
  const { code } = event;
  if (!code) {
    throw new Error('缺少参数code');
  }
                      //  cloud.openapi.phonenumber.getPhoneNumber
  const result = await cloud.openapi.phonenumber.getPhoneNumber({
    code: code,
  });
  return result;
};

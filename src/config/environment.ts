import { API_URL, APP_ENV } from "@env";

const Config = {
  env: APP_ENV,
  apiUrl: API_URL,
};

console.log("Environment Config", Config);

export default Config;

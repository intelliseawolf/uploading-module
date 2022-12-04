import MockAdapter from "axios-mock-adapter";
import uuid from "react-uuid";
import randomstring from "randomstring";

import axiosInstance from "../service";

const mock = new MockAdapter(axiosInstance);

function generateUploadURL() {
  return "https://localhost:3001/uploadFile/" + randomstring.generate();
}

mock.onGet("/getUploadURL").reply(200, {
  repository: { id: uuid(), uploadURL: generateUploadURL() },
});

const uploadURL = new RegExp(`/uploadFile/*`);
const sleep = (value: number) =>
  new Promise((resolve) => setTimeout(resolve, value));

mock.onPost(uploadURL).reply(async function (config) {
  const total: number = 1024;
  const bytes: number = 1024;
  for (const progress of [0, 0.2, 0.4, 0.6, 0.8, 1]) {
    await sleep(500);
    if (config.onUploadProgress) {
      config.onUploadProgress({ loaded: total * progress, total, bytes });
    }
  }
  return [200, null];
});

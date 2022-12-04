import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import ProgressBar from "react-bootstrap/ProgressBar";
import { AxiosResponse, AxiosProgressEvent } from "axios";
import { toast } from "react-toastify";

import axiosInstance from "../service/index";

interface GetUploadURLResponse {
  repository: {
    id: string;
    uploadURL: string;
  };
}

const Home = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  function getUploadURL() {
    if (!files?.length) {
      toast.error("No uploaded files!");
      return;
    }

    axiosInstance
      .get("/getUploadURL")
      .then(function (response: AxiosResponse<GetUploadURLResponse>) {
        const { uploadURL } = response.data.repository;
        uploadFiles(uploadURL);
      });
  }

  function onUploadProgress(event: AxiosProgressEvent) {
    console.log(event);
    if (event?.total) setUploadProgress((event.loaded / event.total) * 100);
  }

  function uploadFiles(url: string) {
    const formData = new FormData();

    if (!files?.length) return;
    for (let file of files) {
      formData.append("images", file);
    }

    axiosInstance
      .post(url, { files: formData }, { onUploadProgress })
      .then(function (response) {
        toast.success("Uploading success!");
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFiles(e.target.files);
  }

  return (
    <Container className="mt-5">
      <h1 className="text-center">Upload Page</h1>
      <Form.Group
        controlId="formFile"
        onChange={handleFileChange}
        className="mt-5"
      >
        <Form.Control type="file" multiple />
      </Form.Group>
      <ProgressBar animated now={uploadProgress} className="mt-3" />
      <Stack
        gap={2}
        className="mt-3 text-center justify-content-center"
        direction="horizontal"
      >
        <Button variant="primary" onClick={getUploadURL}>
          Upload
        </Button>
        <Button variant="secondary">Retry</Button>
        <Button variant="danger">Cancel</Button>
      </Stack>
    </Container>
  );
};

export default Home;

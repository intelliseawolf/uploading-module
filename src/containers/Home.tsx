import React, { useState, useRef } from "react";
import { useMachine } from "@xstate/react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import ProgressBar from "react-bootstrap/ProgressBar";
import { AxiosResponse, AxiosProgressEvent } from "axios";
import { toast } from "react-toastify";

import axiosInstance from "../service/index";
import { uploadMachine } from "../machine/upload";

interface GetUploadURLResponse {
  repository: {
    id: string;
    uploadURL: string;
  };
}

const Home = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, send] = useMachine(uploadMachine);

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
    if (event?.total) setUploadProgress((event.loaded / event.total) * 100);
  }

  function uploadFiles(url: string) {
    const formData = new FormData();

    if (!files?.length) return;
    for (let file of files) {
      formData.append("images", file);
    }

    send("UPLOAD");
    axiosInstance
      .post(url, { files: formData }, { onUploadProgress })
      .then(function () {
        send("SUCCESS");
        toast.success("Uploading succed!");
      })
      .catch(function (error) {
        send("FAIL");
        toast.error("Uploading fail!");
      });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFiles(e.target.files);
  }

  function retryUpload() {
    send("RETRY");
    setFiles(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <Container className="mt-5">
      <h1 className="text-center">Upload Page</h1>
      <Form.Group onChange={handleFileChange} className="mt-5">
        <Form.Control type="file" ref={fileInputRef} multiple />
      </Form.Group>
      {state.matches("uploading") && (
        <ProgressBar animated now={uploadProgress} className="mt-3" />
      )}
      <Stack
        gap={2}
        className="mt-3 text-center justify-content-center"
        direction="horizontal"
      >
        {state.matches("idle") && (
          <Button variant="primary" onClick={getUploadURL}>
            Upload
          </Button>
        )}
        {(state.matches("success") || state.matches("fail")) && (
          <Button variant="secondary" onClick={retryUpload}>
            Retry
          </Button>
        )}
        {state.matches("uploading") && <Button variant="danger">Cancel</Button>}
      </Stack>
    </Container>
  );
};

export default Home;

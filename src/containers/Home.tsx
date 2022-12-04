import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

const Home = () => {
  return (
    <Container className="mt-5">
      <h1 className="text-center">Uploading Page</h1>
      <Form.Group controlId="formFile" className="mt-5">
        <Form.Control type="file" />
      </Form.Group>
      <Stack
        gap={2}
        className="mt-3 text-center justify-content-center"
        direction="horizontal"
      >
        <Button variant="primary">Upload</Button>
        <Button variant="secondary">Retry</Button>
        <Button variant="danger">Cancel</Button>
      </Stack>
    </Container>
  );
};

export default Home;

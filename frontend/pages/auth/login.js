import React, { useState } from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  Alert,
} from "reactstrap";
// layout for this page
import Auth from "layouts/Auth.js";
import { signIn } from '../../services/firebase';
import { useRouter } from 'next/router';

function Login() {
  const router = useRouter();
  const [inputs, setInputs] = useState({
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  
  const updateValues = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    })
  }
  
  const submit = async (e) => {
    e.preventDefault();
    try {
      await signIn(inputs.email, inputs.password);
      router.push('/admin/dashboard')
    } catch (e) {
      setError(e.message.replace('Firebase:', ''))
    }
  }
  
  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent">
            <div className="text-muted text-center mt-2 mb-3">
              <b>Sign in </b>
            </div>
            <Alert isOpen={error} color={'danger'} >{error}</Alert>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <Form onSubmit={submit} >
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    value={inputs.email}
                    required={true}
                    onChange={updateValues}
                    placeholder="Email"
                    type="email"
                    name={'email'}
                    autoComplete="new-email"
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    value={inputs.password}
                    onChange={updateValues}
                    required={true}
                    placeholder="Password"
                    type="password"
                    name={'password'}
                    autoComplete="new-password"
                  />
                </InputGroup>
              </FormGroup>
              <div className="text-center">
                <Button className="my-4" color="primary" type="submit">
                  Sign in
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            {/*<a*/}
            {/*  className="text-light"*/}
            {/*  href="#pablo"*/}
            {/*  onClick={(e) => e.preventDefault()}*/}
            {/*>*/}
            {/*  <small>Forgot password?</small>*/}
            {/*</a>*/}
          </Col>
          <Col className="text-right" xs="6">
            <a
              className="text-light"
              href="/auth/register"
            >
              <small>Create new account</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  );
}

Login.layout = Auth;

export default Login;

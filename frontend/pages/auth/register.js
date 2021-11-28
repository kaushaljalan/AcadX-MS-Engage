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
  Col, Alert,
  Spinner, Label
} from "reactstrap";
// layout for this page
import Auth from "layouts/Auth.js";
import {useRouter} from 'next/router';
import {signIn, signInWithToken} from '../../services/firebase';
import {getDepartments, register} from '../../services/api';

function Register() {
  const router = useRouter();
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
    name: '',
    department: '',
  });
  
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const updateValues = (e) => {
    console.log({[e.target.name]: e.target.value}, inputs)
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    })
  }
  
  const submit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const { data } = await register(inputs)
      await signInWithToken(data)
      router.push('/admin/dashboard')
    } catch (e) {
      setIsLoading(false);
      setError(e?.response?.data || e.message)
    }
  }
  
  React.useEffect(() => {
    getDepartments().then(res => {
      setDepartments(res.data);
      setInputs({
        ...inputs,
        department: res.data[0]._id
      })
    })
  }, [])
  
  
  return (
    <>
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent">
            <div className="text-muted text-center mt-2 mb-4">
              <b>Sign up</b>
              <Alert isOpen={error} color={'danger'} >{error}</Alert>

            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <Form onSubmit={submit} role="form">
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-hat-3" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    name={'name'}
                    required={true}
                    onChange={updateValues}
                    value={inputs.name}
                    placeholder="Name"
                    type="text" />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    required={true}
                    onChange={updateValues}
                    type="email"
                    name="email"
                    value={inputs.email}
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
                    placeholder="Password"
                    type="password"
                    required={true}
                    onChange={updateValues}
                    name="password"
                    value={inputs.password}
                    autoComplete="new-password"
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label for="exampleSelectMulti">Department</Label>
                <Input onChange={updateValues} type="select" name="department" required id="exampleSelectMulti">
                  {
                    departments.length > 0 && departments.map(dept => <option value={dept._id} >{dept.abbreviation}</option>)
                  }
                </Input>
              </FormGroup>
              <div className="text-center">
                <Button className="mt-4" color="primary" type="submit">
                  {isLoading ? <Spinner /> : 'Create account'}
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
}

Register.layout = Auth;

export default Register;

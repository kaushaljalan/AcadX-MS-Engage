import React from "react";
import Link from "next/link";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media, Button,
} from "reactstrap";
import {signout} from '../../services/firebase';
import { useRouter } from 'next/router';
import {Context} from '../../context';

function AdminNavbar({ brandText }) {
  const router = useRouter();
  const [user] = React.useContext(Context);
  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <h1 className={'text-white'}>Welcome back, {user.displayName}!</h1>
          <br />
            {/*<a style={{ display: 'inline-block' }} >*/}
            {/*  {brandText}*/}
            {/*</a>*/}
          <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
            <FormGroup className="mb-0">
             <Button onClick={() => {
               signout().then(() => {
                 router.push('/auth/login')
               })
             }}>Logout</Button>
            </FormGroup>
          </Form>
        </Container>
        
      </Navbar>
      
    </>
  );
}

export default AdminNavbar;

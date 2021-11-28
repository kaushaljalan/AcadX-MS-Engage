import React, { useState, useEffect, useContext } from "react";
// react component that copies the given text inside your clipboard
import { CopyToClipboard } from "react-copy-to-clipboard";
import LoadingOverlay from 'react-loading-overlay';

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
  Button,
  Modal,
  ModalFooter,
  ModalBody,
  ModalHeader, Form, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input, Label,
  Badge, Alert
} from "reactstrap";
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import Header from "components/Headers/Header.js";
import {
  createClass,
  getDepartments,
  getStudents,
  getUpcomingClasses,
  getUpcomingPreferredClasses
} from '../../services/api';
import {getRef, getUrlToDownload, signIn, storage, uploadFile} from '../../services/firebase';
import {genSlots} from '../../utils';
import {Context} from '../../context';


const ClassCard = ({ classRecord }) => {
  const [attachmentLinks, setAttachmentLinks] = useState({});
  useEffect(() => {
    if (classRecord.class?.attachments && classRecord.class?.attachments?.length > 0) {
      for (const att of classRecord.class.attachments) {
        getUrlToDownload(att).then(url => {
          console.log(classRecord.name,att, { attachmentLinks })
          setAttachmentLinks({
            ...attachmentLinks,
            [att]: url,
          })
          console.log(att, url)
          const xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.onload = (event) => {
            const blob = xhr.response;
          };
          xhr.open('GET', url);
          xhr.send();
        })
      }
    }
  }, [])

  return (
    <Col sm={'3'}>
      <Card >
        <CardHeader style={{ position: 'relative' }} className="bg-transparent">
          <h4 style={{ display: 'inline-block' }} className="mb-0">{classRecord.date}</h4>
          <Badge color={classRecord.modeOfDelivery === 'in-person' ? 'warning': 'success'} style={{ position: 'absolute', right: '10px' }} >
            {classRecord.modeOfDelivery}
          </Badge>
        </CardHeader>
        <CardBody>
          <div style={{ position: 'relative' }}>
            <h4 style={{ display: 'inline-block' }} >{classRecord.name}</h4>
            <Badge color={'dark'} style={{ position: 'absolute', right: '10px' }} >
              <b>{classRecord.slot} </b>
            </Badge>
          </div>
          <p>{classRecord.details}</p>
          {
            Object.keys(attachmentLinks).length > 0 && Object.keys(attachmentLinks).map((fkey, i) =>
              <Badge color={'primary'} target={'_blank'} href={attachmentLinks[fkey]}>Attachment {i}</Badge>
            )
          }
        </CardBody>
      </Card>
    </Col>
  )
}

const Icons = () => {
  const [showScheduleClassModal, setShowScheduleClassModal] = useState(false);
  const [classInfoModal, setClassInfoModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState({});
  const [students, setStudents] = useState({});
  const [departments, setDepartments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [files, setFiles] = useState([]);
  const formInitialState = {
    name: '',
    details: '',
    modeOfDelivery: 'virtual',
    department: '',
    date: '',
    slot: '10-11',
  
  }
  useEffect(() => {
    getDepartments().then(res => {
      setDepartments(res.data);
      setInputValues({
        ...inputValues,
        department: res.data[0]._id
      })
    });
    setSlots(genSlots());
  }, []);
  
  const [inputValues, setInputValues] = useState(formInitialState);
  const [classes, setClasses] = useState({ todayClasses: [], upcomingClasses: [] });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const updateValues = (e) => {
    setInputValues({
      ...inputValues,
      [e.target.name]: e.target.value
    })
  }
  
  const submit = async (e) => {
    e.preventDefault();
    try {
      const attachments = [];
        for (const file of files) {
          const ref = await uploadFile(
            `${inputValues.name}/${file.name}-${Math.random().toString().substring(3, 10)}.${file.type.split('/')[1]}`,
            file,
            file.type
            );
          attachments.push(ref.ref.fullPath);
          console.log({ ref })
        }
        await createClass({
          ...inputValues,
          attachments
        });
        setInputValues(formInitialState);
        loadClasses();
        setTimeout(() => {
          setShowScheduleClassModal(false);
        }, 100)
    } catch (e) {
      console.log(e)
      setError(e.response.data)
    }
  }
  
  const renderSlotOptions = () => {
    if (!slots)
      return <option value={null} >Please select a day to show slots</option>;
    if (slots.length === 0)
      return <option value={null} >No slots available for the selected day</option>;
    if (slots.length > 0)
      return slots.map(slot => <option value={slot}>{slot}</option>);
  }
  const loadClasses = async () => {
    const { data } = user.role === 'teacher' ? await getUpcomingClasses(): await getUpcomingPreferredClasses();
    const date = new Date();
    const todayClasses = [];
    const upcomingClasses = [];
    const today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  
    data.forEach(classRecord => {
      const classR = {
        ...classRecord,
        faculty: classRecord.faculty || classRecord?.class?.faculty,
        name: classRecord.name || classRecord?.class?.name,
      };
      if (classRecord?.class?.date === today || classRecord.date === today)
        todayClasses.push(classR)
      else if (new Date(classRecord?.class?.date || classRecord.date) > date)
        upcomingClasses.push(classR);
    });
    console.log({ todayClasses, upcomingClasses })
    setClasses({ todayClasses, upcomingClasses });
  }
  
  const classOnClick = async (classRecord) => {
    const {data} = await getUpcomingPreferredClasses({
      class: classRecord._id
    })
    if (data.length > 0) {
    
    }
    setSelectedClass(classRecord)
  }
  
  useEffect(() => {
    if (document.getElementsByClassName('loader-overlay')[0])
      document.getElementsByClassName('loader-overlay')[0].style.position = 'inherit';
    
    loadClasses().then(() => setIsLoading(false));
    
  }, []);
  
  const [user] = useContext(Context);
  
  useEffect(() => {
    if (user.role === 'teacher') {
      getStudents().then(({ data }) => setStudents(data))
    }
  }, [user])
  
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader style={{ position: 'relative' }} className="bg-transparent">
                <h2 style={{ display: 'inline-block' }} className="mb-0">
                  Your scheduled classes
                </h2>
                {user.role === 'teacher' &&  <Button
                  onClick={() => setShowScheduleClassModal(!showScheduleClassModal)}
                  color={'primary'}
                  style={{ position: 'absolute', right: '10px' }} >
                  Schedule a Class
                </Button>
                }
              </CardHeader>
              <CardBody >
                {
                  isLoading ? <LoadingOverlay
                    className={'loader-overlay'}
                    active={isLoading}
                    spinner
                    text='Fetching classes ...'
                  >
                    <p>...</p>
                  </LoadingOverlay> : <>
                    <h2 style={{ display: 'inline-block' }} className="mb-0">Today</h2>
                    <Row>
                      {
                        classes.todayClasses.length > 0 && classes.todayClasses.map(classRecord => <ClassCard onClick={classOnClick} classRecord={classRecord} />)
                      }
                    </Row>
                    <hr />
                    <h2 style={{ display: 'inline-block' }} className="mb-0">Upcoming</h2>
                    <Row>
                      {
                        classes.upcomingClasses.length > 0 && classes.upcomingClasses.map(classRecord => <ClassCard onClick={classOnClick} classRecord={classRecord} />)
                      }
                    </Row>
                  </>
                }
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
      <Modal toggle={() => setShowScheduleClassModal(!showScheduleClassModal)} size={'l'} centered isOpen={showScheduleClassModal} >
        <ModalHeader>Schedule a class</ModalHeader>
        <ModalBody>
          <Form id={'form'} onSubmit={submit} role="form">
            <FormGroup>
              <Label>Name</Label>
              <InputGroup className="input-group-alternative mb-3">
                <Input
                  name={'name'}
                  required={true}
                  value={inputValues.name}
                  onChange={updateValues}
                  placeholder="Eg: C Tokens"
                  type="text" />
              </InputGroup>
            </FormGroup>
  
            <FormGroup>
              <Label>Details</Label>
              <InputGroup className="input-group-alternative mb-3">
                <Input
                  rows={5}
                  value={inputValues.details}
                  onChange={updateValues}
                  name={'details'}
                  placeholder="Eg: In this class we will discuss ..."
                  type="textarea" />
              </InputGroup>
            </FormGroup>
  
            <FormGroup>
              <Label>Mode of delivery</Label>
              <FormGroup check>
                <Label
                  onChange={updateValues}
                  type={'radio'}
                  name={'modeOfDelivery'}
                  for={'modeOfDelivery'}
                  check>
                  <Input
                    onChange={updateValues}
                    checked={inputValues.modeOfDelivery === 'virtual'} value={'virtual'} type="radio" name="modeOfDelivery" />{' '}
                  Virtual
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input onChange={updateValues}
                         checked={inputValues.modeOfDelivery === 'in-person'}
                         value={'in-person'} type="radio" name="modeOfDelivery" />{' '}
                  In-Person
                </Label>
              </FormGroup>
            </FormGroup>
            
            <FormGroup>
              <Label for="exampleSelectMulti">Department</Label>
              <Input onChange={updateValues} type="select" name="department" id="exampleSelectMulti">
                {
                  departments.length > 0 && departments.map(dept => <option value={dept._id} >{dept.abbreviation}</option>)
                }
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>Date</Label>
              <InputGroup className="input-group-alternative mb-3">
                <Input
                  value={inputValues.date}
                  onChange={updateValues}
                  name={'date'}
                  type="date" />
              </InputGroup>
            </FormGroup>
            
            <FormGroup>
              <Label for="exampleSelectMulti">Time Slot</Label>
              <Input
                     onChange={updateValues}  type="select" name="slot" id="exampleSelectMulti">
                {renderSlotOptions()}
              </Input>
            </FormGroup>
  
            <FormGroup>
              <Label for="exampleSelectMulti">Attachments</Label>
              <input
                type={'file'}
                onChange={e => {
                  console.log(e.target.files[0])
                  setFiles(e.target.files)
                }}
              />
            </FormGroup>
            <Alert isOpen={error} color={'danger'} >{error}</Alert>
  
            <Button type={'submit'} block color={'primary'} >Schedule</Button>
          </Form>
        </ModalBody>
      </Modal>
      <Modal toggle={() => setClassInfoModal(!classInfoModal)} size={'l'} centered isOpen={classInfoModal} >
        <ModalHeader>
          <h4>11-2-2002</h4>
        </ModalHeader>
      </Modal>
    </>
    
  );
};

Icons.layout = Admin;

export default Icons;

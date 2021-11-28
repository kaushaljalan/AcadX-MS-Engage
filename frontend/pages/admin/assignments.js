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
  Badge, CardTitle, Alert, CardFooter, Collapse
} from "reactstrap";
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import Header from "components/Headers/Header.js";
import {
  createAssignment,
  createClass, createPreferredSlots, deletePreferredSlots, getAssignments, getAssignmentSubmissions,
  getDepartments,
  getStudents,
  getUpcomingClasses,
  getUpcomingPreferredClasses, gradeAssignment, submitAssignment, updatePreferredSlots
} from '../../services/api';
import {getUrlToDownload, signIn, uploadFile} from '../../services/firebase';
import {genSlots} from '../../utils';
import {Context} from '../../context';


const ClassCard = ({ classRecord, onClick, user, onClickTeacher }) => {
  const [showGrades, setShowGrades] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState('');
  useEffect(() => {
    if (classRecord?.attachments?.length > 0)
    getUrlToDownload(classRecord.attachments[0]).then((url) => {
      setAttachmentUrl(url)
    })
  }, []);
  return (
    <Col sm={'3'}>
      <Card>
        <CardHeader style={{ position: 'relative' }} className="bg-transparent">
          <h4 style={{ display: 'block' }} className="mb-0">{classRecord.name}</h4>
          <Badge color={'warning'} >
            Deadline: {new Date(classRecord.deadline).toLocaleString()}
          </Badge>
        </CardHeader>
        <CardBody>
          <div style={{ position: 'relative' }}>
            <p style={{ display: 'inline-block' }} >{classRecord.details}</p>
          </div>
          <h5><i>Questions</i></h5>
          <ul>
            {classRecord.questions.map(q => <li>
              <h6>{q.question}</h6>
              <p>{showGrades && (classRecord.grades.find(ans => ans.question === q._id).marks) + ' Marks'}</p>
            </li>)}
          </ul>
          {
            showGrades && <>
              Total: {classRecord.grades.reduce((a, b) => a + b.marks, 0)}
    
            </>
          }
        </CardBody>
        <CardFooter>
          {
            attachmentUrl && <Badge color={'primary'} style={{ marginBottom: '5px' }} href={attachmentUrl} target={'_blank'} >Download Attachment</Badge>
          }
          { user.role === 'teacher' && <Button onClick={() => onClickTeacher(classRecord)} color={'dark'} block>View Submissions</Button> }
          {/* TODO: Determine the button by 1: user is student, 2: user not submitted the assignment, 3: Deadline is not over */}
          { !classRecord.submitted ?( user.role==='student' && <Button onClick={() => onClick(classRecord)} color={'dark'} block>Submit Assignment</Button>):
           classRecord.graded ? <Button onClick={() => setShowGrades(!showGrades)} color={'success'} > { showGrades ? 'Hide': 'Show' } Grades</Button> : <Badge color={'success'} >Submitted</Badge>}
        </CardFooter>
      </Card>
    </Col>
  )
}

const Assignments = () => {
  const [showScheduleClassModal, setShowScheduleClassModal] = useState(false);
  const [classInfoModal, setClassInfoModal] = useState(false);
  const [submissionsModal, setSubmissionsModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState({});
  const [selectedAssignment, setSelectedAssignment] = useState({});
  const [students, setStudents] = useState({});
  const [departments, setDepartments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState('');
  const [files, setFiles] = useState([]);
  const [submissionFiles, setSubmissionFiles] = useState([]);
  
  const [assignmentSubmissionError, setAssignmentSubmissionError] = useState('');
  const formInitialState = {
    name: '',
    details: '',
    department: '',
    deadline: '',
    questions: [],
    
  }
  useEffect(() => {
    getDepartments().then(res => {
      setDepartments(res.data);
      setInputValues({
        ...inputValues,
        department: res.data[0]._id
      })
    });
  }, []);
  
  const [inputValues, setInputValues] = useState(formInitialState);
  const [classes, setClasses] = useState({ todayClasses: [], upcomingClasses: [] });
  
  const [isLoading, setIsLoading] = useState(true);
  
  const updateValues = (e) => {
    setError('')
    setInputValues({
      ...inputValues,
      [e.target.name]: e.target.value
    })
  }
  
  const submit = async (e) => {
    e.preventDefault();
    console.log({problemStatements})
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
      const data = {
        ...inputValues,
        attachments,
        questions: Object.keys(problemStatements).filter(ps => problemStatements[ps].question).map(ps => ({
          ...problemStatements[ps],
          marks: problemStatements[ps].marks || 10
        })),
      };
      if (data.questions.length === 0)
        return setError('Please enter at least one question')
      console.log({ data })
      await createAssignment(data);
      setInputValues(formInitialState);
      setTimeout(() => {
        setShowScheduleClassModal(false);
      }, 100)
    } catch (e) {
      setError(e.response.data)
    }
  }
  
  const loadAssignments = async () => {
    const { data } =  await getAssignments()
    const date = new Date();
    const todayClasses = [];
    const upcomingClasses = [];
    const submissionsHash = {};
    const submissionsRes = user.role === 'student' ? await getAssignmentSubmissions() : { data: [] };
    submissionsRes.data.length > 0 && submissionsRes.data.forEach(d => submissionsHash[d.assignment] = d)
    console.log(submissionsHash)
    data.forEach(classRecord => {
      const classR = {
        ...classRecord,
        submitted: user.role === 'student' && submissionsHash[classRecord._id],
        graded: user.role === 'student' && submissionsHash[classRecord._id]?.graded,
        grades: user.role === 'student' ? submissionsHash[classRecord._id]?.grades: [],
      }
      if (new Date(classRecord.deadline) > date)
        todayClasses.push(classR)
      else
        upcomingClasses.push(classR);
    });
    console.log({ todayClasses, upcomingClasses })
    setClasses({ todayClasses, upcomingClasses });
  }
  const [user] = useContext(Context);
  
  
  const classOnClick = async (classRecord) => {
    setSelectedClass(classRecord);
    setClassInfoModal(true)
  }
  
  const onClickTeacher = async (classRecord) => {
    const { data } = await getAssignmentSubmissions({
      assignment: classRecord._id,
    })
    setSelectedAssignment({
      ...classRecord,
      submissions: data
    });
    setSubmissionsModal(true)
  }
  
  useEffect(() => {
    if (document.getElementsByClassName('loader-overlay')[0])
      document.getElementsByClassName('loader-overlay')[0].style.position = 'inherit';
    if (user.role)
      loadAssignments().then(() => setIsLoading(false));
    
  }, [user]);
  
  
  const [statementsCount, setStatementsCount] = useState(1);
  const [problemStatements, setProblemStatements] = useState({});
  
  const updateProblemStatements = (e, i) =>
    setProblemStatements({
      ...problemStatements,
      [i]: {
        // @ts-ignore
        ...problemStatements[i],
        [e.target.name]: e.target.value,
      },
    });
  
  const [answers, setAnswers] = useState({});
  const [grades, setGrades] = useState({});
  const [userSubmissions, setSubmissions] = useState({});
  
  const updateAnswer = (e) => {
    setAnswers({
      ...answers,
      [e.target.name]: e.target.value
    })
  }
  
  const updateGrades = (submissionId, questionId, value) => {
    console.log(submissionId, questionId, value)
    const gradesClone = { ...grades };
    if (gradesClone[submissionId])
      gradesClone[submissionId][questionId] = value
    else {
      gradesClone[submissionId] = {
        [questionId]: value
      }
    }
    console.log(gradesClone)
    setGrades(gradesClone)
  }
  
  
  const submitAssignmentAnswers = async () => {
    const answersToSubmit = Object.keys(answers).map(key => ({
      question: key,
      answer: answers[key],
    }));
    const attachments = [];
    for (const file of submissionFiles) {
      const ref = await uploadFile(
        `${inputValues.name}/${file.name}-${Math.random().toString().substring(3, 10)}.${file.type.split('/')[1]}`,
        file,
        file.type
      );
      attachments.push(ref.ref.fullPath);
    }
    console.log({ answers: answersToSubmit, assignment: selectedClass._id })
    const { data } = await submitAssignment({ attachments, answers: answersToSubmit, assignment: selectedClass._id });
    if (typeof data === 'string')
      setAssignmentSubmissionError(data)
    
    const assignmentsClone = [...classes.todayClasses];
    assignmentsClone.forEach(asc => {
      if (asc._id === selectedClass._id)
        asc.submitted = true;
    });
    setClassInfoModal(false)
    setClasses({ todayClasses: assignmentsClone, upcomingClasses: classes.upcomingClasses })
  }
  
  useEffect(() => {
    if (user.role === 'teacher') {
      getStudents().then(({ data }) => {
        const hash = {};
        data.forEach(d => hash[d.uid] = d.displayName)
        setStudents(hash)
      })
    }
  }, [user])
  
  const [expandedSubmissions, setExpandedSubmission] = useState(null);
  
  const gradeStudent = async (submissionId) => {
  const gradesToSubmit = Object.keys(grades[submissionId]).map(key => ({
    question: key,
    marks: Number(grades[submissionId][key])
  }));
  const res = await gradeAssignment({ grades: gradesToSubmit, submissionId });
  const selectedAssignmentClone = {  ...selectedAssignment }
  selectedAssignmentClone.submissions.forEach(sub => {
    if (sub._id === submissionId)
      sub.graded = true;
  })
    setSelectedAssignment(selectedAssignmentClone);
    setExpandedSubmission('')
  }
  const [submissionAttachments, setSubmissionAttachments] = useState({});
  const renderAssignmentDownloadButton = (submission) => {
    if (submission?.attachments?.length > 0) {
      getUrlToDownload(submission.attachments[0])
        .then(url => {
          setSubmissionAttachments({
            ...submissionAttachments,
            [submission._id]: url
          })
        })
    }
  }
  
  useEffect(() => {
    console.log({
      selectedAssignment,
      expandedSubmissions
    })
    if (selectedAssignment.submissions?.length > 0) {
      console.log('c')
      const submission = selectedAssignment.submissions.find(s => s._id ===expandedSubmissions)
      console.log('s', { submission })
      renderAssignmentDownloadButton(submission)
    }
  }, [expandedSubmissions, selectedAssignment])
  
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
                  Assignments
                </h2>
                {user.role === 'teacher' &&  <Button
                  onClick={() => setShowScheduleClassModal(!showScheduleClassModal)}
                  color={'primary'}
                  style={{ position: 'absolute', right: '10px' }} >
                  Create a New Assignment
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
                    <h2 style={{ display: 'inline-block' }} className="mb-0">Upcoming Assignments</h2>
                    <Row>
                      {
                        classes.todayClasses.length > 0 && classes.todayClasses.map(classRecord =>
                          <ClassCard
                            onClick={classOnClick}
                            onClickTeacher={onClickTeacher}
                            classRecord={classRecord}
                            user={user}
                          />)
                      }
                    </Row>
                    <hr />
                    <h2 style={{ display: 'inline-block' }} className="mb-0">Past Assignments</h2>
                    <Row>
                      {
                        classes.upcomingClasses.length > 0 && classes.upcomingClasses.map(classRecord =>
                          <ClassCard
                            onClick={classOnClick}
                            onClickTeacher={onClickTeacher}
                            classRecord={classRecord}
                            user={user}
                          />)
                      }
                    </Row>
                  </>
                }
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
      <Modal toggle={() => setShowScheduleClassModal(!showScheduleClassModal)} size={'lg'} centered isOpen={showScheduleClassModal} >
        <ModalHeader>Create an Assignment</ModalHeader>
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
                  rows={3}
                  required={true}
                  value={inputValues.details}
                  onChange={updateValues}
                  name={'details'}
                  placeholder="Eg: In this class we will discuss ..."
                  type="textarea" />
              </InputGroup>
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
              <Label for="exampleSelectMulti">Attachments</Label>
              <input
                type={'file'}
                onChange={e => {
                  console.log(e.target.files[0])
                  setFiles(e.target.files)
                }}
              />
            </FormGroup>
  
            <FormGroup>
              <Label>Deadline</Label>
              <InputGroup className="input-group-alternative mb-3">
                <Input
                  value={inputValues.deadline}
                  required={true}
                  onChange={updateValues}
                  name={'deadline'}
                  type="datetime-local" />
              </InputGroup>
            </FormGroup>
  
    
           <h3> <Label>Questions</Label> </h3>
            {[...Array(statementsCount).keys()].map((i) => (
              <Card key={i} className={'shadow'} style={{ marginBottom: '20px' }}>
                <CardTitle style={{ marginTop: '5px', padding: '5px' }} >
                  <span>Question {i + 1}</span>
                </CardTitle>
                <Label>Question</Label>
                <Input
                  key={`${i}-title`}
                  onChange={(e) => updateProblemStatements(e, i)}
                  type="textarea"
                  name={'question'}
                  value={problemStatements[i]?.title}
                />
                
                <Label>Marks</Label>
                <Input
                  key={`${i}-marks`}
                  onChange={(e) => updateProblemStatements(e, i)}
                  name={'marks'}
                  type="number"
                  default={10}
                  value={problemStatements[i]?.marks || 10}
                />
              </Card>
            ))}
            
            <Button
              onClick={() => setStatementsCount((prev) => (prev += 1))}
              style={{ marginBottom: '15px' }}
              color={'primary'}
            >
              Add +
            </Button>
            <Alert color={'danger'} isOpen={error} ><b>{error}</b></Alert>
  

            <Button type={'submit'} block color={'primary'} >Create</Button>
          </Form>
        </ModalBody>
      </Modal>
      <Modal toggle={() => setClassInfoModal(!classInfoModal)} size={'xl'} isOpen={classInfoModal} >
        <ModalHeader>
          <h4>Submit {selectedClass.name}</h4>
          <p>{selectedClass.details}</p>
        </ModalHeader>
        <ModalBody>
          <h3>Please answer the questions</h3>
          {selectedClass?.questions?.length > 0 && selectedClass.questions.map(question => <>
            <Label>{question.question}</Label>
            <Input
              type={'textarea'}
              name={question._id}
              value={answers[question._id]}
              onChange={updateAnswer}
            />
          </>)}
          <FormGroup>
            <Label for="exampleSelectMulti">Attachment</Label>
            <input
              type={'file'}
              onChange={e => {
                setSubmissionFiles(e.target.files)
              }}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Alert style={{ width: '100%' }} color={'danger'} isOpen={assignmentSubmissionError} ><b>{assignmentSubmissionError}</b></Alert>
          <Button onClick={submitAssignmentAnswers} block color={'primary'}>Submit</Button>
        </ModalFooter>
      </Modal>
      <Modal toggle={() => setSubmissionsModal(!submissionsModal)} size={'xl'} isOpen={submissionsModal} >
        <ModalHeader>
          <h1>All Submissions for {selectedAssignment.name}</h1>
          <p>{selectedAssignment.details}</p>
        </ModalHeader>
        <ModalBody>
          {
            selectedAssignment?.submissions?.length >= 0 && selectedAssignment.submissions.map(submission =>
              <Card key={`${submission._id}-main`} className="shadow border-0">
                <CardHeader
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    if (expandedSubmissions === submission._id)
                      setExpandedSubmission('')
                    else
                      setExpandedSubmission(submission._id)
                  }}
                >
                  <i style={{ display: 'inline-block' }} className={`ni ni-bold-${expandedSubmissions === submission._id ? 'down' : 'right'}`} />
                  <h4  style={{ display: 'inline-block', marginLeft: '15px', cursor: ''  }}  className={'mb-0'}>
                    {students[submission.user]}</h4>
                </CardHeader>
                <Collapse isOpen={expandedSubmissions === submission._id}>
                  <CardBody>
                    <Row>
                      {
                        selectedAssignment.questions.map(question => <>
                          <Container>
                          <p style={{ margin: '2px' }} >{question.question} (Marks: {question.marks})</p>
                          <p style={{ margin: '2px' }}>Answer: {submission.answers.find(ans => ans.question === question._id).answer} </p>
                            {
                              submission.graded ? <>
                                Graded: {submission.grades && submission.grades.length > 0 && submission.grades.find(g => g.question === question._id).marks}
                              </> :
                                <Input
                                  type={'number'}
                                  max={question.marks}
                                  value={grades[submission._id] ? grades[submission._id][question._id] : 0}
                                  name={question._id}
                                  onChange={(e) => updateGrades(submission._id, question._id, e.target.value)}
                                />
                                
                            }
                          </Container>
                        </>)
                      }
                      {
                        submissionAttachments[submission._id] && <Badge
                          color={'primary'}
                          href={submissionAttachments[submission._id]}
                          target={'_blank'}
                        >
                          Download Attachment</Badge>
                      }
                    </Row>
                    <Button
                      disabled={submission.graded}
                      onClick={() => gradeStudent(submission._id)} style={{ marginTop: '20px' }} color={'primary'} >
                      {submission.graded ? `Total Grade: ${submission.grades.reduce((a, b) => a + Number(b.marks) , 0)}` :  'Grade Student'}
                    </Button>
                  </CardBody>
                </Collapse>
              </Card>
            )
          }
          

        </ModalBody>
        <ModalFooter>
          <Alert style={{ width: '100%' }} color={'danger'} isOpen={assignmentSubmissionError} ><b>{assignmentSubmissionError}</b></Alert>
        </ModalFooter>
      </Modal>
    </>
  
  );
};

Assignments.layout = Admin;

export default Assignments;

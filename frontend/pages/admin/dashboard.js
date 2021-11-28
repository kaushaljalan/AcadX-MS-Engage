import React, { useState, useEffect } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";

import Header from "components/Headers/Header.js";
import {Context} from '../../context';
import {getAssignments, getTeachers, getUpcomingClasses, getUpcomingPreferredClasses} from '../../services/api';

const Dashboard = (props) => {
  const [activeNav, setActiveNav] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(1);
  const [teachers, setTeachers] = React.useState({});
  const [classes, setClasses] = useState({ todayClasses: [], upcomingClasses: [] });
  const [assignments, setAssignments] = useState({ todayClasses: [], upcomingClasses: [] });
  const [chartExample1Data, setChartExample1Data] = React.useState("data1");
  const [user] = React.useContext(Context)
  React.useEffect(() => {
    console.log({ user })
  }, [user]);

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };
  const loadClasses = async () => {
    const { data } = user.role === 'teacher' ? await getUpcomingClasses(): await getUpcomingPreferredClasses();
    const date = new Date();
    const upcomingClasses = [];
    const today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    data.forEach(classRecord => {
      if (classRecord?.class?.date === today || classRecord.date === today || new Date(classRecord?.class?.date) > date)
        upcomingClasses.push({
          ...classRecord,
          faculty: classRecord.faculty || classRecord?.class?.faculty,
          name: classRecord.name || classRecord?.class?.name,
        });
    });
    setClasses({ upcomingClasses });
  }
  
  const loadAssignments = async () => {
    const { data } =  await getAssignments()
    const date = new Date();
    const todayClasses = [];
    const upcomingClasses = [];
    
    data.forEach(classRecord => {
      if (new Date(classRecord.deadline) > date)
        todayClasses.push(classRecord)
      else
        upcomingClasses.push(classRecord);
    });
    console.log({ todayClasses, upcomingClasses })
    setAssignments({ todayClasses, upcomingClasses });
  }
  
  useEffect(() => {
    if (user.role) {
      getTeachers().then(res => {
        const teachers = {};
        if (res.data.length > 0) {
          res.data.forEach(teach => teachers[teach.uid] = teach);
          setTeachers(teachers);
          loadClasses()
          loadAssignments()
        }
      })
    }
  }, [user])
  
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="7">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Upcoming Classes</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      href="/admin/classes"
                      size="sm"
                    >
                      See all
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Faculty</th>
                    <th scope="col">Date/Time</th>
                  </tr>
                </thead>
                <tbody>
                {
                  classes.upcomingClasses.length > 0 && classes.upcomingClasses.map(cls =>
                    <tr>
                      <td>{cls.name}</td>
                      <td>{teachers[cls.faculty]?.displayName}</td>
                      <td>{cls.date}{' - '}<b>{cls.slot}</b></td>
                    </tr>
                  )
                }
                
                </tbody>
              </Table>
            </Card>
          </Col>
          <Col xl="5">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Pending Assignments</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      See all
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Deadline</th>
                    <th scope="col" >~Time to complete</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    assignments.todayClasses.length > 0 && assignments.todayClasses.map(cls =>
                      <tr>
                        <td>{cls.name}</td>
                        <td>{new Date(cls.deadline).toLocaleString()}</td>
                        <td>~{cls.questions.length * 15} minutes</td>
                      </tr>
                    )
                  }

                  </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

Dashboard.layout = Admin;

export default Dashboard;

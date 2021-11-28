import React, { useEffect, useState } from "react";

// reactstrap components
import {Button, Card, CardBody, CardHeader, Collapse, Container, FormGroup, Input, Label, Row, Col} from "reactstrap";
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import Header from "components/Headers/Header.js";
import {genSlots} from '../../utils';
import { getPreferredSlots, updatePreferredSlots, deletePreferredSlots, createPreferredSlots } from '../../services/api';

function WeeklyPreferences() {

  const [collapseState, setCollapseState] = useState({});
  const [preferredSlots, setPreferredSlots] = useState(null);
  
  useEffect(() => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const preferences = {};
    const initialCollapseState = {}
    days.forEach(day => {
      initialCollapseState[day] = false;
      const slots = {};
      genSlots().forEach(slot => slots[slot] = {
        slot,
        isSelected: false,
        modeOfDelivery: 'virtual',
        id: '',
      });
      preferences[day] = slots;
    });
    getPreferredSlots().then(({ data }) => {
      data.forEach(sl => {
        preferences[sl.weekDay][sl.slot] = {
          isSelected: true,
          id: sl._id,
          modeOfDelivery: sl.modeOfDelivery,
          slot: sl.slot
        };
      });
      setPreferredSlots(preferences);
    });
  }, []);
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow border-0">
              <CardHeader>
                <h1 className={'mb-0'}>Set your weekly preferences</h1>
              </CardHeader>
              <CardBody>
                {
                  preferredSlots && Object.keys(preferredSlots).map(day => <>
                    <Card key={`${day}-main`} className="shadow border-0">
                      <CardHeader
                        style={{
                          cursor: 'pointer',
                        }}
                        onClick={() => setCollapseState({
                          ...collapseState,
                          [day]: !collapseState[day]
                        })}
                      >
                        <i style={{ display: 'inline-block' }} className={`ni ni-bold-${collapseState[day] ? 'down' : 'right'}`} />
                        <h4  style={{ display: 'inline-block', marginLeft: '15px', cursor: ''  }}  className={'mb-0'}>
                          {day}</h4>
                      </CardHeader>
                      <Collapse isOpen={collapseState[day]}>
                        <CardBody>
                          <Row>
                          {
                            Object.keys(preferredSlots[day]).map(slot => <>
                              <Col
                                key={`${day}-${slot}-col`}
                                sm={'2'} style={{ display: 'inline-block' }}>
                                <Button
                                  size={'lg'}
                                  block
                                  key={`${day}-${slot}-button`}
                                color={preferredSlots[day][slot].isSelected ? 'primary': 'secondary'}
                                  onClick={async () => {
                                    if (preferredSlots[day][slot].isSelected && preferredSlots[day][slot].id) {
                                      await deletePreferredSlots(preferredSlots[day][slot].id)
                                      const slotsClone = { ...preferredSlots };
                                      slotsClone[day][slot].isSelected = false;
                                      slotsClone[day][slot].id = '';
                                      slotsClone[day][slot].modeOfDelivery = 'virtual';
                                      setPreferredSlots(slotsClone)
                                    }
                                    else {
                                      const { data } = await createPreferredSlots({
                                        slot: preferredSlots[day][slot].slot,
                                        weekDay: day,
                                        modeOfDelivery: 'virtual'
                                      })
                                      const slotsClone = { ...preferredSlots };
                                      slotsClone[day][slot].isSelected = true;
                                      slotsClone[day][slot].id = data._id;
                                      setPreferredSlots(slotsClone)
                                    }
                                  }}
                              style={{ marginTop: '7px', marginBottom: '8px' }}>
                              {preferredSlots[day][slot].slot}
                            </Button>
                              <FormGroup
                                style={{
                                  marginLeft: '22px',
                                  marginTop: '10px',
                                }}
                                
                              >
                                <Label style={{
                                  cursor: preferredSlots[day][slot].isSelected ? 'default': 'not-allowed'
                                }} >
                                  <Input
                                    style={{
                                      cursor: preferredSlots[day][slot].isSelected ? 'default': 'not-allowed'
                                    }}
                                    onChange={async (e) => {
                                      console.log(e.target.checked)
                                      const modeOfDelivery = e.target.checked ? 'in-person': 'virtual';
                                      console.log({ modeOfDelivery });
                                      await updatePreferredSlots( {
                                        id: preferredSlots[day][slot].id,
                                        modeOfDelivery
                                      });
                                      const slotsClone = { ...preferredSlots };
                                      slotsClone[day][slot].modeOfDelivery = modeOfDelivery;
                                      setPreferredSlots(slotsClone)
                                    }}
                                    disabled={!preferredSlots[day][slot].isSelected}
                                    type={'checkbox'}
                                    checked={preferredSlots[day][slot].modeOfDelivery === 'in-person'}
                                  />
                                  In-person
                                </Label>
                            </FormGroup>
                              </Col>
                            </>)
                          }
                          </Row>
                        </CardBody>
                      </Collapse>
                    </Card>
                  </>)
                }

              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
}

WeeklyPreferences.layout = Admin;

export default WeeklyPreferences;

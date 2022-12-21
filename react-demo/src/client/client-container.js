import React from 'react';
import {
    Card,
    CardHeader,
    Modal,
    ModalBody,
    ModalHeader,
} from 'reactstrap';

import ClientConsumptionChart from "./components/client/client-consumption";

import ClientDevicesTable from './components/device/client-devices-table';
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";


import * as API_DEVICES from "./api/device-api"
import SockJsClient from 'react-stomp'
import Alert from 'reactstrap/lib/Alert';

class ClientContainer extends React.Component {

    constructor(props) {
        super(props);
        this.reload = this.reload.bind(this);
        this.deviceBindId = null;
        this.currentClientId = props.currentClientId;
        this.state = {
            isVisibleViewConsumption: false,
            device:null,
            collapseForm: false,
            clientTableData: [],
            deviceTableData: [],
            isLoadedClients: false,
            isLoadedDevices: false,
            isCurrentClient:false,
            alertMessage:null,
            errorStatus: 0,
            error: null
        };
    }

    componentDidMount() {
        this.fetchClientDevices();
    }

    fetchClientDevices() {
        return API_DEVICES.getDeviceByUserId(this.currentClientId, (result, status, err) => {

            if (result !== null && status === 200) {
                this.setState({
                    clientDevicesTableData: result,
                    isLoadedDevices: true
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });
    }

    reload() {
        this.setState({
            isLoadedDevices: false,
            isLoadedClients: false
        });
        this.fetchClientDevices();
    }

    handleViewConsumptionClick = (device) =>{
        this.setState({ isVisibleViewConsumption: !this.state.isVisibleViewConsumption, device:device });
        
    }

    sendMessage = (msg) => {
        this.clientRef.sendMessage('/topics/all', msg);
      }



    render() {
        return (
            <div>

                <CardHeader>
                    <strong> Devices Management</strong>
                </CardHeader>

                <Card >
                    <br />
                    <br />

                    {this.state.isLoadedDevices && <ClientDevicesTable tableData={this.state.clientDevicesTableData} handleViewConsumptionClick={this.handleViewConsumptionClick} reload={this.reload} />}
                    {this.state.errorStatus > 0 && <APIResponseErrorMessage
                        errorStatus={this.state.errorStatus}
                        error={this.state.error}
                    />}
                </Card>

                <Modal isOpen={this.state.isVisibleViewConsumption} toggle={this.handleViewConsumptionClick}
                    className={this.props.className} size="lg">
                    <ModalHeader toggle={this.handleViewConsumptionClick}> Select date: </ModalHeader>
                    <ModalBody>
                        <ClientConsumptionChart reloadHandler={this.reload} device={this.state.device}/>
                    </ModalBody>
                </Modal>

                <div>
                <SockJsClient url='http://localhost:8080/gs-guide-websocket' topics={['/topic/greetings']}
                    onMessage={(msg) => { 
                        if(this.currentClientId == msg.user_id)
                            {
                                console.log(msg); 
                                this.state.isCurrentClient=true; 
                                this.state.alertMessage=msg.message
                            }
                            else
                                this.state.isCurrentClient=false;
            
             }}
                ref={ (client) => { this.clientRef = client }} />
            {this.state.isCurrentClient && <Alert severity="error">{this.state.alertMessage}</Alert>}

            </div>
                
            </div >
        )

    }
}


export default ClientContainer;

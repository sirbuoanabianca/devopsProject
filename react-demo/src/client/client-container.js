import React from 'react';
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import {
    Card,
    CardHeader,
    Modal,
    ModalBody,
    ModalHeader,
} from 'reactstrap';
import ClientForm from "./components/client/client-form";
import DeviceForm from "./components/device/device-form";
import BindForm from "./components/device/bind-form";
import ClientDevicesTable from './components/device/client-devices-table';

import * as API_DEVICES from "./api/device-api"



class ClientContainer extends React.Component {

    // setErrorStatus= function(err){
    //     this.setState() state.errorStatus=err;
    // }

    constructor(props) {
        super(props);
        this.reload = this.reload.bind(this);
        this.deviceBindId = null;
        this.currentClientId = props.currentClientId;
        this.state = {
            selectedClient: false,
            selectedDevice: false,
            selectedBind: false,
            collapseForm: false,
            clientTableData: [],
            deviceTableData: [],
            isLoadedClients: false,
            isLoadedDevices: false,
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



    render() {
        return (
            <div>

                <CardHeader>
                    <strong> Devices Management</strong>
                </CardHeader>

                <Card >
                    <br />
                    <br />

                    {this.state.isLoadedDevices && <ClientDevicesTable tableData={this.state.clientDevicesTableData} reload={this.reload} />}
                    {this.state.errorStatus > 0 && <APIResponseErrorMessage
                        errorStatus={this.state.errorStatus}
                        error={this.state.error}
                    />}
                </Card>

                <Modal isOpen={this.state.selectedClient} toggle={this.addClientForm}
                    className={this.props.className} size="lg">
                    <ModalHeader toggle={this.addClientForm}> Add Client: </ModalHeader>
                    <ModalBody>
                        <ClientForm reloadHandler={this.reload} />
                    </ModalBody>
                </Modal>

                <Modal isOpen={this.state.selectedDevice} toggle={this.addDeviceForm}
                    className={this.props.className} size="lg">
                    <ModalHeader toggle={this.addDeviceForm}> Add Device: </ModalHeader>
                    <ModalBody>
                        <DeviceForm reloadHandler={this.reload} />
                    </ModalBody>
                </Modal>

                <Modal isOpen={this.state.selectedBind} toggle={this.addBindForm}
                    className={this.props.className} size="lg">
                    <ModalHeader toggle={this.addBindForm}> Bind device to user: </ModalHeader>
                    <ModalBody>
                        <BindForm reloadHandler={this.reload} tableData={this.state.clientTableData} handleSubmit={this.handleBindSubmit} />
                    </ModalBody>
                </Modal>

            </div >
        )

    }
}


export default ClientContainer;

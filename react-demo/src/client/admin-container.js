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
import ClientEditableTable from './components/client/client-editable-table';
import DeviceEditableTable from './components/device/device-editable-table';

import * as API_USERS from "./api/client-api"
import * as API_DEVICES from "./api/device-api"
import "../commons/tables/fields/styles/client-table-style.css";



class AdminContainer extends React.Component {

    // setErrorStatus= function(err){
    //     this.setState() state.errorStatus=err;
    // }

    constructor(props) {
        super(props);
        this.addClientForm = this.toggleClientForm.bind(this);
        this.addDeviceForm = this.toggleDeviceForm.bind(this);
        this.addBindForm = this.toggleBindForm.bind(this);
        this.reload = this.reload.bind(this);
        this.deviceBindId = null;
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
        this.fetchClients();
        this.fetchDevices();
    }

    fetchClients() {
        return API_USERS.getClients((result, status, err) => {

            if (result !== null && status === 200) {
                this.setState({
                    clientTableData: result,
                    isLoadedClients: true
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });
    }

    fetchDevices() {
        return API_DEVICES.getDevices((result, status, err) => {

            if (result !== null && status === 200) {

                this.setState({
                    deviceTableData: result,
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

    toggleClientForm() {
        this.setState({ selectedClient: !this.state.selectedClient });
    }

    toggleDeviceForm() {
        this.setState({ selectedDevice: !this.state.selectedDevice });
    }

    toggleBindForm() {
        this.setState({ selectedBind: !this.state.selectedBind });
    }

    handleBindForm = (deviceId) => {
        this.deviceBindId = deviceId;
        this.toggleBindForm();
    }

    disableForms() {
        this.setState({ selectedClient: false, selectedDevice: false, selectedBind: false });
    }

    handleBindSubmit = (client) => {
        return API_DEVICES.bindDeviceToUser(this.deviceBindId, client.id, (result, status, err) => {

            if (result !== null && status === 200) {
                this.reload();
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
        this.disableForms();
        this.fetchClients();
        this.fetchDevices();
    }



    render() {
        return (
            <div>
                <CardHeader>
                    <strong> Client Management  <button margin-left="300px" onClick={this.addClientForm}>Add new client</button> </strong>
                </CardHeader>
                <Card >
                    <br />
                    <br />

                    {this.state.isLoadedClients && <ClientEditableTable tableData={this.state.clientTableData} reload={this.reload} />}
                    {this.state.errorStatus > 0 && <APIResponseErrorMessage
                        errorStatus={this.state.errorStatus}
                        error={this.state.error}
                    />}
                </Card>


                <CardHeader>
                    <strong> Devices Management  <button margin-left="300px" onClick={this.addDeviceForm}>Add new device</button></strong>
                </CardHeader>

                <Card >
                    <br />
                    <br />

                    {this.state.isLoadedDevices && <DeviceEditableTable tableData={this.state.deviceTableData} reload={this.reload} handleBind={this.handleBindForm} />}
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


export default AdminContainer;

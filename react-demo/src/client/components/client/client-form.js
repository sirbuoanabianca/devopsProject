import React from 'react';
import validate from "../validators/client-validators";
import Button from "react-bootstrap/Button";
import * as API_USERS from "../../api/client-api";
import APIResponseErrorMessage from "../../../commons/errorhandling/api-response-error-message";
import { Col, Row } from "reactstrap";
import { FormGroup, Input, Label } from 'reactstrap';

class ClientForm extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reloadHandler = this.props.reloadHandler;

        this.state = {

            errorStatus: 0,
            error: null,

            formIsValid: false,

            formControls: {
                username: {
                    value: '',
                    placeholder: 'What is the username?...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                password: {
                    value: '',
                    placeholder: 'Password...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        passValidator: true,
                        isRequired: true

                    }
                },
                role: {
                    value: '',
                    placeholder: 'Role...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        roleValidator: true,
                        isRequired: true

                    }
                },

            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleForm() {
        this.setState({ collapseForm: !this.state.collapseForm });
    }


    handleChange = event => {

        const name = event.target.name;
        const value = event.target.value;

        const updatedControls = this.state.formControls;

        const updatedFormElement = updatedControls[name];

        updatedFormElement.value = value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = validate(value, updatedFormElement.validationRules);
        updatedControls[name] = updatedFormElement;

        let formIsValid = true;
        for (let updatedFormElementName in updatedControls) {
            formIsValid = updatedControls[updatedFormElementName].valid && formIsValid;
        }

        this.setState({
            formControls: updatedControls,
            formIsValid: formIsValid
        });

    };

    addClient(client) {
        return API_USERS.postClient(client, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully inserted client with id: " + result);
                this.reloadHandler();
            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
                }));
            }
        });
    }

    handleSubmit() {
        let client = {
            username: this.state.formControls.username.value,
            password: this.state.formControls.password.value,
            role: this.state.formControls.role.value,
        };

        console.log(client);
        this.addClient(client);
    }



    render() {
        return (
            <div>

                <FormGroup id='username'>
                    <Label for='userNameField'> Username: </Label>
                    <Input name='username' id='userNameField' placeholder={this.state.formControls.username.placeholder}
                        onChange={this.handleChange}
                        defaultValue={this.state.formControls.username.value}
                        touched={this.state.formControls.username.touched ? 1 : 0}
                        valid={this.state.formControls.username.valid}
                        required
                    />
                    {this.state.formControls.username.touched && !this.state.formControls.username.valid &&
                        <div className={"error-message row"}> * Username must have at least 3 characters </div>}
                </FormGroup>

                <FormGroup id='password'>
                    <Label for='passwordField'> Password: </Label>
                    <Input name='password' id='passwordField' placeholder={this.state.formControls.password.placeholder}
                        onChange={this.handleChange}
                        defaultValue={this.state.formControls.password.value}
                        touched={this.state.formControls.password.touched ? 1 : 0}
                        valid={this.state.formControls.password.valid}
                        required
                    />
                    {this.state.formControls.password.touched && !this.state.formControls.password.valid &&
                        <div className={"error-message"}> * Password must have at least 1 digit, 1 one uppercase, 1 lowercase letter</div>}
                </FormGroup>

                <FormGroup id='role'>
                    <Label for='roleField'> Role: </Label>
                    {/* <Dropdown
                        name="role"
                        title="Select a role"
                        list={this.roles}
                        onChange={this.onChange}
                    /> */}

                    <Input name='role' id='roleField' placeholder={this.state.formControls.role.placeholder}
                        onChange={this.handleChange}
                        defaultValue={this.state.formControls.role.value}
                        touched={this.state.formControls.role.touched ? 1 : 0}
                        valid={this.state.formControls.role.valid}
                        required

                    />
                    {this.state.formControls.role.touched && !this.state.formControls.role.valid &&
                        <div className={"error-message"}> * The role must be: user or admin</div>}
                </FormGroup>


                <Row>
                    <Col sm={{ size: '4', offset: 8 }}>
                        <Button type={"submit"} disabled={!this.state.formIsValid} onClick={this.handleSubmit}>  Add </Button>
                    </Col>
                </Row>

                {
                    this.state.errorStatus > 0 &&
                    <APIResponseErrorMessage errorStatus={this.state.errorStatus} error={this.state.error} />
                }
            </div>
        );
    }
}

export default ClientForm;

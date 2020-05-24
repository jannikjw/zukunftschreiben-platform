import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {  Form, 
          Checkbox, 
          Header, 
          Button, 
          Dropdown,
         } from 'semantic-ui-react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { projectActions } from '../../store/actions';
import { projectConstants } from '../../store/constants';

import './CreateProjectPage.scss';

class CreateProjectPage extends React.Component {
  constructor(props) {
    super(props);
  
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      title: "",
      description: "",
      category: "",
      status: "hidden",
      startDate: new Date(),
      endDate: new Date(),
      likes: 0,
      submitted: false,
      picture: null,
      categoryOptions: [
        { key: 'School', text: 'School', value: 'School'},
        { key: 'Reading', text: 'Reading', value: 'Reading'},
        { key: 'Writing', text: 'Writing', value: 'Writing'},
      ]
    };
  }

  fileInputRef = React.createRef();

  handleChange = field => (event, { value }) => {
    this.setState({[field]: value})
 }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ submitted: true });
    const { title, description, category, status, startDate, endDate } = this.state;
    const { dispatch } = this.props;
    if (this.handleLocalErrors()) {
      dispatch(projectActions.create(title, description, category, status, startDate, endDate))
    }
  }

  handleLocalErrors() {
    const { title, description, category, status, startDate, endDate } = this.state;
    const { dispatch } = this.props;

    let validationErrors = [];

    if (!title) {
      validationErrors.push({
        value: title,
        msg: 'A Title is required.',
        param: 'title',
        location: 'local'
      })
    }

    if (!description) {
      validationErrors.push({
        value: description,
        msg: 'A Description is required.',
        param: 'description',
        location: 'local'
      })
    }

    if (!category) {
      validationErrors.push({
        value: category,
        msg: 'A category is required.',
        param: 'category',
        location: 'local'
      })
    }

    if (!status) {
      validationErrors.push({
        value: status,
        msg: 'A Status is required. Default is hidden!',
        param: 'status',
        location: 'local'
      })
    }

    if (!startDate) {
      validationErrors.push({
        value: startDate,
        msg: 'startDate is required.',
        param: 'startDate',
        location: 'local'
      })
    }

    if (!endDate) {
      validationErrors.push({
        value: endDate,
        msg: 'Password confirmation is required.',
        param: 'endDate',
        location: 'local'
      })
    }

    if (endDate && startDate >= endDate) {
      validationErrors.push({
        value: endDate,
        msg: 'The End Date has to be after the Start Date.',
        param: 'endDate',
        location: 'local'
      })
    }

    if (validationErrors.length > 0) {
      function failure(error) { return { type: projectConstants.CREATE_REQUEST_FAILED, error } }
      dispatch(failure({
        status: 0,
        message: 'Local Validation Error.',
        data: validationErrors
      }));
      return false
    }

    return true;
  }

  errorsForField(name) {
    const { errors } = this.props;

    if (!errors) {
      return '';
    }
    if (!errors.data) {
      return '';
    }
    if (!errors.data.length > 0) {
      return '';
    }
    return errors.data
      .filter(e => e.param === name)
      .map(e => <div className="error" key={e.msg}>{e.msg}</div>)
  }

  fieldHasError(name) {
    return this.errorsForField(name).length > 0
  }

  showLocalErrorMessages() {
    const { errors } = this.props;
    // error messages from the clients should only be shown, if there are now errors from the server yet
    return !errors || !errors.data || !errors.data.length;
  }

  showFieldIndependentErrorMessage() {
    const { errors } = this.props;
    // only show the field-independent error message, if the are none related to a specific field
    return errors && errors.message && (!errors.data || !errors.data.length);
  }

  render() {
    const { creating, errors } = this.props;
    const { title, description, category, status, startDate, endDate, submitted, categoryOptions} = this.state;

    return (
      <Form>
        <Form.Input fluid label='Title' placeholder='Title' />
        <Form.Input fluid label='Description' placeholder='Description' />
        <Dropdown 
          fluid 
          search
          selection
          allowAdditions
          name="category"
          label='Category' 
          value={category}
          onChange={this.handleChange}
          options={categoryOptions}
          placeholder='Category' />
        <Form.Group widths='equal'>
          <Form.Field fluid>
            <Header>Start Date</Header>
            <DatePicker 
              label="startDate"
              name="startDate"
              selected={startDate}
              onChange={this.handleChange}  
            />
          </Form.Field>
          <Form.Field fluid>
            <Header>End Date</Header>
            <DatePicker  
              name="endDate"
              selected={endDate}
              onChange={this.handleChange}
            />
          </Form.Field>
        </Form.Group>
        <Form.Field>
          <Header>Picture</Header>
          <Button
            content="Choose Picture"
            labelPosition="left"
            icon="file"
            onClick={() => this.fileInputRef.current.click()}
          />
          <input
            ref={this.fileInputRef}
            type="file"
            hidden
            onChange={this.fileChange}
          />
        </Form.Field>
        <Form.Field>
          <Header>Hide</Header>
          <Checkbox toggle defaultChecked/>
        </Form.Field>
        <Button type="submit">Create Project</Button>
      </Form>
      // <div className="view-create-project-page">
      //   <h2>Create</h2>
      //   <div className="tagline">Create a new project.</div>
      //   <form name="form" onSubmit={this.handleSubmit}>
      //     <div className={'form-group' + (submitted && !title ? ' has-error' : '')}>
      //       <label htmlFor="title">Title</label>
      //       <input type="text" className="form-control" name="title" value={title} onChange={this.handleChange} />
      //       {
      //         this.errorsForField('title')
      //       }
      //     </div>
      //     <div className={'form-group' + (submitted && !description ? ' has-error' : '')}>
      //       <label htmlFor="description">Description</label>
      //       <input type="text" className="form-control" name="description" value={description} onChange={this.handleChange} />
      //       {
      //         this.errorsForField('description')
      //       }
      //     </div>
      //     <div className={'form-group' + (submitted && !category ? ' has-error' : '')}>
      //       <label htmlFor="category">Category</label>
      //       <input type="text" className="form-control" name="category" value={category} onChange={this.handleChange} />
      //       {
      //         this.errorsForField('category')
      //       }
      //     </div>
      //     <div className={'form-group' + (submitted && !status ? ' has-error' : '')}>
      //       <label htmlFor="status">Status</label>
      //       <input type="text" className="form-control" name="status" value={status} onChange={this.handleChange} />
      //       {
      //         this.errorsForField('status')
      //       }
      //     </div>
      //     <div className={'form-group' + (submitted && !startDate ? ' has-error' : '')}>
      //       <label htmlFor="startDate">Start Date</label>
      //       <input type="date" className="form-control" name="startDate" value={startDate} onChange={this.handleChange} />
      //       {
      //         this.errorsForField('startDate')
      //       }
      //     </div>
      //     <div className={'form-group' + (submitted && this.fieldHasError('endDate') ? ' has-error' : '')}>
      //       <label htmlFor="endDate">End Date</label>
      //       <input type="date" className="form-control" name="endDate" value={endDate} onChange={this.handleChange} />
      //       {
      //         this.errorsForField('endDate')
      //       }
      //     </div>
      //     <div className="form-group">
      //       {!creating &&
      //         <input type="submit" className="form-control" name="login" value="Create Project" />
      //       }
      //       {creating &&
      //         <input type="submit" className="form-control" name="login" value="Creating Project ..." disabled />
      //       }
      //     </div>
      //   </form>
      //   <div className="error-container">
      //     {this.showFieldIndependentErrorMessage() &&
      //       <div className="error">{errors.message}</div>
      //     }
      //   </div>
      //   <div className="link-group">
      //     <p>
      //       <Link to="/login">Already have an account?</Link>
      //     </p>
      //     <p>
      //       <Link to="/forgot-password">Forgot your password?</Link>
      //     </p>
      //   </div>
      // </div>
    );
  }
}

function mapStateToProps(state) {
  const { creating, errors } = state.project;
  return {
    creating,
    errors
  };
}

const connectedCreateProjectPage = connect(mapStateToProps)(CreateProjectPage);
export { connectedCreateProjectPage as CreateProjectPage }; 

import React from 'react';
import { connect } from 'react-redux';
import {
  Form,
  Checkbox,
  Button,
  Dropdown,
  Label,
  Image,
} from 'semantic-ui-react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { projectActions } from '../../store/actions';
import { projectConstants } from '../../store/constants';

import './EditProjectPage.scss';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}


//TODO: Increase Performance - possibly placeholders for loading time
class EditProjectPage extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleAddition = this.handleAddition.bind(this);

    this.state = {
      id: this.props.match.params.id,
      submitted: false,
      categoryOptions: [
        { key: 'School', text: 'School', value: 'School' },
        { key: 'Reading', text: 'Reading', value: 'Reading' },
        { key: 'Writing', text: 'Writing', value: 'Writing' },
      ]
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { id, waiting } = this.state
    dispatch(projectActions.getProjectAction(id))
  }

  fileInputRef = React.createRef();

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleDropdownChange = (e, { value }) => this.setState({ category: value })

  handleAddition = (e, { value }) => {
    this.setState((prevState) => ({
      categoryOptions: [{ text: value, value }, ...prevState.categoryOptions],
    }))
  }

  handleToggle(e) {
    this.setState((prevState) => ({ hidden: !prevState.hidden }))
  }

  handleFileChange = event => {
    getBase64(event.target.files[0], imageUrl => {
      this.setState({
        image: imageUrl
      })
    });
  }

  handleStartDateChange(date) {
    this.setState({
      startDate: date
    })
  }

  handleEndDateChange(date) {
    this.setState({
      endDate: date
    })
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ submitted: true });
    
    const project = this.props.editing_project;
    if (!this.state.title){
      this.setState({title: project.title})
    }
    if (!this.state.description){
      this.setState({description: project.description})
    }
    if (!this.state.category){
      this.setState({category: project.category})
    }
    if (!this.state.hidden){
      this.setState({hidden: project.hidden})
    }
    if (!this.state.startDate){
      this.setState({startDate: project.startDate})
    }
    if (!this.state.endDate){
      this.setState({endDate: project.endDate})
    }
    if (!this.state.image){
      this.setState({image: project.image})
    }
    if (!this.state.fundingGoal){
      this.setState({fundingGoal: project.fundingGoal})
    }

    const { dispatch } = this.props;
    dispatch(projectActions.update(this.state.title, this.state.description, this.state.category, this.state.hidden, this.state.startDate, this.state.endDate, this.state.image, this.state.fundingGoal, this.state.id))
  }

  handleLocalErrors() {
    const { title, description, category, startDate, endDate, image } = this.state;
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

    if (!image) {
      validationErrors.push({
        value: image,
        msg: 'An image is required',
        param: 'image',
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


  render() {
    const { categoryOptions } = this.state;
    const project = this.props.editing_project;


    return (
      <div className='view-create-project-page'>
        <Form>
          <Form.Input
            fluid
            label='Title'
            placeholder='Title'
            onChange={this.handleChange}
            value={ this.state.title || project && project.title || 'Not loaded yet' }
            name='title'
          />
          {this.errorsForField('title')}
          <Form.Input
            fluid
            label='Description'
            placeholder='Description'
            onChange={this.handleChange}
            value={ this.state.description || project && project.description || 'Not loaded yet'}
            name='description'
          />
          {this.errorsForField('description')}
          <Form.Field >
            <label>Category</label>
            <Dropdown
              options={categoryOptions}
              search
              selection
              fluid
              allowAdditions
              name="category"
              selected={ this.state.category || project && project.category || 'Not loaded yet'}
              value={ this.state.category || project && project.category || 'Not loaded yet'}
              onChange={this.handleDropdownChange}
              onAddItem={this.handleAddition}
              placeholder='Category' />
          </Form.Field>
          {this.errorsForField('category')}
          <Form.Group widths='equal'>
            <Form.Field >
              <label>Start Date</label>
              {project && <DatePicker
                name="startDate"
                selected={new Date(this.state.startDate || project && project.startDate || '')}
                onChange={this.handleStartDateChange}
                dateFormat="MM/dd/yyyy"
              />}
            </Form.Field>
            {this.errorsForField('startDate')}
            <Form.Field >
              <label>End Date</label>
              {project && <DatePicker
                name="endDate"
                selected={new Date(this.state.endDate || project && project.endDate || '')}
                onChange={this.handleEndDateChange}
                dateFormat="MM/dd/yyyy"
              />}
            </Form.Field>
            {this.errorsForField('endDate')}
          </Form.Group>
          <Form.Field>
            <label>Funding Goal</label>
            <Form.Input
              fluid
              labelPosition='right'
              type='text'
              placeholder='Funding Goal'
              onChange={this.handleChange}
              value={this.state.fundingGoal || project && project.fundingGoal || 0}
              name='fundingGoal'>
              <Label basic>€</Label>
              <input />
              <Label>.00</Label>
            </Form.Input>
          </Form.Field>
          {this.errorsForField('fundingGoal')}
          <Form.Group widths='equal'>
            <Form.Field>
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
                onChange={this.handleFileChange}
              />
            </Form.Field>
            {this.errorsForField('image')}
            <Image src={this.state.image || project && project.image || ''} />
            <Form.Field>
              <label>Hide</label>
              <Checkbox
                toggle
                name="hidden"
                onClick={this.handleToggle}
                defaultChecked />
            </Form.Field>
          </Form.Group>
          <Button type="submit" onClick={this.handleSubmit}>Edit Project</Button>
        </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { errors, editing_project, initialLoadHappened } = state.project;
  return {
    errors,
    editing_project,
    initialLoadHappened
  };
}

const connectedEditProjectPage = connect(mapStateToProps)(EditProjectPage);
export { connectedEditProjectPage as EditProjectPage }; 
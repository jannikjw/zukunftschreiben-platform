import React from 'react';
import { connect } from 'react-redux';
import {  Form, 
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

import './CreateProjectPage.scss';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
      console.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
      console.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

class CreateProjectPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleToggle =this.handleToggle.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleAddition = this.handleAddition.bind(this);

    this.state = {
      title: "",
      description: "",
      category: "",
      hidden: true,
      startDate: new Date(),
      endDate: new Date(),
      fundingGoal: 1000,
      likes: 0,
      submitted: false,
      image: null,
      categoryOptions: [
        { key: 'School', text: 'School', value: 'School'},
        { key: 'Reading', text: 'Reading', value: 'Reading'},
        { key: 'Writing', text: 'Writing', value: 'Writing'},
      ]
    };
  }

  fileInputRef = React.createRef();

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleDropdownChange = (e, { value }) => this.setState({category: value })

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

  handleStartDateChange(date){
    this.setState({
      startDate: date
    })
  }

  handleEndDateChange(date){
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
    const { title, description, category, hidden, startDate, endDate, image, fundingGoal } = this.state;
    const { dispatch } = this.props;
    if (this.handleLocalErrors()) {
      dispatch(projectActions.create(title, description, category, hidden, startDate, endDate, image, fundingGoal))
    }
    this.sleep(1000).then(()=> {
      window.location = "/"
    })
  }

  handleLocalErrors() {
    const { title, description, category, startDate, endDate, image, fundingGoal } = this.state;
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
    const { title, description, category, startDate, endDate, fundingGoal, categoryOptions} = this.state;

    return (
      <div className='view-create-project-page'>
        <Form>
          <Form.Input 
            fluid 
            label='Title' 
            placeholder='Title' 
            onChange={this.handleChange} 
            value={title}
            name='title'
            />
          {this.errorsForField('title')}
          <Form.Input 
            fluid 
            label='Description' 
            placeholder='Description' 
            onChange={this.handleChange}
            value={description}
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
            value={category}
            onChange={this.handleDropdownChange}
            onAddItem={this.handleAddition}
            placeholder='Category' />
          </Form.Field>
          {this.errorsForField('category')}
          <Form.Group widths='equal'>
            <Form.Field >
              <label>Start Date</label>
              <DatePicker 
                name="startDate"
                selected={startDate}
                onChange={this.handleStartDateChange}
                dateFormat="MM/dd/yyyy"
              />
            </Form.Field>
            {this.errorsForField('startDate')}
            <Form.Field >
              <label>End Date</label>
              <DatePicker  
                name="endDate"
                selected={endDate}
                onChange={this.handleEndDateChange}
                dateFormat="MM/dd/yyyy"
              />
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
                value={fundingGoal}
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
            <Image src={this.state.image} />
            <Form.Field>
              <label>Hide</label>
              <Checkbox 
              toggle 
              name="hidden"
              onClick={this.handleToggle}
              defaultChecked/>
            </Form.Field>
          </Form.Group>
          <Button type="submit" onClick={this.handleSubmit}>Create Project</Button>
        </Form>
      </div>
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

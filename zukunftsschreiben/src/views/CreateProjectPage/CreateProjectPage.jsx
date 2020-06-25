import React from 'react';
import { connect } from 'react-redux';
import {  Form, 
          Checkbox, 
          Button, 
          Dropdown,
          Label,
          Image
         } from 'semantic-ui-react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { projectActions } from '../../store/actions';

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

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ submitted: true });
    const { title, description, category, hidden, startDate, endDate, image, fundingGoal } = this.state;
    const { dispatch } = this.props;
    dispatch(projectActions.create(title, description, category, hidden, startDate, endDate, image, fundingGoal))
  }


  render() {
    const { title, description, category, hidden, startDate, endDate, fundingGoal, categoryOptions} = this.state;

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
          <Form.Input 
            fluid 
            label='Description' 
            placeholder='Description' 
            onChange={this.handleChange}
            value={description}
            name='description'
            />
          <Form.Field fluid>
            <label>Category</label>
            <Dropdown 
            fluid 
            search
            selection
            allowAdditions
            name="category" 
            value={category}
            onChange={this.handleDropdownChange}
            options={categoryOptions}
            placeholder='Category' />
          </Form.Field>
          <Form.Group widths='equal'>
            <Form.Field fluid>
              <label>Start Date</label>
              <DatePicker 
                name="startDate"
                selected={startDate}
                onChange={this.handleStartDateChange}
                dateFormat="MM/dd/yyyy"
              />
            </Form.Field>
            <Form.Field fluid>
              <label>End Date</label>
              <DatePicker  
                name="endDate"
                selected={endDate}
                onChange={this.handleEndDateChange}
                dateFormat="MM/dd/yyyy"
              />
            </Form.Field>
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
            <Image src={this.state.image} />
            <Form.Field>
              <label>Hide</label>
              <Checkbox 
              toggle 
              name="hidden"
              onClick={this.handleToggle}
              active={hidden}
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

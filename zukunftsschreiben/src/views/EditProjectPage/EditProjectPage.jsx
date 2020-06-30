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
      title: '',
      description: '',
      category: '',
      hidden: '',
      startDate: new Date(),
      endDate: new Date(),
      image: '',
      goal: 0,
      categoryOptions: [
        { key: 'School', text: 'School', value: 'School' },
        { key: 'Reading', text: 'Reading', value: 'Reading' },
        { key: 'Writing', text: 'Writing', value: 'Writing' },
      ]
    };
  }

  componentDidMount() {
    const project = this.selectedProject();
    if (project) {
      this.setState({
        title: project.title,
        description: project.description,
        category: project.category,
        hidden: project.hidden,
        startDate: project.startDate,
        endDate: project.endDate,
        image: project.image,
        goal: project.goal,
      })
    }
  }

  selectedProject() {
    const { projects } = this.props;
    const { id } = this.state;
    if (!projects) {
      return null;
    }
    return projects.find(p => id === p._id)
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

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ submitted: true });
    const { title, description, category, hidden, startDate, endDate, image, goal, id } = this.state;
    const { dispatch } = this.props;
    if (this.handleLocalErrors()) {
      dispatch(projectActions.update(
        title, description, category, hidden, startDate, endDate, image, goal, id
      ))
    }
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

  showFieldIndepenentErrorMessage() {
    const { errors } = this.props;
    // only show the field-independet error message, if the are none related to a specific field
    return errors && errors.message && (!errors.data || !errors.data.length);
  }

  render() {
    const { loading, errors } = this.props;
    const project = this.selectedProject();
    const { categoryOptions, title, description, category, startDate, endDate, image, goal } = this.state;

    return (
      <div className='view-create-project-page'>
        {project &&
          <Form onSubmit={this.handleSubmit}>
            <Form.Input
              fluid
              label='Title'
              placeholder='Title'
              onChange={this.handleChange}
              value={title}
              name='title'
            />
            {this.errorsForField('title')}
            <textarea
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
                selected={category}
                value={category}
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
                  selected={new Date(startDate)}
                  onChange={this.handleStartDateChange}
                  dateFormat="MM/dd/yyyy"
                />}
              </Form.Field>
              {this.errorsForField('startDate')}
              <Form.Field >
                <label>End Date</label>
                {project && <DatePicker
                  name="endDate"
                  selected={new Date(endDate)}
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
                value={goal}
                name='goal'>
                <Label basic>€</Label>
                <input />
                <Label>.00</Label>
              </Form.Input>
            </Form.Field>
            {this.errorsForField('goal')}
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
              <Image src={image} />
              <Form.Field>
                <label>Hide</label>
                <Checkbox
                  toggle
                  name="hidden"
                  onClick={this.handleToggle}
                  defaultChecked />
              </Form.Field>
            </Form.Group>
            <div>
              {!loading &&
                <input type="submit" className="ui button" name="submit" value="Speichere Änderungen" />
              }
              {loading &&
                <input type="submit" className="ui button" name="submit" value="Speichere Änderungen..." disabled />
              }
            </div>
            {this.showFieldIndepenentErrorMessage() &&
              <div className="error">{errors.message}</div>
            }
          </Form>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { errors, projects, initialLoadHappened, loading } = state.project;
  return {
    errors,
    projects,
    loading,
    initialLoadHappened
  };
}

const connectedEditProjectPage = connect(mapStateToProps)(EditProjectPage);
export { connectedEditProjectPage as EditProjectPage }; 
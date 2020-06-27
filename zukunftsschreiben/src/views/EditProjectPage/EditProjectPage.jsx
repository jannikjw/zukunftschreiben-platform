import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import qs from "qs";

import { projectActions } from '../../store/actions';
import { projectConstants } from '../../store/constants';

import './EditProjectPage.scss';

class EditProjectPage extends React.Component {
  constructor(props) {
    super(props);

    const query = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    });
    console.log(query.id)
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      id: query.id ,
      title: "",
      description: "",
      category: "",
      status: "hidden",
      startDate: new Date(),
      endDate: new Date(),
      likes: 0,
      edited: false,
      statusList: ['hidden', 'visible'],
    };
  }

  componentDidMount(){
    new Promise((resolve, reject) => {
      this.props.dispatch(projectActions.getProject(this.state.id));
      resolve();
    }).then(() => {
      this.setState({
        title: this.props.editing_project.title,
        description: this.props.editing_project.description,
        category: this.props.editing_project.category,
        status: this.props.editing_project.status,
        startDate: new Date(this.props.editing_project.startDate),
        endDate: new Date(this.props.editing_project.endDate),
        likes: this.props.editing_project.likes,
      })
    });
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ edited: true });
    const { title, description, category, status, startDate, endDate } = this.state;
    const { dispatch } = this.props;
    if (this.handleLocalErrors()) {
      dispatch(projectActions.edit(title, description, category, status, startDate, endDate))
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
      function failure(error) { return { type: projectConstants.EDIT_REQUEST_FAILED, error } }
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
    const { editing, errors, getting, project,  } = this.props;
    const { title, description, category, status, startDate, endDate, edited } = this.state;

    return (
      <div className="view-edit-project-page">
        <h2>Edit</h2>
        <div className="tagline">Edit project.</div>
        <form name="form" onSubmit={this.handleSubmit}>
          <div className={'form-group' + (edited && project && !project.title ? ' has-error' : '')}>
            <label htmlFor="title">Title</label>
            <input type="text" className="form-control" name="title" value={title} onChange={this.handleChange} />
            {
              this.errorsForField('title')
            }
          </div>
          <div className={'form-group' + (edited && !description ? ' has-error' : '')}>
            <label htmlFor="description">Description</label>
            <input type="text" className="form-control" name="description" value={description} onChange={this.handleChange} />
            {
              this.errorsForField('description')
            }
          </div>
          <div className={'form-group' + (edited && !category ? ' has-error' : '')}>
            <label htmlFor="category">Category</label>
            <input type="text" className="form-control" name="category" value={category} onChange={this.handleChange} />
            {
              this.errorsForField('category')
            }
          </div>
          <div className={'form-group' + (edited && !status ? ' has-error' : '')}>
            <label htmlFor="status">Status</label>
            <input type="text" className="form-control" name="status" value={status} onChange={this.handleChange} />
            {
              this.errorsForField('status')
            }
          </div>
          <div className={'form-group' + (edited && !startDate ? ' has-error' : '')}>
            <label htmlFor="startDate">Start Date</label>
            <input type="date" className="form-control" name="startDate" value={startDate} onChange={this.handleChange} />
            {
              this.errorsForField('startDate')
            }
          </div>
          <div className={'form-group' + (edited && this.fieldHasError('endDate') ? ' has-error' : '')}>
            <label htmlFor="endDate">End Date</label>
            <input type="date" className="form-control" name="endDate" value={endDate} onChange={this.handleChange} />
            {
              this.errorsForField('endDate')
            }
          </div>
          <div className="form-group">
            {!editing &&
              <input type="submit" className="form-control" name="login" value="Edit Project" />
            }
            {editing &&
              <input type="submit" className="form-control" name="login" value="Editing Project ..." disabled />
            }
          </div>
        </form>
        <div className="error-container">
          {this.showFieldIndependentErrorMessage() &&
            <div className="error">{errors.message}</div>
          }
        </div>
        <div className="link-group">
          <p>
            <Link to="/login">Already have an account?</Link>
          </p>
          <p>
            <Link to="/forgot-password">Forgot your password?</Link>
          </p>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { editing, errors, editing_project, getting,  } = state.project;
  return {
    editing,
    errors,
    editing_project,
    getting
  };
}

const connectedEditProjectPage = connect(mapStateToProps)(EditProjectPage);
export { connectedEditProjectPage as EditProjectPage }; 

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { projectActions } from '../../store/actions/project.actions';
import { PaymentProgress } from '../../components/PaymentProgress';
import { Grid, Form, Select } from 'semantic-ui-react'
import './ProjectAddressPage.scss';


class ProjectAddressPage extends Component {
  constructor(props) {
    super(props);

    const project_id = this.props.match.params.project_id;

    this.state = {
      submitted: false,
      amount: 0,
      period: "",
      project_id: project_id
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRadio = this.handleRadio.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ submitted: true });
    const project = this.selectProject();
    window.location = "/projekte/" + (project && project._id) + "/thanks"
  }

  handleRadio(e, { value }) {
    this.setState({ value })
  }

  componentDidMount() {
    this.props.dispatch(projectActions.getAll());
  }

  selectProject() {
    const { projects } = this.props;
    const { project_id } = this.state;
    if (!projects || !project_id) { return null }
    return projects.find(p => project_id === p._id)
  }


  render() {
    const project = this.selectProject();
    const { loading } = this.props;
    //TODO: All input fields should have error checks and backend functionality to save the users
    //extra but optional data when logged in
    //Also a possibility to sign up here instead of before the donation process would make sense
    return (
      <div className="view-project-detail-page">
        <Grid stackable>
          <Grid.Row>
            <PaymentProgress activeStep='2' />
          </Grid.Row>
          <Grid.Column className='infoColumn'>
            <h1 className='projectTitle'>{project && project.title}</h1>
            <p>{project && project.description}</p>
          </Grid.Column>
          <Grid.Column className='donationColumn'>
            <Grid.Row>
              <Form size='large' onSubmit={this.handleSubmit}>
                <Form.Group inline>
                  <label>Anrede</label>
                  <Form.Radio
                    label='Herr'
                    value='herr'
                    checked={this.state.value === 'herr'}
                    onChange={this.handleRadio}
                  />
                  <Form.Radio
                    label='Frau'
                    value='frau'
                    checked={this.state.value === 'frau'}
                    onChange={this.handleRadio}
                  />
                  <Form.Radio
                    label='Divers'
                    value='divers'
                    checked={this.state.value === 'divers'}
                    onChange={this.handleRadio}
                  />
                  <Form.Radio
                    label='Firma'
                    value='firma'
                    checked={this.state.value === 'firma'}
                    onChange={this.handleRadio}
                  />
                  <Form.Radio
                    label='Familie'
                    value='familie'
                    checked={this.state.value === 'familie'}
                    onChange={this.handleRadio}
                  />
                </Form.Group>
                <Form.Group widths='equal'>
                  <Form.Input fluid label='Vorname ' placeholder='Vorname' />
                  <Form.Input fluid label='Nachname' placeholder='Nachname' />
                </Form.Group>
                <Form.Group widths='equal'>
                  <Form.Input fluid label='E-Mail ' placeholder='E-Mail' />
                </Form.Group>
                <Form.Group>
                  <Form.Input fluid width={12} label='Strasse' placeholder='Strasse' />
                  <Form.Input fluid width={4} label='Hausnummer' placeholder='Nummer' />
                </Form.Group>
                <Form.Group>
                  <Form.Input fluid width={4} label='Postleitzahl' placeholder='PLZ' />
                  <Form.Input fluid width={12} label='Stadt' placeholder='Stadt' />
                  <Select placeholder='Land' options={countryOptions} />
                </Form.Group>
                <Form.Group>
                  <Form.Input fluid width={4} label='Vorwahl' placeholder='+49' />
                  <Form.Input fluid width={12} label='Telefonnummer' placeholder='157 123456789' />
                </Form.Group>
                <div>
                  {/* This should continue to a payment selection site where the Paypal PLUS 
                and Stripe API are used to host different payment providers */}
                  {!loading &&
                    <input type="submit" className="ui button" name="donate" value="Weiter" />
                  }
                  {loading &&
                    <input type="submit" className="ui button" name="donate" value="Weiter..." disabled />
                  }
                </div>
              </Form>
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { login, project } = state;
  return {
    user: login.user,
    projects: project.projects,
    loading: project.loading
  };
}

const countryOptions = [
  { key: 'af', value: 'af', text: 'Afghanistan' },
  { key: 'ål', value: 'ål', text: 'Åland Islands' },
  { key: 'al', value: 'al', text: 'Albania' },
  { key: 'al', value: 'al', text: 'Algeria' },
  { key: 'am', value: 'am', text: 'American Samoa' },
  { key: 'an', value: 'an', text: 'Andorra' },
  { key: 'an', value: 'an', text: 'Angola' },
  { key: 'an', value: 'an', text: 'Anguilla' },
  { key: 'an', value: 'an', text: 'Antarctica' },
  { key: 'an', value: 'an', text: 'Antigua and Barbuda' },
  { key: 'ar', value: 'ar', text: 'Argentina' },
  { key: 'ar', value: 'ar', text: 'Armenia' },
  { key: 'ar', value: 'ar', text: 'Aruba' },
  { key: 'au', value: 'au', text: 'Australia' },
  { key: 'au', value: 'au', text: 'Austria' },
  { key: 'az', value: 'az', text: 'Azerbaijan' },
  { key: 'ba', value: 'ba', text: 'Bahamas' },
  { key: 'ba', value: 'ba', text: 'Bahrain' },
  { key: 'ba', value: 'ba', text: 'Bangladesh' },
  { key: 'ba', value: 'ba', text: 'Barbados' },
  { key: 'be', value: 'be', text: 'Belarus' },
  { key: 'be', value: 'be', text: 'Belgium' },
  { key: 'be', value: 'be', text: 'Belize' },
  { key: 'be', value: 'be', text: 'Benin' },
  { key: 'be', value: 'be', text: 'Bermuda' },
  { key: 'bh', value: 'bh', text: 'Bhutan' },
  { key: 'bo', value: 'bo', text: 'Bolivia' },
  { key: 'bo', value: 'bo', text: 'Bosnia and Herzegovina' },
  { key: 'bo', value: 'bo', text: 'Botswana' },
  { key: 'bo', value: 'bo', text: 'Bouvet Island' },
  { key: 'br', value: 'br', text: 'Brazil' },
  { key: 'br', value: 'br', text: 'British Indian Ocean Territory' },
  { key: 'br', value: 'br', text: 'Brunei Darussalam' },
  { key: 'bu', value: 'bu', text: 'Bulgaria' },
  { key: 'bu', value: 'bu', text: 'Burkina Faso' },
  { key: 'bu', value: 'bu', text: 'Burundi' },
  { key: 'ca', value: 'ca', text: 'Cambodia' },
  { key: 'ca', value: 'ca', text: 'Cameroon' },
  { key: 'ca', value: 'ca', text: 'Canada' },
  { key: 'ca', value: 'ca', text: 'Cape Verde' },
  { key: 'ca', value: 'ca', text: 'Cayman Islands' },
  { key: 'ce', value: 'ce', text: 'Central African Republic' },
  { key: 'ch', value: 'ch', text: 'Chad' },
  { key: 'ch', value: 'ch', text: 'Chile' },
  { key: 'ch', value: 'ch', text: 'China' },
  { key: 'ch', value: 'ch', text: 'Christmas Island' },
  { key: 'co', value: 'co', text: 'Cocos (Keeling) Islands' },
  { key: 'co', value: 'co', text: 'Colombia' },
  { key: 'co', value: 'co', text: 'Comoros' },
  { key: 'co', value: 'co', text: 'Congo' },
  { key: 'co', value: 'co', text: 'Congo, The Democratic Republic of The' },
  { key: 'co', value: 'co', text: 'Cook Islands' },
  { key: 'co', value: 'co', text: 'Costa Rica' },
  { key: 'co', value: 'co', text: 'Cote Divoire' },
  { key: 'cr', value: 'cr', text: 'Croatia' },
  { key: 'cu', value: 'cu', text: 'Cuba' },
  { key: 'cy', value: 'cy', text: 'Cyprus' },
  { key: 'cz', value: 'cz', text: 'Czechia' },
  { key: 'de', value: 'de', text: 'Denmark' },
  { key: 'dj', value: 'dj', text: 'Djibouti' },
  { key: 'do', value: 'do', text: 'Dominica' },
  { key: 'do', value: 'do', text: 'Dominican Republic' },
  { key: 'ec', value: 'ec', text: 'Ecuador' },
  { key: 'eg', value: 'eg', text: 'Egypt' },
  { key: 'el', value: 'el', text: 'El Salvador' },
  { key: 'eq', value: 'eq', text: 'Equatorial Guinea' },
  { key: 'er', value: 'er', text: 'Eritrea' },
  { key: 'es', value: 'es', text: 'Estonia' },
  { key: 'et', value: 'et', text: 'Ethiopia' },
  { key: 'fa', value: 'fa', text: 'Falkland Islands (Malvinas)' },
  { key: 'fa', value: 'fa', text: 'Faroe Islands' },
  { key: 'fi', value: 'fi', text: 'Fiji' },
  { key: 'fi', value: 'fi', text: 'Finland' },
  { key: 'fr', value: 'fr', text: 'France' },
  { key: 'fr', value: 'fr', text: 'French Guiana' },
  { key: 'fr', value: 'fr', text: 'French Polynesia' },
  { key: 'fr', value: 'fr', text: 'French Southern Territories' },
  { key: 'ga', value: 'ga', text: 'Gabon' },
  { key: 'ga', value: 'ga', text: 'Gambia' },
  { key: 'ge', value: 'ge', text: 'Georgia' },
  { key: 'ge', value: 'ge', text: 'Germany' },
  { key: 'gh', value: 'gh', text: 'Ghana' },
  { key: 'gi', value: 'gi', text: 'Gibraltar' },
  { key: 'gr', value: 'gr', text: 'Greece' },
  { key: 'gr', value: 'gr', text: 'Greenland' },
  { key: 'gr', value: 'gr', text: 'Grenada' },
  { key: 'gu', value: 'gu', text: 'Guadeloupe' },
  { key: 'gu', value: 'gu', text: 'Guam' },
  { key: 'gu', value: 'gu', text: 'Guatemala' },
  { key: 'gu', value: 'gu', text: 'Guernsey' },
  { key: 'gu', value: 'gu', text: 'Guinea' },
  { key: 'gu', value: 'gu', text: 'Guinea-bissau' },
  { key: 'gu', value: 'gu', text: 'Guyana' },
  { key: 'ha', value: 'ha', text: 'Haiti' },
  { key: 'he', value: 'he', text: 'Heard Island and Mcdonald Islands' },
  { key: 'ho', value: 'ho', text: 'Holy See (Vatican City State)' },
  { key: 'ho', value: 'ho', text: 'Honduras' },
  { key: 'ho', value: 'ho', text: 'Hong Kong' },
  { key: 'hu', value: 'hu', text: 'Hungary' },
  { key: 'ic', value: 'ic', text: 'Iceland' },
  { key: 'in', value: 'in', text: 'India' },
  { key: 'in', value: 'in', text: 'Indonesia' },
  { key: 'ir', value: 'ir', text: 'Iran, Islamic Republic of' },
  { key: 'ir', value: 'ir', text: 'Iraq' },
  { key: 'ir', value: 'ir', text: 'Ireland' },
  { key: 'is', value: 'is', text: 'Isle of Man' },
  { key: 'is', value: 'is', text: 'Israel' },
  { key: 'it', value: 'it', text: 'Italy' },
  { key: 'ja', value: 'ja', text: 'Jamaica' },
  { key: 'ja', value: 'ja', text: 'Japan' },
  { key: 'je', value: 'je', text: 'Jersey' },
  { key: 'jo', value: 'jo', text: 'Jordan' },
  { key: 'ka', value: 'ka', text: 'Kazakhstan' },
  { key: 'ke', value: 'ke', text: 'Kenya' },
  { key: 'ki', value: 'ki', text: 'Kiribati' },
  { key: 'ko', value: 'ko', text: 'Korea, Democratic Peoples Republic of' },
  { key: 'ko', value: 'ko', text: 'Korea, Republic of' },
  { key: 'ku', value: 'ku', text: 'Kuwait' },
  { key: 'ky', value: 'ky', text: 'Kyrgyzstan' },
  { key: 'la', value: 'la', text: 'Lao Peoples Democratic Republic' },
  { key: 'la', value: 'la', text: 'Latvia' },
  { key: 'le', value: 'le', text: 'Lebanon' },
  { key: 'le', value: 'le', text: 'Lesotho' },
  { key: 'li', value: 'li', text: 'Liberia' },
  { key: 'li', value: 'li', text: 'Libyan Arab Jamahiriya' },
  { key: 'li', value: 'li', text: 'Liechtenstein' },
  { key: 'li', value: 'li', text: 'Lithuania' },
  { key: 'lu', value: 'lu', text: 'Luxembourg' },
  { key: 'ma', value: 'ma', text: 'Macao' },
  { key: 'ma', value: 'ma', text: 'Macedonia, The Former Yugoslav Republic of' },
  { key: 'ma', value: 'ma', text: 'Madagascar' },
  { key: 'ma', value: 'ma', text: 'Malawi' },
  { key: 'ma', value: 'ma', text: 'Malaysia' },
  { key: 'ma', value: 'ma', text: 'Maldives' },
  { key: 'ma', value: 'ma', text: 'Mali' },
  { key: 'ma', value: 'ma', text: 'Malta' },
  { key: 'ma', value: 'ma', text: 'Marshall Islands' },
  { key: 'ma', value: 'ma', text: 'Martinique' },
  { key: 'ma', value: 'ma', text: 'Mauritania' },
  { key: 'ma', value: 'ma', text: 'Mauritius' },
  { key: 'ma', value: 'ma', text: 'Mayotte' },
  { key: 'me', value: 'me', text: 'Mexico' },
  { key: 'mi', value: 'mi', text: 'Micronesia, Federated States of' },
  { key: 'mo', value: 'mo', text: 'Moldova, Republic of' },
  { key: 'mo', value: 'mo', text: 'Monaco' },
  { key: 'mo', value: 'mo', text: 'Mongolia' },
  { key: 'mo', value: 'mo', text: 'Montenegro' },
  { key: 'mo', value: 'mo', text: 'Montserrat' },
  { key: 'mo', value: 'mo', text: 'Morocco' },
  { key: 'mo', value: 'mo', text: 'Mozambique' },
  { key: 'my', value: 'my', text: 'Myanmar' },
  { key: 'na', value: 'na', text: 'Namibia' },
  { key: 'na', value: 'na', text: 'Nauru' },
  { key: 'ne', value: 'ne', text: 'Nepal' },
  { key: 'ne', value: 'ne', text: 'Netherlands' },
  { key: 'ne', value: 'ne', text: 'Netherlands Antilles' },
  { key: 'ne', value: 'ne', text: 'New Caledonia' },
  { key: 'ne', value: 'ne', text: 'New Zealand' },
  { key: 'ni', value: 'ni', text: 'Nicaragua' },
  { key: 'ni', value: 'ni', text: 'Niger' },
  { key: 'ni', value: 'ni', text: 'Nigeria' },
  { key: 'ni', value: 'ni', text: 'Niue' },
  { key: 'no', value: 'no', text: 'Norfolk Island' },
  { key: 'no', value: 'no', text: 'Northern Mariana Islands' },
  { key: 'no', value: 'no', text: 'Norway' },
  { key: 'om', value: 'om', text: 'Oman' },
  { key: 'pa', value: 'pa', text: 'Pakistan' },
  { key: 'pa', value: 'pa', text: 'Palau' },
  { key: 'pa', value: 'pa', text: 'Palestinian Territory, Occupied' },
  { key: 'pa', value: 'pa', text: 'Panama' },
  { key: 'pa', value: 'pa', text: 'Papua New Guinea' },
  { key: 'pa', value: 'pa', text: 'Paraguay' },
  { key: 'pe', value: 'pe', text: 'Peru' },
  { key: 'ph', value: 'ph', text: 'Philippines' },
  { key: 'pi', value: 'pi', text: 'Pitcairn' },
  { key: 'po', value: 'po', text: 'Poland' },
  { key: 'po', value: 'po', text: 'Portugal' },
  { key: 'pu', value: 'pu', text: 'Puerto Rico' },
  { key: 'qa', value: 'qa', text: 'Qatar' },
  { key: 're', value: 're', text: 'Reunion' },
  { key: 'ro', value: 'ro', text: 'Romania' },
  { key: 'ru', value: 'ru', text: 'Russian Federation' },
  { key: 'rw', value: 'rw', text: 'Rwanda' },
  { key: 'sa', value: 'sa', text: 'Saint Helena' },
  { key: 'sa', value: 'sa', text: 'Saint Kitts and Nevis' },
  { key: 'sa', value: 'sa', text: 'Saint Lucia' },
  { key: 'sa', value: 'sa', text: 'Saint Pierre and Miquelon' },
  { key: 'sa', value: 'sa', text: 'Saint Vincent and The Grenadines' },
  { key: 'sa', value: 'sa', text: 'Samoa' },
  { key: 'sa', value: 'sa', text: 'San Marino' },
  { key: 'sa', value: 'sa', text: 'Sao Tome and Principe' },
  { key: 'sa', value: 'sa', text: 'Saudi Arabia' },
  { key: 'se', value: 'se', text: 'Senegal' },
  { key: 'se', value: 'se', text: 'Serbia' },
  { key: 'se', value: 'se', text: 'Seychelles' },
  { key: 'si', value: 'si', text: 'Sierra Leone' },
  { key: 'si', value: 'si', text: 'Singapore' },
  { key: 'sl', value: 'sl', text: 'Slovakia' },
  { key: 'sl', value: 'sl', text: 'Slovenia' },
  { key: 'so', value: 'so', text: 'Solomon Islands' },
  { key: 'so', value: 'so', text: 'Somalia' },
  { key: 'so', value: 'so', text: 'South Africa' },
  { key: 'so', value: 'so', text: 'South Georgia and The South Sandwich Islands' },
  { key: 'sp', value: 'sp', text: 'Spain' },
  { key: 'sr', value: 'sr', text: 'Sri Lanka' },
  { key: 'su', value: 'su', text: 'Sudan' },
  { key: 'su', value: 'su', text: 'Suriname' },
  { key: 'sv', value: 'sv', text: 'Svalbard and Jan Mayen' },
  { key: 'sw', value: 'sw', text: 'Swaziland' },
  { key: 'sw', value: 'sw', text: 'Sweden' },
  { key: 'sw', value: 'sw', text: 'Switzerland' },
  { key: 'sy', value: 'sy', text: 'Syrian Arab Republic' },
  { key: 'ta', value: 'ta', text: 'Taiwan, Province of China' },
  { key: 'ta', value: 'ta', text: 'Tajikistan' },
  { key: 'ta', value: 'ta', text: 'Tanzania, United Republic of' },
  { key: 'th', value: 'th', text: 'Thailand' },
  { key: 'ti', value: 'ti', text: 'Timor-leste' },
  { key: 'to', value: 'to', text: 'Togo' },
  { key: 'to', value: 'to', text: 'Tokelau' },
  { key: 'to', value: 'to', text: 'Tonga' },
  { key: 'tr', value: 'tr', text: 'Trinidad and Tobago' },
  { key: 'tu', value: 'tu', text: 'Tunisia' },
  { key: 'tu', value: 'tu', text: 'Turkey' },
  { key: 'tu', value: 'tu', text: 'Turkmenistan' },
  { key: 'tu', value: 'tu', text: 'Turks and Caicos Islands' },
  { key: 'tu', value: 'tu', text: 'Tuvalu' },
  { key: 'ug', value: 'ug', text: 'Uganda' },
  { key: 'uk', value: 'uk', text: 'Ukraine' },
  { key: 'un', value: 'un', text: 'United Arab Emirates' },
  { key: 'un', value: 'un', text: 'United Kingdom' },
  { key: 'un', value: 'un', text: 'United States' },
  { key: 'un', value: 'un', text: 'United States Minor Outlying Islands' },
  { key: 'ur', value: 'ur', text: 'Uruguay' },
  { key: 'uz', value: 'uz', text: 'Uzbekistan' },
  { key: 'va', value: 'va', text: 'Vanuatu' },
  { key: 've', value: 've', text: 'Venezuela' },
  { key: 'vi', value: 'vi', text: 'Viet Nam' },
  { key: 'vi', value: 'vi', text: 'Virgin Islands, British' },
  { key: 'vi', value: 'vi', text: 'Virgin Islands, U.S.' },
  { key: 'wa', value: 'wa', text: 'Wallis and Futuna' },
  { key: 'we', value: 'we', text: 'Western Sahara' },
  { key: 'ye', value: 'ye', text: 'Yemen' },
  { key: 'za', value: 'za', text: 'Zambia' },
  { key: 'zi', value: 'zi', text: 'Zimbabwe' },
]

const connectedProjectAddressPage = connect(mapStateToProps)(ProjectAddressPage)
export { connectedProjectAddressPage as ProjectAddressPage }
import React, { Fragment, Component } from 'react';
import Markdown from '../Markdown';

import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';

import { Button } from 'react-bootstrap';

class ReportAProblem extends Component {
  constructor( props ) {
    super( props );

    // console.log(this)

    this.mapOptions = this.mapOptions.bind( this );
    this.onReportChange = this.onReportChange.bind( this );
    this.onReportSubmit = this.onReportSubmit.bind( this );

    this.state = {
      rapForm: {
        problem: { problem0: "", problem1: "", problem2: "", problem3: "", problem4: "", problem5: "", problem_other: "" },
        language: "",
        page: "",
      },
    };
  }

  mapOptions( option, idx ) {
    const { locale } = this.props.match.params;

    return(
      <div className="checkbox" key={ idx }>
        <label htmlFor={ `problem${ idx }` }>
          <input onChange={ this.onReportChange } name={ `problem${ idx }` } value={ option[ `text_${ locale }` ] } id={ `problem${ idx }` } type="checkbox" className="problems-form-group" />
            { option[ `text_${ locale }` ] }
        </label>
      </div>
    );
  }

  onReportChange( e ) {
    this.setState({
      rapForm: {
        problem: Object.assign( {}, this.state.rapForm.problem, {
          [ e.target.id ]: ( e.target.type === "checkbox" )
            ? e.target.checked ? e.target.value : ""
            : e.target.value
        } ),
        language: this.props.match.params.locale === "fr" ? "French" : "English",
        page: window.location.href,
      },
      submitted: false, // TODO: Disable after submit.
    });
  }

  async onReportSubmit( e ) {
    e.preventDefault && e.preventDefault();

    const { problem, language, page } = this.state.rapForm;
    
    const request = {
      problem: Object.values( problem ).join(". "),
      language: language,
      page: page,
    };

    // console.log( request );

    try {
      const result = fetch( 'http://localhost:1337/reported-problems'/* TODO: url */ , {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify( request ),
      });

      console.log( result ); // TODO: Success/Fail states
    }
    catch( err ) {
      console.log( err );
    }

  }

  render() {
    const { locale } = this.props.match.params;

    const rapQuery = gql`{
      reportApRoblem {
        alert_immediate_assist_${ locale }
        header_${ locale }
        instruction_${ locale }
        description_${ locale }
        more_details_${ locale }
        option {
          text_${ locale }
        }
      }
    }`;

    return (
      <Query query={ rapQuery } pollInterval={ 0 } >
        { ({ loading, error, data }) => {
          const isLoaded = ( !loading && !error && data.reportApRoblem );

          const options = !isLoaded
            ? null // TODO:
            : data.reportApRoblem.option.map( this.mapOptions );

          return isLoaded && (
            <Fragment>
              <p className="well well-sm text-center mrgn-tp-lg">
                <Markdown source={ isLoaded && data.reportApRoblem[ `alert_immediate_assist_${ locale }` ] } />
              </p>
              <div className="pagedetails">
                <div className="row">
                  <div className="col-sm-7 col-md-6 col-lg-5">
                    <details className="brdr-0">
                      <summary className="btn btn-default text-center">
                        { isLoaded && data.reportApRoblem[ `header_${ locale }` ] }
                      </summary>
                      <div className="well row">
                        <div className="gc-rprt-prblm">
                          <div className="gc-rprt-prblm-frm gc-rprt-prblm-tggl wb-frmvld">
                            <form onSubmit={ this.onReportSubmit } >
                              <p>{ isLoaded && data.reportApRoblem[ `description_${ locale }` ] }</p>
                              <fieldset>
                                <legend><span className="field-name h4"><p>{ isLoaded && data.reportApRoblem[ `instruction_${ locale }` ] }:</p> </span></legend>
                                { options }
                                <div className="form-group">
                                  <label htmlFor="problem-details"><p>{ isLoaded && data.reportApRoblem[ `details_${ locale }` ] }</p></label>
                                  <textarea onChange={ this.onReportChange } value={ this.state.rapForm.problem.problem_other } name="problem" id="problem_other" className="form-control full-width" rows="5" maxLength="400"></textarea>
                                </div>
                              </fieldset>
                              <Button bsStyle="primary" id="rprtBtn" type="submit" className="wb-toggle">Submit</Button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            </Fragment>
          );
        } }
      </Query>
    );
  }
}

export default ReportAProblem;

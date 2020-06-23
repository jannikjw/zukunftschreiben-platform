import React, { Component } from "react";
import { Step } from 'semantic-ui-react';
import './PaymentProgress.scss';

class PaymentProgress extends Component {
  constructor(props) {
    super(props)

  }

  render() {
    const activeStep = parseInt(this.props.activeStep);

    return (
      <div className="payment-progress" >
        <Step.Group stackable fluid widths={4}>
          {activeStep === 1 ?
            <Step active>
              <Step.Content>
                <Step.Title>Betrag wählen</Step.Title>
              </Step.Content>
            </Step>
            :
            <Step disabled>
              <Step.Content>
                <Step.Title>Betrag wählen</Step.Title>
              </Step.Content>
            </Step>
          }

          {activeStep === 2 ?
            <Step active>
              <Step.Content>
                <Step.Title>Anschrift</Step.Title>
              </Step.Content>
            </Step>
            :
            <Step disabled>
              <Step.Content>
                <Step.Title>Anschrift</Step.Title>
              </Step.Content>
            </Step>
          }

          {activeStep === 3 ?
            <Step active>
              <Step.Content>
                <Step.Title>Zahlungsweise</Step.Title>
              </Step.Content>
            </Step>
            :
            <Step disabled>
              <Step.Content>
                <Step.Title>Zahlungsweise</Step.Title>
              </Step.Content>
            </Step>
          }

          {activeStep === 4 ?
            <Step active>
              <Step.Content>
                <Step.Title>Bestätigen</Step.Title>
              </Step.Content>
            </Step>
            :
            <Step disabled>
              <Step.Content>
                <Step.Title>Bestätigen</Step.Title>
              </Step.Content>
            </Step>
          }
        </Step.Group>
      </div>
    )
  }
}

export { PaymentProgress };


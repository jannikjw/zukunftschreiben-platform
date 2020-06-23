import React from "react";
import { Step } from 'semantic-ui-react';
import './PaymentProgress.scss';

const PaymentProgress = () => {

  return (
    <div className="payment-progress">
      <Step.Group stackable fluid widths={4}>
        <Step active>
          <Step.Content>
            <Step.Title>Betrag wählen</Step.Title>
          </Step.Content>
        </Step>

        <Step disabled>
          <Step.Content>
            <Step.Title>Anschrift</Step.Title>
          </Step.Content>
        </Step>

        <Step disabled>
          <Step.Content>
            <Step.Title>Zahlungsweise</Step.Title>
          </Step.Content>
        </Step>
        <Step disabled>
          <Step.Content>
            <Step.Title>Bestätigen</Step.Title>
          </Step.Content>
        </Step>
      </Step.Group>
    </div>
  )
}

export { PaymentProgress };


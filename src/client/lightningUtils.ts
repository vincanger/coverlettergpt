import { LIGHTNING_ADDRESS, MILLISATS_PER_MESSAGE } from '../shared/utils';

declare global {
  interface Window {
    webln: any;
  }
}

export type LightningInvoice = {
  status: string;
  successAction: {
    tag: string;
    message: string;
  };
  verify: string;
  routes: any[];
  pr: string;
};

export type LightningAddressResponse = {
  callback: string;
  maxSendable: number;
  minSendable: number;
  metadata: string;
  commentAllowed: number;
  tag: string;
};

export const fetchLightningInvoice = async () => {
  let lightningCallback = '';
  const [username, host] = LIGHTNING_ADDRESS.split('@');
  const milliSatsPerMessage = MILLISATS_PER_MESSAGE;
  if (!username || !host) {
    alert('Invalid Lightning address');
    return;
  }
  try {
    const response = await fetch(`https://${host}/.well-known/lnurlp/${username}`);

    if (response.ok) {
      const json: LightningAddressResponse = await response.json();
      if (json.tag === 'payRequest') {
        lightningCallback = json.callback;
      } else {
        alert('Invalid Lightning address');
      }
    } else {
      alert('Invalid Lightning address');
    }
  } catch (error) {
    alert(`Failed to verify Lightning address:${error}`);
  }

  try {
    const response = await fetch(lightningCallback + '?amount=' + milliSatsPerMessage);
    if (response.ok) {
      const invoice: LightningInvoice = await response.json();
      return invoice;
    } else {
      throw new Error('Failed to fetch lightning invoice');
    }
  } catch (error) {
    console.error('Failed to fetch lightning invoice:', error);
    return null;
  }
};

export const payLightningInvoice = async (setLightningInvoice: any, setShowInvoiceModal: any) => {
  const invoice = await fetchLightningInvoice();
  if (!invoice) {
    alert('Error fetching invoice');
    return;
  }
  setLightningInvoice(invoice);
  if (!invoice) {
    alert('Failed to fetch lightning invoice. Please set your lightning address.');
    return;
  }
  let paymentSuccessful = false;
  if (typeof window !== 'undefined' && window.webln.isEnabled) {
    try {
      await window.webln.enable();
      const { preimage } = await window.webln.sendPayment(invoice && invoice.pr);
      paymentSuccessful = !!preimage;
    } catch {
      // Open the modal and wait for the payment
      setShowInvoiceModal(true);
      paymentSuccessful = await new Promise((resolve) => {
        // Handle payment failure or modal close
        const paymentFailedOrModalClosed = () => {
          resolve(false);
        };
      });
    }
  } else {
    // Open the modal and wait for the payment
    setShowInvoiceModal(true);
    paymentSuccessful = await new Promise((resolve) => {
      // Handle payment failure or modal close
      const paymentFailedOrModalClosed = () => {
        resolve(false);
      };
    });
  }

  // If payment is successful, send the message
  if (paymentSuccessful) {
    return true;
  } else {
    alert('Payment failed or timed out. Please try again.');
    return false;
  }
};

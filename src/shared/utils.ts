export const LIGHTNING_ADDRESS = 'vince@getalby.com';

export const MILLISATS_PER_MESSAGE = 30000;

const getBitcoinPrice = async () => {
  return null;
  // TODO: Uncomment this when we have a Bitcoin price API
  // try {
  //   const response = await fetch('/api/bitcoin-price');
  //   const data = await response.json();
  //   return data.bitcoin.usd;
  // } catch (error) {
  //   console.error('Error fetching Bitcoin price:', error);
  //   return null;
  // }
};

export const centsToMilliSats = async (cents: number) => {
  const bitcoinPrice = await getBitcoinPrice();
  if (bitcoinPrice === null) return null;

  const milliSatsPerDollar = 100000000000 / bitcoinPrice;
  return cents * milliSatsPerDollar;
};

export const milliSatsToCents = async (milliSats: number) => {
  const bitcoinPrice = await getBitcoinPrice();
  if (bitcoinPrice === null) return 0;

  const dollarsPerSat = bitcoinPrice / 100000000000;
  const centsPerDollar = milliSats * dollarsPerSat;
  return centsPerDollar;
};

export function parseLightningAddress(callback: string): string {
  if (!callback) return '';
  const matches = callback.match(/lnurlp\/(.+)\/callback/);
  if (matches && matches.length > 1) {
    const [username, host] = matches[1].split('@');
    if (username && host) {
      return `${username}@${host}`;
    }
  }
  return '';
}

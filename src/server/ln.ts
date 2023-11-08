import { randomBytes, createHash as cryptoCreateHash } from 'crypto';
import type { GetLnLoginUrl, DecodeInvoice, UpdateLnPayment, MilliSatsToCents } from '@wasp/actions/types';
import type { GetLnUserInfo } from '@wasp/queries/types';
//@ts-ignore
import lnurl from 'lnurl';
//@ts-ignore
import jwt from 'jsonwebtoken';
import type { LnLogin } from '@wasp/apis/types';
import { LnData, LnPayment } from '@wasp/entities';
import bolt11 from 'bolt11';
import HttpError from '@wasp/core/HttpError.js';
import axios from 'axios';

const DOMAIN = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export function generateK1() {
  return randomBytes(32).toString('hex');
}

export function createHash(k1: string): string {
  const hash = cryptoCreateHash('sha256');
  hash.update(k1);
  return hash.digest('hex');
}

export const hashStorage: Map<string, string | null> = new Map();

type LnLoginData = {
  k1Hash: string;
  encoded: string;
  k1: string;
  jwt: string;
};

export const getLnLoginUrl: GetLnLoginUrl<void, LnLoginData> = async (_args, context) => {
  const k1 = generateK1();
  const url = `${DOMAIN}/ln-login?tag=login&k1=${k1}&action=login`;
  const hash = createHash(k1);

  const data: LnLoginData = {
    encoded: lnurl.encode(url).toUpperCase(),
    k1,
    k1Hash: hash,
    jwt: '',
  };

  console.log('hash: ', data.k1Hash);
  await context.entities.LnData.create({
    data: {
      k1Hash: data.k1Hash,
    },
  });

  return data;
};

type LnLoginArgs = {
  k1: string;
  sig: string;
  key: string;
};

// custom API endpoint
export const lnLogin: LnLogin = async (request, response, context) => {
  console.log('request query: ', request.query);
  const { k1, sig, key } = request.query as LnLoginArgs;

  if (typeof k1 !== 'string' || typeof sig !== 'string' || typeof key !== 'string') {
    throw new Error('Invalid query parameters');
  }

  if (!lnurl.verifyAuthorizationSignature(sig, k1, key)) {
    throw new Error('Invalid signature');
  }

  const storedK1 = await context.entities.LnData.findUniqueOrThrow({
    where: {
      k1Hash: createHash(k1),
    },
  });

  let user = await context.entities.User.upsert({
    where: {
      username: key,
    },
    create: {
      username: key,
      password: createHash(key + sig),
      isUsingLn: true,
      gptModel: 'gpt-4',
      lnData: {
        connect: {
          k1Hash: storedK1.k1Hash,
        },
      },
    },
    update: {
      lnData: {
        connect: {
          k1Hash: storedK1.k1Hash,
        },
      },
    },
    include: {
      lnData: true,
    },
  });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);

  const lnData = await context.entities.LnData.update({
    where: {
      userId: user.id,
    },
    data: {
      token,
    },
  });

  console.log('lnData: ', lnData);

  response.status(200).json({ status: 'OK' });
};

export const getLnUserInfo: GetLnUserInfo<string, LnData> = async (k1Hash, context) => {
  return await context.entities.LnData.findUniqueOrThrow({
    where: {
      k1Hash: k1Hash,
    },
  });
};

type DecodedInvoice = bolt11.PaymentRequestObject & {
  tagsObject: bolt11.TagsObject;
};

export const decodeInvoice: DecodeInvoice<string, DecodedInvoice> = async (pr, _context) => {
  const invoice = bolt11.decode(pr);
  return invoice;
};

export type LightningInvoice = {
  status: string;
  successAction: {
    tag: string;
    message: string;
  };
  verify: string;
  pr: string;
};

export const updateLnPayment: UpdateLnPayment<LightningInvoice, LnPayment> = async (invoice, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const updatedInvoice = await context.entities.LnPayment.upsert({
    where: {
      pr: invoice.pr,
    },
    create: {
      pr: invoice.pr,
      status: invoice.status,
      userId: context.user.id,
    },
    update: {
      status: invoice.status,
    },
  });

  return updatedInvoice;
};

const getBitcoinPrice = async () => {
  let response = null;

  try {
    response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY!,
      },
    });
  } catch (error: any) {
    console.log('error calling coinmarket cap api: ', error.message);
    return null;
  }
  if (response) {
    const json = response.data.data[0].quote.USD.price;
    console.log(json);
    return json;
  }
};

// export const centsToMilliSats = async (cents: number) => {
//   const bitcoinPrice = await getBitcoinPrice();
//   if (bitcoinPrice === null) return null;

//   const milliSatsPerDollar = 100000000000 / bitcoinPrice;
//   return cents * milliSatsPerDollar;
// };

export const milliSatsToCents: MilliSatsToCents<{ milliSats: number }, number> = async ({ milliSats }, _context) => {
  const bitcoinPrice = await getBitcoinPrice();
  if (bitcoinPrice === null) return 0;

  const dollarsPerSat = bitcoinPrice / 100_000_000; //
  const centsPerDollar = (milliSats / 1000) * dollarsPerSat;
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

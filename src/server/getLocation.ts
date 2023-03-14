import { ServerSetupFn, Application } from '@wasp/types';
import axios from 'axios';

const getLocation: ServerSetupFn = async ({ app }) => {
  addCustomRoute(app);
};

function addCustomRoute(app: Application) {
  app.get('/getLocation', async (_req, res) => {
      const URL = `https://extreme-ip-lookup.com/json/?key=${process.env.IP_LOOKUP_KEY}`;
      const data = await axios.get(URL);
      const EU_PAY_LINK = 'https://donate.stripe.com/dR67wjb7A92da6QaEF';
      const US_PAY_LINK = 'https://donate.stripe.com/6oEcQD8Zs92d5QA7ss';
      if (data.data.continent != 'Europe') {
        res.send(US_PAY_LINK);
      } else {
        res.send(EU_PAY_LINK);
      }
  });
}

export default getLocation
import cors from 'cors';

export const serverSetup = (app) => {
  // Configure CORS
  app.use(cors({
    origin: [
      'https://coverlettergp.netlify.app',
      'http://localhost:3000', // for development
      'https://localhost:3000' // for development with HTTPS
    ],
    credentials: true
  }));
  
  console.log('Server setup completed with CORS configuration');
};

/* eslint-env node */
import axios from 'axios';

const main = async () => {
  const vercelToken = process.env.VERCEL_TOKEN;
  const deploymentUrl = process.env.DEPLOYMENT_URL;
  const vercelOrdId = process.env.VERCEL_ORG_ID;
  const aliasDomain = process.env.ALIAS_DOMAIN;

  console.log('Deployment url: ', deploymentUrl);
  console.log('Alias domain: ', aliasDomain);

  if (!vercelToken || !deploymentUrl || !vercelOrdId || !aliasDomain) {
    console.log('Received token: ', vercelToken !== undefined);
    console.log('Received org id: ', vercelOrdId !== undefined);
    throw new Error('Missing one or more required environment variables.');
  }

  const formattedDeploymentUrl = deploymentUrl.replace('https://', '');

  const headers = {
    Authorization: `Bearer ${vercelToken}`,
  };

  const { data: deployment } = await axios.get(
    `https://api.vercel.com/v6/deployments/${formattedDeploymentUrl}`,
    { headers },
  );

  await axios.post(
    `https://api.vercel.com/v2/deployments/${deployment.id}/aliases?teamId=${vercelOrdId}`,
    { alias: aliasDomain },
    { headers },
  );

  console.log(`Aliased ${aliasDomain} to deployment ${deployment.id}`);
};

main().catch((err) => {
  if (axios.isAxiosError(err)) {
    console.error('Axios error:', {
      status: err.response?.status,
      data: err.response?.data,
      url: err.config?.url,
    });
  } else {
    console.error('Unknown error:', err.message);
  }
  process.exit(1);
});

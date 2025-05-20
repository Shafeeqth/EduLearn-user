import cron from 'node-cron';
import RefreshTokenRepositoryImpl from '../database/repositories/refresh-token.repository';

const refreshTokenRepository = new RefreshTokenRepositoryImpl();

// Schedule the cron job to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running cron job to delete expired and revoked tokens...');
  try {
    await refreshTokenRepository.deleteExpiredAndRevokedTokens();
    console.log('Expired and revoked tokens deleted successfully.');
  } catch (error) {
    console.error('Error while deleting expired and revoked tokens:', error);
  }
});

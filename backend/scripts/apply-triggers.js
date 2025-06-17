const { exec } = require('child_process');
const prisma = require('../src/utils/database');
const fs = require('fs');

async function applyTriggers() {
  try {
    const triggerFile = 'prisma/scripts/create-trigger.sql';
    
    if (!fs.existsSync(triggerFile)) {
      console.log('Trigger file not found, skipping trigger application');
      return;
    }

    // Проверка подключения к БД
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database connection verified');
    
    const { stdout, stderr } = await new Promise((resolve, reject) => {
      exec(`psql $DATABASE_URL -f ${triggerFile}`, 
        { env: process.env },
        (error, stdout, stderr) => {
          if (error) reject(error);
          else resolve({ stdout, stderr });
        }
      );
    });
    
    console.log('Triggers applied successfully');
    console.log(stdout);
    
  } catch (error) {
    console.error('Error applying triggers:', error);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('Database connection refused. Check your DATABASE_URL and ensure PostgreSQL is running.');
    } else if (error.message.includes('does not exist')) {
      console.error('Database does not exist. Create it first with `prisma migrate deploy`.');
    } else {
      console.error('SQL Error:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

applyTriggers();
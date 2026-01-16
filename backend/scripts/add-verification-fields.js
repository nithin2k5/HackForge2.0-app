const pool = require('../config/database');

async function addVerificationFields() {
  try {
    console.log('Adding email verification fields to users table...\n');
    
    try {
      await pool.execute(`ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE`);
      console.log('✓ Added email_verified column');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ email_verified column already exists');
      } else {
        throw e;
      }
    }
    
    try {
      await pool.execute(`ALTER TABLE users ADD COLUMN verification_token VARCHAR(255)`);
      console.log('✓ Added verification_token column');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ verification_token column already exists');
      } else {
        throw e;
      }
    }
    
    try {
      await pool.execute(`ALTER TABLE users ADD COLUMN verification_token_expires DATETIME`);
      console.log('✓ Added verification_token_expires column');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ verification_token_expires column already exists');
      } else {
        throw e;
      }
    }
    
    try {
      await pool.execute(`ALTER TABLE users ADD COLUMN reset_token VARCHAR(255)`);
      console.log('✓ Added reset_token column');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ reset_token column already exists');
      } else {
        throw e;
      }
    }
    
    try {
      await pool.execute(`ALTER TABLE users ADD COLUMN reset_token_expires DATETIME`);
      console.log('✓ Added reset_token_expires column');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ reset_token_expires column already exists');
      } else {
        throw e;
      }
    }

    try {
      await pool.execute(`ALTER TABLE users MODIFY COLUMN status ENUM('active', 'inactive') DEFAULT 'inactive'`);
      console.log('✓ Updated status column default');
    } catch (e) {
      console.log('⚠ Could not modify status column (may already be correct)');
    }

    try {
      await pool.execute(`CREATE INDEX idx_verification_token ON users(verification_token)`);
      console.log('✓ Created verification_token index');
    } catch (e) {
      if (e.code === 'ER_DUP_KEYNAME') {
        console.log('✓ verification_token index already exists');
      } else {
        console.log('⚠ Could not create verification_token index');
      }
    }

    try {
      await pool.execute(`CREATE INDEX idx_reset_token ON users(reset_token)`);
      console.log('✓ Created reset_token index');
    } catch (e) {
      if (e.code === 'ER_DUP_KEYNAME') {
        console.log('✓ reset_token index already exists');
      } else {
        console.log('⚠ Could not create reset_token index');
      }
    }

    console.log('\n✅ All verification fields added successfully!');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error adding verification fields:', error.message);
    console.error('Error code:', error.code);
    await pool.end();
    process.exit(1);
  }
}

addVerificationFields();

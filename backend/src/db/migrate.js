require('dotenv').config();
const pool = require('./pool');

async function migrate() {
  console.log('🔧 Running migrations...');
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Users
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id           SERIAL PRIMARY KEY,
        first_name   VARCHAR(100) NOT NULL,
        last_name    VARCHAR(100) NOT NULL,
        email        VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role         VARCHAR(20) DEFAULT 'seller' CHECK (role IN ('admin','seller')),
        active       BOOLEAN DEFAULT true,
        created_at   TIMESTAMPTZ DEFAULT NOW(),
        updated_at   TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Refresh tokens
    await client.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id         SERIAL PRIMARY KEY,
        user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token      TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Brands
    await client.query(`
      CREATE TABLE IF NOT EXISTS brands (
        id         SERIAL PRIMARY KEY,
        name       VARCHAR(100) UNIQUE NOT NULL,
        slug       VARCHAR(100) UNIQUE NOT NULL,
        logo_url   TEXT,
        country    VARCHAR(100),
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Vehicles
    await client.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id                   SERIAL PRIMARY KEY,
        brand_id             INTEGER REFERENCES brands(id) ON DELETE SET NULL,
        model                VARCHAR(200) NOT NULL,
        variant              VARCHAR(200),
        year                 SMALLINT NOT NULL,
        colour               VARCHAR(100),
        interior_colour      VARCHAR(100),
        body_style           VARCHAR(50),
        fuel_type            VARCHAR(50),
        transmission         VARCHAR(50),
        engine_description   TEXT,
        power_bhp            NUMERIC(6,1),
        zero_to_sixty        NUMERIC(4,2),
        top_speed_mph        SMALLINT,
        mileage              INTEGER DEFAULT 0,
        price                NUMERIC(14,0),
        sold_price           NUMERIC(14,0),
        status               VARCHAR(30) DEFAULT 'available'
                             CHECK (status IN ('available','under_offer','reserved','sold')),
        featured             BOOLEAN DEFAULT false,
        description          TEXT,
        sold_at              TIMESTAMPTZ,
        created_at           TIMESTAMPTZ DEFAULT NOW(),
        updated_at           TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Vehicle images
    await client.query(`
      CREATE TABLE IF NOT EXISTS vehicle_images (
        id          SERIAL PRIMARY KEY,
        vehicle_id  INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
        url         TEXT NOT NULL,
        alt         VARCHAR(255),
        is_primary  BOOLEAN DEFAULT false,
        sort_order  SMALLINT DEFAULT 0,
        created_at  TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Articles
    await client.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id           SERIAL PRIMARY KEY,
        title        VARCHAR(500) NOT NULL,
        slug         VARCHAR(500) UNIQUE NOT NULL,
        excerpt      TEXT,
        content      TEXT,
        cover_image  TEXT,
        status       VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft','published')),
        published_at TIMESTAMPTZ,
        created_at   TIMESTAMPTZ DEFAULT NOW(),
        updated_at   TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Videos
    await client.query(`
      CREATE TABLE IF NOT EXISTS videos (
        id            SERIAL PRIMARY KEY,
        title         VARCHAR(500) NOT NULL,
        youtube_id    VARCHAR(50) NOT NULL,
        thumbnail_url TEXT,
        description   TEXT,
        featured      BOOLEAN DEFAULT false,
        sort_order    SMALLINT DEFAULT 0,
        created_at    TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Leads
    await client.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id          SERIAL PRIMARY KEY,
        vehicle_id  INTEGER REFERENCES vehicles(id) ON DELETE SET NULL,
        first_name  VARCHAR(100) NOT NULL,
        last_name   VARCHAR(100) NOT NULL,
        email       VARCHAR(255) NOT NULL,
        phone       VARCHAR(50),
        lead_type   VARCHAR(30) DEFAULT 'enquiry'
                    CHECK (lead_type IN ('enquiry','valuation','test_drive','finance','other')),
        message     TEXT,
        sell_make   VARCHAR(100),
        sell_model  VARCHAR(100),
        sell_year   SMALLINT,
        sell_mileage INTEGER,
        status      VARCHAR(30) DEFAULT 'new'
                    CHECK (status IN ('new','contacted','qualified','closed_won','closed_lost')),
        notes       TEXT,
        created_at  TIMESTAMPTZ DEFAULT NOW(),
        updated_at  TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Testimonials
    await client.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(200) NOT NULL,
        vehicle     VARCHAR(200),
        rating      SMALLINT DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
        text        TEXT NOT NULL,
        active      BOOLEAN DEFAULT true,
        created_at  TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Settings
    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        key   VARCHAR(100) PRIMARY KEY,
        value TEXT,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Indexes
    await client.query(`CREATE INDEX IF NOT EXISTS idx_vehicles_status    ON vehicles(status)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_vehicles_brand     ON vehicles(brand_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_vehicles_featured  ON vehicles(featured)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_vehicles_year      ON vehicles(year)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_leads_status       ON leads(status)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_leads_vehicle      ON leads(vehicle_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_articles_status    ON articles(status)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_vehicle_images_vid ON vehicle_images(vehicle_id)`);

    await client.query('COMMIT');
    console.log('✅ Migrations complete!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(process.exit.bind(process, 1));

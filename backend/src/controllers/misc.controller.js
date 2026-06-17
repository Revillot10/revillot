const pool = require('../db/pool');

// ── Articles ──────────────────────────────────────────────────
exports.getArticles = async (req, res) => {
  const { limit=10, page=1 } = req.query;
  const offset = (page-1)*Math.min(Number(limit),50);
  const { rows } = await pool.query(
    `SELECT id, title, slug, excerpt, cover_image, status, published_at, created_at
     FROM articles WHERE status='published'
     ORDER BY published_at DESC NULLS LAST, created_at DESC
     LIMIT $1 OFFSET $2`,
    [Math.min(Number(limit),50), offset]
  );
  const count = await pool.query(`SELECT COUNT(*) FROM articles WHERE status='published'`);
  res.json({ articles: rows, pagination: { total: parseInt(count.rows[0].count), page: Number(page), pages: Math.ceil(parseInt(count.rows[0].count)/Math.min(Number(limit),50)) }});
};

exports.getArticle = async (req, res) => {
  const { rows } = await pool.query(`SELECT * FROM articles WHERE slug=$1 AND status='published'`, [req.params.slug]);
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
};

exports.adminGetArticles = async (req, res) => {
  const { rows } = await pool.query(`SELECT * FROM articles ORDER BY created_at DESC`);
  res.json({ articles: rows });
};

exports.createArticle = async (req, res) => {
  const { title, slug, excerpt, content, cover_image, status='draft' } = req.body;
  const published_at = status === 'published' ? new Date() : null;
  const { rows } = await pool.query(
    `INSERT INTO articles (title, slug, excerpt, content, cover_image, status, published_at) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [title, slug, excerpt||null, content||null, cover_image||null, status, published_at]
  );
  res.status(201).json(rows[0]);
};

exports.updateArticle = async (req, res) => {
  const { id } = req.params;
  const { title, slug, excerpt, content, cover_image, status } = req.body;
  const { rows } = await pool.query(
    `UPDATE articles SET title=$1, slug=$2, excerpt=$3, content=$4, cover_image=$5, status=$6,
     published_at=CASE WHEN $6='published' AND published_at IS NULL THEN NOW() ELSE published_at END,
     updated_at=NOW() WHERE id=$7 RETURNING *`,
    [title, slug, excerpt||null, content||null, cover_image||null, status, id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
};

exports.deleteArticle = async (req, res) => {
  await pool.query('DELETE FROM articles WHERE id=$1', [req.params.id]);
  res.json({ ok: true });
};

// ── Videos ────────────────────────────────────────────────────
exports.getVideos = async (_req, res) => {
  const { rows } = await pool.query(`SELECT * FROM videos ORDER BY sort_order, created_at DESC`);
  res.json(rows);
};

exports.adminGetVideos = async (_req, res) => {
  const { rows } = await pool.query(`SELECT * FROM videos ORDER BY sort_order, created_at DESC`);
  res.json(rows);
};

exports.createVideo = async (req, res) => {
  const { title, youtube_id, thumbnail_url, description, featured=false } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO videos (title, youtube_id, thumbnail_url, description, featured) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [title, youtube_id, thumbnail_url||null, description||null, featured]
  );
  res.status(201).json(rows[0]);
};

exports.updateVideo = async (req, res) => {
  const { id } = req.params;
  const { title, youtube_id, thumbnail_url, description, featured } = req.body;
  const { rows } = await pool.query(
    `UPDATE videos SET title=$1, youtube_id=$2, thumbnail_url=$3, description=$4, featured=$5 WHERE id=$6 RETURNING *`,
    [title, youtube_id, thumbnail_url||null, description||null, featured, id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
};

exports.deleteVideo = async (req, res) => {
  await pool.query('DELETE FROM videos WHERE id=$1', [req.params.id]);
  res.json({ ok: true });
};

// ── Leads ─────────────────────────────────────────────────────
exports.createLead = async (req, res) => {
  const {
    vehicle_id, first_name, last_name, email, phone,
    lead_type='enquiry', message, sell_make, sell_model, sell_year, sell_mileage,
  } = req.body;

  if (!first_name || !email) {
    return res.status(400).json({ error: 'Nombre y email requeridos' });
  }

  const { rows } = await pool.query(
    `INSERT INTO leads (vehicle_id, first_name, last_name, email, phone, lead_type,
                        message, sell_make, sell_model, sell_year, sell_mileage)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
    [vehicle_id||null, first_name, last_name, email, phone||null, lead_type,
     message||null, sell_make||null, sell_model||null, sell_year||null, sell_mileage||null]
  );

  res.status(201).json({ ok: true, id: rows[0].id });
};

exports.adminGetLeads = async (req, res) => {
  const { page=1, limit=20, status } = req.query;
  const offset = (page-1)*Math.min(Number(limit),100);
  const params = [], where = [];

  if (status) { params.push(status); where.push(`l.status=$${params.length}`); }
  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const countQ = await pool.query(`SELECT COUNT(*) FROM leads l ${whereClause}`, params);
  const total = parseInt(countQ.rows[0].count);

  params.push(Math.min(Number(limit),100)); params.push(offset);
  const { rows } = await pool.query(
    `SELECT l.*,
            CONCAT(b.name,' ',v.model,' ',v.year) AS vehicle_name
     FROM leads l
     LEFT JOIN vehicles v ON v.id=l.vehicle_id
     LEFT JOIN brands   b ON b.id=v.brand_id
     ${whereClause}
     ORDER BY l.created_at DESC
     LIMIT $${params.length-1} OFFSET $${params.length}`,
    params
  );

  res.json({ leads: rows, pagination: { total, page:Number(page), pages:Math.ceil(total/Math.min(Number(limit),100)) }});
};

exports.updateLead = async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const sets = [], vals = [];
  if (status !== undefined) { vals.push(status); sets.push(`status=$${vals.length}`); }
  if (notes  !== undefined) { vals.push(notes);  sets.push(`notes=$${vals.length}`); }
  if (!sets.length) return res.status(400).json({ error: 'Nothing to update' });
  vals.push(new Date()); vals.push(id);
  const { rows } = await pool.query(
    `UPDATE leads SET ${sets.join(',')}, updated_at=$${vals.length-1} WHERE id=$${vals.length} RETURNING *`,
    vals
  );
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
};

// ── Dashboard ─────────────────────────────────────────────────
exports.getDashboard = async (_req, res) => {
  const [vehicleStats, leadStats, articleStats, recentLeads, recentVehicles] = await Promise.all([
    pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE status='available') AS available,
        COUNT(*) FILTER (WHERE status='sold')      AS sold,
        COUNT(*) FILTER (WHERE status='under_offer') AS under_offer,
        COUNT(*) FILTER (WHERE status='reserved') AS reserved,
        COUNT(*) AS total
      FROM vehicles
    `),
    pool.query(`
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status='new') AS new,
        COUNT(*) FILTER (WHERE created_at > NOW()-INTERVAL '7 days') AS this_week
      FROM leads
    `),
    pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE status='published') AS published,
        COUNT(*) AS total
      FROM articles
    `),
    pool.query(`
      SELECT l.*, CONCAT(b.name,' ',v.model) AS vehicle_name
      FROM leads l
      LEFT JOIN vehicles v ON v.id=l.vehicle_id
      LEFT JOIN brands b ON b.id=v.brand_id
      ORDER BY l.created_at DESC LIMIT 5
    `),
    pool.query(`
      SELECT v.id, b.name AS brand_name, v.model, v.year, v.price, v.status
      FROM vehicles v
      LEFT JOIN brands b ON b.id=v.brand_id
      ORDER BY v.created_at DESC LIMIT 5
    `),
  ]);

  res.json({
    stats: {
      vehicles: vehicleStats.rows[0],
      leads:    leadStats.rows[0],
      articles: articleStats.rows[0],
    },
    recentLeads:    recentLeads.rows,
    recentVehicles: recentVehicles.rows,
  });
};

// ── Testimonials ──────────────────────────────────────────────
exports.getTestimonials = async (_req, res) => {
  const { rows } = await pool.query(`SELECT * FROM testimonials WHERE active=true ORDER BY created_at DESC LIMIT 10`);
  res.json(rows);
};

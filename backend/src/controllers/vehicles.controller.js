const pool = require('../db/pool');

// ── Helper: build vehicle with images ─────────────────────────
async function withImages(vehicles, client) {
  if (!vehicles.length) return [];
  const ids = vehicles.map(v => v.id);
  const { rows: imgs } = await (client||pool).query(
    `SELECT vehicle_id, id, url, alt, is_primary as "isPrimary", sort_order
     FROM vehicle_images
     WHERE vehicle_id = ANY($1)
     ORDER BY vehicle_id, is_primary DESC, sort_order`,
    [ids]
  );
  const imgMap = {};
  imgs.forEach(i => { if (!imgMap[i.vehicle_id]) imgMap[i.vehicle_id]=[]; imgMap[i.vehicle_id].push(i); });
  return vehicles.map(v => ({...v, images: imgMap[v.id] || []}));
}

// ── PUBLIC: GET /api/vehicles ──────────────────────────────────
exports.getAll = async (req, res) => {
  const {
    page = 1, limit = 12, status = 'available',
    brand, body_style, sort = 'newest', featured,
  } = req.query;

  const offset = (page - 1) * Math.min(Number(limit), 48);
  const params = [];
  const where  = [];

  if (status) { params.push(status); where.push(`v.status = $${params.length}`); }
  if (brand)  {
    params.push(brand);
    where.push(`b.slug = $${params.length}`);
  }
  if (body_style) {
    params.push(body_style);
    where.push(`LOWER(v.body_style) = LOWER($${params.length})`);
  }
  if (featured === 'true') where.push('v.featured = true');

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const orderMap = {
    newest:     'v.created_at DESC',
    price_asc:  'v.price ASC NULLS LAST',
    price_desc: 'v.price DESC NULLS LAST',
    mileage_asc:'v.mileage ASC',
    year_desc:  'v.year DESC',
  };
  const order = orderMap[sort] || 'v.created_at DESC';

  // Count
  const countQ = await pool.query(
    `SELECT COUNT(*) FROM vehicles v
     LEFT JOIN brands b ON b.id = v.brand_id
     ${whereClause}`,
    params
  );
  const total = parseInt(countQ.rows[0].count);

  params.push(Math.min(Number(limit), 48));
  params.push(offset);

  const { rows } = await pool.query(
    `SELECT v.*,
            b.name AS brand_name, b.slug AS brand_slug
     FROM vehicles v
     LEFT JOIN brands b ON b.id = v.brand_id
     ${whereClause}
     ORDER BY ${order}
     LIMIT $${params.length-1} OFFSET $${params.length}`,
    params
  );

  const vehicles = await withImages(rows);

  res.json({
    vehicles,
    pagination: {
      total, page: Number(page),
      pages: Math.ceil(total / Math.min(Number(limit), 48)),
      limit: Math.min(Number(limit), 48),
    }
  });
};

// ── PUBLIC: GET /api/vehicles/:id ─────────────────────────────
exports.getOne = async (req, res) => {
  const { id } = req.params;

  const { rows } = await pool.query(
    `SELECT v.*, b.name AS brand_name, b.slug AS brand_slug
     FROM vehicles v
     LEFT JOIN brands b ON b.id = v.brand_id
     WHERE v.id = $1`,
    [id]
  );

  if (!rows[0]) return res.status(404).json({ error: 'Vehículo no encontrado' });

  const [vehicle] = await withImages(rows);

  // Related vehicles (same brand, different id)
  const { rows: related } = await pool.query(
    `SELECT v.id, b.name AS brand_name, v.model, v.variant, v.year,
            v.price, v.status
     FROM vehicles v
     LEFT JOIN brands b ON b.id = v.brand_id
     WHERE v.brand_id = $1 AND v.id != $2 AND v.status = 'available'
     ORDER BY RANDOM()
     LIMIT 4`,
    [rows[0].brand_id, id]
  );

  const relatedWithImgs = await withImages(related);

  res.json({ vehicle, related: relatedWithImgs });
};

// ── PUBLIC: GET /api/brands ────────────────────────────────────
exports.getBrands = async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT b.id, b.name, b.slug, b.logo_url, COUNT(v.id) AS vehicle_count
     FROM brands b
     LEFT JOIN vehicles v ON v.brand_id = b.id AND v.status='available'
     GROUP BY b.id
     HAVING COUNT(v.id) > 0
     ORDER BY b.name`
  );
  res.json(rows);
};

// ── ADMIN: GET /api/admin/brands — todas las marcas ────────────
exports.adminGetBrands = async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT b.id, b.name, b.slug, b.logo_url,
            COUNT(v.id) AS vehicle_count
     FROM brands b
     LEFT JOIN vehicles v ON v.brand_id = b.id
     GROUP BY b.id
     ORDER BY b.name`
  );
  res.json(rows);
};

// ── ADMIN: POST /api/admin/brands — crear marca nueva ──────────
exports.createBrand = async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Nombre requerido' });
  const slug = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  try {
    const { rows } = await pool.query(
      `INSERT INTO brands (name, slug) VALUES ($1, $2)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
       RETURNING id, name, slug`,
      [name.trim(), slug]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── ADMIN: GET /api/admin/vehicles ─────────────────────────────
exports.adminGetAll = async (req, res) => {
  const { page=1, limit=20, status, brand, sort='newest' } = req.query;
  const offset = (page-1) * Math.min(Number(limit),100);
  const params = [], where = [];

  if (status)  { params.push(status); where.push(`v.status=$${params.length}`); }
  if (brand)   { params.push(brand);  where.push(`b.slug=$${params.length}`); }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const orderMap = { newest:'v.created_at DESC', price_asc:'v.price ASC NULLS LAST', price_desc:'v.price DESC NULLS LAST' };
  const order = orderMap[sort] || 'v.created_at DESC';

  const countQ = await pool.query(`SELECT COUNT(*) FROM vehicles v LEFT JOIN brands b ON b.id=v.brand_id ${whereClause}`, params);
  const total = parseInt(countQ.rows[0].count);

  params.push(Math.min(Number(limit),100)); params.push(offset);
  const { rows } = await pool.query(
    `SELECT v.*, b.name AS brand_name FROM vehicles v LEFT JOIN brands b ON b.id=v.brand_id
     ${whereClause} ORDER BY ${order} LIMIT $${params.length-1} OFFSET $${params.length}`,
    params
  );

  const vehicles = await withImages(rows);
  res.json({ vehicles, pagination: { total, page:Number(page), pages:Math.ceil(total/Math.min(Number(limit),100)), limit:Math.min(Number(limit),100) }});
};

// ── ADMIN: POST /api/admin/vehicles ────────────────────────────
exports.create = async (req, res) => {
  const { images, ...data } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const cols = Object.keys(data).filter(k => data[k] !== undefined && data[k] !== '');
    const vals = cols.map(k => data[k]);
    const placeholders = cols.map((_,i) => `$${i+1}`);
    const { rows } = await client.query(
      `INSERT INTO vehicles (${cols.join(',')}) VALUES (${placeholders.join(',')}) RETURNING *`,
      vals
    );
    const vid = rows[0].id;
    if (images?.length) {
      for (let i=0; i<images.length; i++) {
        const img = images[i];
        await client.query(
          `INSERT INTO vehicle_images (vehicle_id,url,alt,is_primary,sort_order) VALUES ($1,$2,$3,$4,$5)`,
          [vid, img.url, img.alt||null, i===0||img.isPrimary||false, i]
        );
      }
    }
    await client.query('COMMIT');
    const [vehicle] = await withImages(rows);
    res.status(201).json(vehicle);
  } catch (err) { await client.query('ROLLBACK'); console.error(err); res.status(500).json({ error: err.message }); }
  finally { client.release(); }
};

// ── ADMIN: PUT /api/admin/vehicles/:id ─────────────────────────
exports.update = async (req, res) => {
  const { id } = req.params;
  const { images, ...data } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const cols = Object.keys(data).filter(k => data[k] !== undefined);
    const vals = cols.map(k => data[k]);
    if (cols.length) {
      const sets = cols.map((k,i) => `${k}=$${i+1}`);
      vals.push(new Date()); vals.push(id);
      await client.query(
        `UPDATE vehicles SET ${sets.join(',')}, updated_at=$${vals.length-1} WHERE id=$${vals.length} RETURNING *`,
        vals
      );
    }
    if (images !== undefined) {
      await client.query('DELETE FROM vehicle_images WHERE vehicle_id=$1', [id]);
      for (let i=0; i<(images||[]).length; i++) {
        const img = images[i];
        await client.query(
          `INSERT INTO vehicle_images (vehicle_id,url,alt,is_primary,sort_order) VALUES ($1,$2,$3,$4,$5)`,
          [id, img.url, img.alt||null, i===0||img.isPrimary||false, i]
        );
      }
    }
    await client.query('COMMIT');
    const { rows } = await pool.query(
      `SELECT v.*, b.name AS brand_name FROM vehicles v LEFT JOIN brands b ON b.id=v.brand_id WHERE v.id=$1`, [id]
    );
    const [vehicle] = await withImages(rows);
    res.json(vehicle);
  } catch (err) { await client.query('ROLLBACK'); console.error(err); res.status(500).json({ error: err.message }); }
  finally { client.release(); }
};

// ── ADMIN: PATCH /api/admin/vehicles/:id/sold ──────────────────
exports.markSold = async (req, res) => {
  const { id } = req.params;
  const { sold_price } = req.body;
  const { rows } = await pool.query(
    `UPDATE vehicles SET status='sold', sold_price=$1, sold_at=NOW(), updated_at=NOW() WHERE id=$2 RETURNING *`,
    [sold_price||null, id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
};

// ── ADMIN: DELETE /api/admin/vehicles/:id ─────────────────────
exports.delete = async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM vehicles WHERE id=$1', [id]);
  res.json({ ok: true });
};

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROSPECTS_PATH = path.join(__dirname, '../src/data/prospects.json');

// Villes cibles par défaut
const CITIES = [
  { name: 'Cotonou', bbox: '6.33,2.33,6.42,2.48' },
  { name: 'Porto-Novo', bbox: '6.46,2.58,6.54,2.65' },
  { name: 'Parakou', bbox: '9.31,2.58,9.38,2.65' }
];

async function fetchBusinessesWithoutWebsite(cityName, bbox) {
  console.log(`🔍 Recherche des commerces/entreprises à ${cityName} sans site web...`);

  // Requête Overpass pour hôtels, cliniques, restaurants, agences, commerces
  const query = `
    [out:json][timeout:25];
    (
      node["tourism"~"hotel|guest_house"](${bbox})[!website];
      node["amenity"~"clinic|hospital|pharmacy|restaurant"](${bbox})[!website];
      node["shop"](${bbox})[!website];
      node["office"](${bbox})[!website];
    );
    out body 25;
  `;

  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'BhilalPortfolioHunter/1.0' } });
    if (!res.ok) {
      console.warn(`⚠️ Erreur réseau Overpass (${res.status}) pour ${cityName}`);
      return [];
    }
    const data = await res.json();
    const elements = data.elements || [];

    const results = [];
    for (const el of elements) {
      const tags = el.tags || {};
      const name = tags.name;
      if (!name) continue;

      const phone = tags.phone || tags['contact:phone'] || tags['contact:mobile'] || null;
      const type = tags.tourism || tags.amenity || tags.shop || tags.office || 'commerce';

      results.push({
        id: `local-${cityName.toLowerCase()}-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`.slice(0, 50),
        name,
        type: 'PROJET_CLIENT',
        category: type,
        city: cityName,
        country: 'Bénin',
        flag: '🇧🇯',
        phone,
        website: null,
        recipient: phone ? `WhatsApp: ${phone}` : 'À qualifier sur place/téléphone',
        status: 'READY',
        sentDate: null,
        description: `Établissement local (${type}) en activité à ${cityName}, actuellement sans présence web officielle.`,
        techStack: 'Site vitrine Astro / PWA de réservation ou catalogue / Solution de commande WhatsApp',
        whyFit: `Besoin d'une visibilité numérique pour capter les clients mobiles et automatiser les demandes de renseignements.`,
        notes: `Prospect local identifié sans site web. Proposition suggérée : Site vitrine rapide + bouton de commande/réservation WhatsApp.`
      });
    }

    console.log(`✅ Trouvé ${results.length} établissement(s) sans site web à ${cityName}.`);
    return results;
  } catch (err) {
    console.error(`❌ Échec de la recherche pour ${cityName}:`, err.message);
    return [];
  }
}

async function main() {
  let prospects = [];
  if (fs.existsSync(PROSPECTS_PATH)) {
    prospects = JSON.parse(fs.readFileSync(PROSPECTS_PATH, 'utf-8'));
  }

  const existingIds = new Set(prospects.map(p => p.id));
  const existingNames = new Set(prospects.map(p => p.name.toLowerCase().trim()));

  let totalAdded = 0;

  for (const city of CITIES) {
    const found = await fetchBusinessesWithoutWebsite(city.name, city.bbox);
    for (const item of found) {
      if (!existingIds.has(item.id) && !existingNames.has(item.name.toLowerCase().trim())) {
        prospects.push(item);
        existingIds.add(item.id);
        existingNames.add(item.name.toLowerCase().trim());
        totalAdded++;
      }
    }
  }

  fs.writeFileSync(PROSPECTS_PATH, JSON.stringify(prospects, null, 2), 'utf-8');
  console.log(`\n🎉 Terminé ! ${totalAdded} nouveau(x) prospect(s) locaux sans site web ajouté(s) à prospects.json.`);
}

main().catch(console.error);

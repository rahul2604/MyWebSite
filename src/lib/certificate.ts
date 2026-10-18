function xmlEsc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Builds the sample certificate as an SVG data URI for download. */
export function buildCertificate(name: string, date: string): string {
  const n = xmlEsc(name);
  const d = xmlEsc(date);
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1130" viewBox="0 0 1600 1130">' +
    '<rect width="1600" height="1130" fill="#F6F3EC"/>' +
    '<rect x="40" y="40" width="1520" height="1050" fill="none" stroke="#B9A57A" stroke-width="4"/>' +
    '<rect x="62" y="62" width="1476" height="1006" fill="none" stroke="#D9CCAE" stroke-width="1.5"/>' +
    '<text x="800" y="420" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="260" font-weight="700" fill="#C0392B" fill-opacity="0.07" transform="rotate(-18 800 560)">DEMO</text>' +
    '<rect x="640" y="120" width="320" height="44" rx="6" fill="#C0392B"/>' +
    '<text x="800" y="150" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="20" font-weight="700" letter-spacing="4" fill="#FFFFFF">DEMO · SAMPLE ONLY</text>' +
    '<text x="800" y="260" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="30" letter-spacing="10" fill="#6B5A35">CERTIFICATE OF COMPLETION</text>' +
    '<text x="800" y="390" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="#4A566B">This is to certify that</text>' +
    '<text x="800" y="500" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="72" font-weight="700" fill="#0F1B30">' + n + '</text>' +
    '<line x1="420" y1="530" x2="1180" y2="530" stroke="#B9A57A" stroke-width="2"/>' +
    '<text x="800" y="610" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="#4A566B">has completed all modules of</text>' +
    '<text x="800" y="680" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="44" font-weight="600" fill="#0F1B30">PMP® Learning Path (Prototype)</text>' +
    '<text x="300" y="860" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="28" font-weight="600" fill="#142033">' + d + '</text>' +
    '<line x1="170" y1="880" x2="430" y2="880" stroke="#8A7A55" stroke-width="1.5"/>' +
    '<text x="300" y="915" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="22" fill="#4A566B">Date of completion</text>' +
    '<text x="1300" y="860" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="28" font-weight="600" fill="#142033">Rahul Mehra</text>' +
    '<line x1="1170" y1="880" x2="1430" y2="880" stroke="#8A7A55" stroke-width="1.5"/>' +
    '<text x="1300" y="915" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="22" fill="#4A566B">Course instructor</text>' +
    '<text x="800" y="1010" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="20" fill="#6A5A3A">Prototype sample. Not an official PMI® credential and does not certify that the holder has earned the PMP® certification.</text>' +
    '</svg>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

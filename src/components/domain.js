import { rerender } from '../lib/ui.js';
import { domainMessage, SECTIONS } from '../commands/domain/domain.js';
import { lookupDomain, normaliseDomain } from '../services/rdap.js';

export default {
 id: 'domain',
 async execute(interaction, [action, rawDomain]) {
  const domain = normaliseDomain(rawDomain);
  if (action !== 'view' || !domain || !interaction.isStringSelectMenu()) return;
  const [section] = interaction.values;
  return rerender(interaction, async () =>
   domainMessage(await lookupDomain(domain), section in SECTIONS ? section : 'overview'),
  );
 },
};

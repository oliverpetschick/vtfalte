export const categories = [
  { id: 1, label: 'Sporthalle' },
  { id: 2, label: 'Jugendclub' },
  { id: 3, label: 'Senior*innenzentrum' },
  { id: 4, label: 'Kaufhalle' },
  { id: 5, label: 'Gleichrichterunterwerk' },
  { id: 6, label: 'Umformerstation' },
  { id: 7, label: 'Mehrzweckhalle/Individualbau' },
  { id: 8, label: 'Abriss' },
];

export const categoryIds = Object.fromEntries(categories.map(({ id, label }) => [label, id]));

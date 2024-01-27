import { test, expect } from '@playwright/test';

test('test reports', async ({ page }) => {
  await page.goto('http://localhost:3000/fr');
  await page.getByRole('link', { name: '(title) Une category de démo' }).click();
  await page.getByText('Sous category pour tester les companyKindPour tester chaque type de CompanyKind').click();
  await page.getByText('Sous cat avec companyKind WEBSITE').click();
  await page.locator('label').filter({ hasText: 'Non, je n\'y travaille pas' }).click();
  await page.getByText('Résoudre mon problème').click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByPlaceholder('Exemple: https://www.site.fr').click();
  await page.getByPlaceholder('Exemple: https://www.site.fr').fill('fnac.com');
  await page.getByPlaceholder('Exemple: https://www.site.fr').press('Enter');
  await page.getByLabel('Sélectionnez l\'entrepriseSi l').locator('label').click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByLabel('Description *').click();
  await page.getByLabel('Description *').fill('description');
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.locator('label').filter({ hasText: 'M.' }).click();
  await page.getByLabel('Prénom *').click();
  await page.getByLabel('Prénom *').fill('test');
  await page.getByLabel('Prénom *').press('Tab');
  await page.getByLabel('Nom *', { exact: true }).fill('test');
  await page.getByLabel('Nom *', { exact: true }).press('Tab');
  await page.getByLabel('Email *').fill('s.sedoud.betagouv@gmail.com');
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByRole('button', { name: 'Envoyer le signalement' }).click();
});
const { test, expect }=require('@playwright/test');
const widths=[320,360,390,430,768,1024,1440];
test('Carga y no tiene desplazamiento horizontal en tamaños comunes', async ({page})=>{
  const errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await expect(page.locator('#name')).toBeVisible();
  await expect(page.getByRole('button',{name:/GENERAR MI RECETA/i})).toBeVisible();
  for(const width of widths){
    await page.setViewportSize({width,height:820});
    const value=await page.evaluate(()=>({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
    expect(value.scroll, 'Desborde horizontal a '+width+' px').toBeLessThanOrEqual(value.client+1);
    await expect(page.locator('#name')).toBeVisible();
  }
  expect(errors).toEqual([]);
});
test('Genera, descarga y permite repetir la receta PDF', async ({page})=>{
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await page.locator('#name').fill('María José Sánchez');
  await page.getByRole('button',{name:/GENERAR MI RECETA/i}).click();
  await expect(page.locator('#result')).toBeVisible();
  await expect(page.locator('#message')).toContainText('María José Sánchez');
  const [download]=await Promise.all([
    page.waitForEvent('download',{timeout:15000}),
    page.locator('#download').click()
  ]);
  expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
  const fs=require('fs');
  const buf=fs.readFileSync(await download.path());
  expect(buf.subarray(0,8).toString()).toContain('%PDF-');
  expect(buf.length).toBeGreaterThan(10000);
  await page.locator('#again').click();
  await expect(page.locator('#name')).toBeVisible();
  await expect(page.locator('#result')).toBeHidden();
});

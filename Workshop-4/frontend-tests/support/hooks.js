import { Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { mkdir } from 'fs/promises';
import { join } from 'path';

// Aumentar el timeout global a 60 segundos
setDefaultTimeout(60 * 1000);

Before(async function () {
  //console.log('🚀 Iniciando navegador...');
  await this.launchBrowser();
  //console.log('✅ Navegador iniciado correctamente');
});

After(async function ({ pickle, result }) {
  // Capturar screenshot si el test falla
  if (result?.status === 'FAILED' && this.page) {
    try {
      // Crear directorio de screenshots si no existe
      const screenshotDir = 'test-results/screenshots';
      await mkdir(screenshotDir, { recursive: true });

      // Nombre del archivo basado en el escenario
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const scenarioName = pickle.name.replace(/[^a-zA-Z0-9]/g, '_');
      const screenshotPath = join(screenshotDir, `${scenarioName}_${timestamp}.png`);

      // Guardar screenshot
      await this.page.screenshot({
        path: screenshotPath,
        fullPage: true
      });

      console.log(`📸 Screenshot guardado en: ${screenshotPath}`);

      // También adjuntar al reporte de Cucumber
      const screenshot = await this.page.screenshot({ fullPage: true });
      this.attach(screenshot, 'image/png');

    } catch (error) {
      console.error('❌ Error al capturar screenshot:', error.message);
    }
  }

  //console.log('🧹 Cerrando navegador...');
  await this.closeBrowser();
  //console.log('✅ Navegador cerrado correctamente');
});
import { app } from './app.js';
import { initDb } from './db.js';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    await initDb();
    console.log('✅ Banco de dados inicializado com sucesso.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Falha ao inicializar servidor:', error);
    process.exit(1);
  }
}

bootstrap();

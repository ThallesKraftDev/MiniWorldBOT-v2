import cron from 'node-cron';
import db from '../mongodb/shop.js'; // Certifique-se do caminho correto para shop.mjs

class Shop {
  constructor(data = {}) {
    this.data = data;
    this.loja = [];
    // Modificado para usar async/await corretamente dentro do construtor
    this.initialize();
  }

  async initialize() {
    this.db = await db.findOne({ id: "1" });
    if (!this.db) {
      await new db({ id: '1' }).save();
      this.db = await db.findOne({ id: "1" });
    }

    this.db.itens = [];

    // Chama imediatamente a função e agendamento do cronômetro
    this.executarCronJob();
    this.agendarProximoCronJob();
  }

  executarCronJob() {
    // Executa a função do cron job imediatamente ao iniciar
    this.cronJob();
  }

  agendarProximoCronJob() {
    // Agenda o próximo cron job de acordo com o horário especificado
    cron.schedule('0 0 * * *', () => {
      this.cronJob();
    });
  }

  async cronJob() {
    let numeros = this.escolherNumerosDiferentes(1, 11); // Escolhe números de 1 a 11
    
     numeros.map(x => {
       this.db.itens.push(x);
     })

    await this.db.save();
    
  }

  escolherNumerosDiferentes(min, max) {
    let numerosEscolhidos = [];

    // Loop para escolher 5 números diferentes
    while (numerosEscolhidos.length < 5) {
      let numero = Math.floor(Math.random() * (max - min + 1)) + min; // Número aleatório entre min e max
      if (!numerosEscolhidos.includes(numero)) {
        numerosEscolhidos.push(numero);
      }
    }

    return numerosEscolhidos;
  }
}

export default Shop;
import chalk from "chalk";

const types = {
    success: { prefix: chalk.green("[SUCCESS]"), log: console.log },
    info: { prefix: chalk.blue("[INFO]"), log: console.log },
    warn: { prefix: chalk.yellow("[WARNING]"), log: console.warn },
    error: { prefix: chalk.red("[ERROR]"), log: console.error }
};

/**
 * Função para realizar o log com formatação específica baseada no tipo.
 * @param {string} type - O tipo de log ('success', 'info', 'warn' ou 'error')
 * @param {string} message - O conteúdo da mensagem a ser logado
 */
function log(type, message) {
    const selectedType = types[type.toLowerCase()] || { log: console.log };

    selectedType.log(`${selectedType.prefix || ""} ${message.replace(">>", chalk.red(">>"))}`);
}

// Objeto que irá conter os métodos de log
const logger = {
    log: function(type, message) {
        log(type, message);
    }
};

// Adicionando métodos específicos para cada tipo de log diretamente no objeto logger
Object.keys(types).forEach(type => {
    logger[type] = function(message) {
        log(type, message);
    };
});

// Exportando o objeto logger como padrão
export default logger;

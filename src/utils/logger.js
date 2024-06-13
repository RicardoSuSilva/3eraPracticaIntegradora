import winston from 'winston' 

const customLevelOpt = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'orange',
        warning: 'yellow',
        info: 'blue',
        http: 'white',
        debug: 'cyan'
    }
};


// 1°  CREACIÓN DE LOGGER

// utilizando la biblioteca Winston, utilizando winston.createLogger()
const logger = winston.createLogger({
    //Se especifican los niveles de logs utilizando los niveles definidos en customLevelOpt.levels.
    levels: customLevelOpt.levels,

    // 2° CONFIGURACIÓN DEL TRANSPORTE 

    // para la salida de logs a la consola, "especifico el formato, como quiero que se trabajen cada uno de ellos"
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({ color: customLevelOpt.colors }),
                winston.format.simple()
            )
        }),

        //LOS QUE GUARDO EN UN ARCHIVO

        new winston.transports.File({
            level: 'warning',
            filename: './warnings.log',
            format: winston.format.simple()
        }),

        new winston.transports.File({
            level: 'error',
            filename: './errors.log',
            format: winston.format.simple()
        }),

        new winston.transports.File({
            level: 'http',
            filename: './http.log',
            format: winston.format.simple()
        }),


        new winston.transports.File({
            level: 'debug',
            filename: './debug.log',
            format: winston.format.simple()
        }),

        new winston.transports.File({
            level: 'fatal',
            filename: './fatal.log',
            format: winston.format.simple()
        })

    ]

});

//ARCHIVO DE CONFIGURACION A NIVEL DE RUTAS.


//Este código define una función middleware llamada addLogger que se exporta para su uso en otras partes de la aplicación. La voy a usar en este caso a nivel de ruta.
// Función middleware para añadir el logger a la solicitud (request)
export const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.info(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`);
    next();
};

//logger test
export const loggerTest = async (req, res) => {
    try {

        logger.fatal('Este es un mensaje de fatal');
        logger.error('Este es un mensaje de error');
        logger.warning('Este es un mensaje de warning');
        logger.info('Este es un mensaje de info');
        logger.http('Este es un mensaje de http');
        logger.debug('Este es un mensaje de debug');
        
        res.send('Logs generados con éxito');
    } catch (error) {
        logger.error(`Error al generar logs: ${error.message}`);
        res.status(500).send('Error interno del servidor');
    }
};
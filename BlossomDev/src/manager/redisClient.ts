
import Redis from 'ioredis';


const client = new Redis();
/* Manejo de eventos de conexión al redis.  */
client.on('connect', () => {
    console.log('Conexión establecida con Redis');
});

client.on('error', (err) => {
    console.error('Error de conexión con Redis:', err);
});

export default client;
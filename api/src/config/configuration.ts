export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    selfUrlFront: process.env.NODE_ENV == 'production' ? 'http://85.143.220.194:8888' : 'http://localhost:8080',
    selfUrlBack: process.env.NODE_ENV == 'production' ? 'http://85.143.220.194:8888' : 'http://localhost:3000',
    database: {
        host: process.env.MONGO_URI,
    },
    googleIntegration: {
        redirectUrl: '/api/v1/card/auth_google_ok'
    }
});
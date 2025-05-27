import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://localhost:7170', // ajuste para o seu backend real
});

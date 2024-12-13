import * as jose from 'jose';
export const accessSecretJwt = new TextEncoder().encode('PfBvgthfnjhf!');
export const refreshSecretJwt = new TextEncoder().encode('Pfxtkjdtxtcndj!');
export const superSecret =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sbGlmd2dvd2pvaXZyeHBsbmJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4MjcyMTMsImV4cCI6MjA0MjQwMzIxM30.wDaUIGxpaMiS-UAfwo0_qaf9UdaghqXeF3v9C2ggeiA';

export const accessExp = '15m';
export const refreshExp = '7d';

create extension if not exists pgcrypto;

alter role app set search_path to app, public;

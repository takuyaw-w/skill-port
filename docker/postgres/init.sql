create extension if not exists pgcrypto;

create schema if not exists app authorization app;

alter role app set search_path to app, public;

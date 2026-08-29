# euler-api

CDK + Lambda API for Euler Tools (tokens, wallets, portfolios, favorites, Athena, BscScan wrappers, Bitquery). Archived snapshot, as-is.

This tree is a **new public commit** with no git history. The original private archive is `eulertools/euler-api-archive`.

## What was built (EN)

TypeScript Lambdas behind API Gateway: catalog/token queries (Athena + DynamoDB streams), user wallets/portfolios/favorites, BscScan proxy (`YourApiKeyToken` placeholder), Bitquery GraphQL for candles. CDK stacks for DynamoDB, Elasticsearch, and a pipeline. AWS account IDs, VPC/subnet IDs, hosted-zone IDs, and stream ARNs in `config/env_*.ts` were replaced with placeholders in this snapshot. Athena keys come from the environment.

There is no TradingView `charting_library` tree here (only an eslint ignore pattern). No Solidity deployments in this repo.

## Qué se construyó (ES)

API Lambda/CDK. IDs internos de AWS sustituidos por placeholders. Sin deployments de contratos.

---

## Notice / Aviso

**Euler Tools ha cerrado. Euler Tools is closed.**

La empresa quebró. Este repositorio está archivado y no se mantiene. El software se ofrece tal cual (as is), sin garantía ni soporte. Parte del material puede ser reclamado por acreedores.

The company went bankrupt. This repository is archived and unmaintained. Software is provided as is, with no warranty and no support. Some material may be claimed by creditors.

Site: https://euler.tools  
Org: https://github.com/eulertools  
Enquiries: https://sinequix.com · https://github.com/tebayoso

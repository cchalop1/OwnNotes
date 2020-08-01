#!/bin/bash
docker stop own-notes_postgres_1
docker rm own-notes_postgres_1
docker volume rm own-notes_postgres
docker-compose up -d
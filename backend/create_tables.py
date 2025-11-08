#!/usr/bin/env python3
from app.core.db import create_tables

if __name__ == "__main__":
    create_tables()
    print("Tables created")

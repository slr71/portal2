#!/usr/bin/env python
import argparse
import sys
import psycopg2
from psycopg2.extras import DictCursor
import csv


def fetch_grid_institutions(db):
    cursor = db.cursor(cursor_factory=DictCursor)
    cursor.execute('SELECT id,grid_id,name FROM account_institution_grid')
    return dict((row[1],row) for row in cursor.fetchall())


def update_user_institution_grid_id(db, user_id, grid_institution_id, name):
    cursor = db.cursor()
    cursor.execute(
        "UPDATE account_user SET (grid_institution_id,institution) = (%s,%s) WHERE id=%s",
        [grid_institution_id, name, user_id]
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Update GRID CSV institutions in database')
    parser.add_argument('-v', '--verbose', action="store_true", help='print debug info')
    parser.add_argument('--host', default='', help='the database host name or IP address')
    parser.add_argument('--port', type=int, default=5432, help='the database port number')
    parser.add_argument('--user', default='portal', help='the database username')
    parser.add_argument('--database', default='portal', help='the database name')
    parser.add_argument('path', nargs=1, help='path of token data')
    args = parser.parse_args()

    GRID_MAP_FILE_PATH = args.path[0]

    conn = psycopg2.connect(host=args.host, port=args.port, user=args.user, dbname=args.database)

    # Load GRID institution names
    grid = fetch_grid_institutions(conn)

    # Load TSV mapping file
    with open(GRID_MAP_FILE_PATH) as csvfile:
        gridMap = list(csv.reader(csvfile, delimiter='\t'))

    for fields in gridMap:
        userId = fields[0]
        gridId = fields[2]
        gridRowId = grid[gridId]['id']
        gridName = grid[gridId]['name']
        print(userId, gridRowId, gridName)
        update_user_institution_grid_id(conn, userId, gridRowId, gridName)
    conn.commit()

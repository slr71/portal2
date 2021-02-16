#!/usr/bin/env python
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
    if len(sys.argv) < 2:
        print('GRID mapping .csv file path required')
        exit(-1)
    GRID_MAP_FILE_PATH = sys.argv[1]

    conn = psycopg2.connect(host='', dbname='portal')

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
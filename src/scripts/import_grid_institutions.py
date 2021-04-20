#!/usr/bin/env python
import sys
import psycopg2
import csv


def insert_institutions(db, fields):
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO account_institution_grid (grid_id,name,city,state,country) VALUES (%s,%s,%s,%s,%s) ON CONFLICT(grid_id) DO NOTHING", 
        fields
    )


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print('GRID .csv file path required')
        exit(-1)
    GRID_FILE_PATH = sys.argv[1]

    conn = psycopg2.connect(host='', dbname='portal')

    # Load GRID CSV file
    with open(GRID_FILE_PATH) as csvfile:
        gridInsitutions = list(csv.reader(csvfile))
    gridInsitutions.pop(0) # remove header

    # Create an "Other" entry with id 1
    insert_institutions(conn, ['', 'Other', '', '', ''])

    for i in gridInsitutions:
        print(i)
        insert_institutions(conn, i)
    conn.commit()
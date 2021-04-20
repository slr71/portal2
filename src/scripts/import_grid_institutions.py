#!/usr/bin/env python3
import sys
import psycopg2
import csv
import argparse


def insert_institutions(db, fields):
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO account_institution_grid (grid_id,name,city,state,country) VALUES (%s,%s,%s,%s,%s) ON CONFLICT(grid_id) DO NOTHING", 
        fields
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Import GRID CSV file into database')
    parser.add_argument('-v', '--verbose', action="store_true", help='print debug info')
    parser.add_argument('path', nargs=1, help='path of token data')
    args = parser.parse_args()

    conn = psycopg2.connect(host='', dbname='portal')

    # Load GRID CSV file
    with open(args.path[0]) as csvfile:
        gridInsitutions = list(csv.reader(csvfile))
    gridInsitutions.pop(0) # remove header

    # Create an "Other" entry with id 1
    insert_institutions(conn, ['', 'Other', '', '', ''])

    for i in gridInsitutions:
        if args.verbose:
            print(i)
        insert_institutions(conn, i)
    conn.commit()
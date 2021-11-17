#!/usr/bin/env python
import argparse
import sys
import psycopg2
import csv
import re
# from difflib import SequenceMatcher
from operator import itemgetter


# Compute Sorenson-Dice coefficient which is much faster than SequenceMatcher
# From https://en.wikibooks.org/wiki/Algorithm_Implementation/Strings/Dice%27s_coefficient
def dice_coefficient(a, b):
    if not len(a) or not len(b): return 0.0
    if len(a) == 1:  a=a+u'.'
    if len(b) == 1:  b=b+u'.'

    a_bigram_list=[]
    for i in range(len(a)-1):
      a_bigram_list.append(a[i:i+2])
    b_bigram_list=[]
    for i in range(len(b)-1):
      b_bigram_list.append(b[i:i+2])

    a_bigrams = set(a_bigram_list)
    b_bigrams = set(b_bigram_list)
    overlap = len(a_bigrams & b_bigrams)
    dice_coeff = overlap * 2.0/(len(a_bigrams) + len(b_bigrams))
    return dice_coeff


def fetch_user_institutions(db):
    cursor = db.cursor()
    cursor.execute('SELECT id,LOWER(institution) AS institution FROM account_user ORDER BY institution')
    return cursor.fetchall()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='map grid institutions')
    parser.add_argument('--host', default='', help='the database host name or IP address')
    parser.add_argument('--port', type=int, default=5432, help='the database port number')
    parser.add_argument('--user', default='portal', help='the database username')
    parser.add_argument('--database', default='portal', help='the database name')
    parser.add_argument('path', nargs=1, help='path of token data')
    args = parser.parse_args()

    GRID_FILE_PATH = args.path[0]

    # Too generic, can't be mapped to a particular institution
    EXCLUDED_VALUES = [
        'university', 'universidad', 'high school', 'community college', 'medical center', 'research center', 'science research',
        'university of science', 'university of technology', 'university of science and technology'
    ]

    conn = psycopg2.connect(host=args.host, port=args.port, user=args.user, dbname=args.database)

    # Fetch institutions from DB
    userInstitutions = fetch_user_institutions(conn)

    # Load GRID file
    with open(GRID_FILE_PATH) as csvfile:
        gridInsitutions = list(csv.reader(csvfile))
    gridInsitutions.pop(0) # remove header
    for i in gridInsitutions:
      i[1] = i[1].lower()
    gridInsitutions = sorted(gridInsitutions, key=itemgetter(1))

    regex1 = re.compile(r'^the ')
    regex2 = re.compile(r'^[\,\.\'\"\(\-\*\#)+]')

    seen = {}
    for i1 in userInstitutions:
        name1 = i1[1]
        if name1 == 'not provided' or len(name1) < 4:
            continue

        name1 = regex1.sub('', name1)
        name1 = regex2.sub('', name1)
        name1 = name1.strip()

        if name1 in EXCLUDED_VALUES:
            continue

        if name1 in seen:
            match = seen[name1]
        else:
            maxScore = 0
            for i2 in gridInsitutions:
                if name1 == i2[1]:
                    score = 1
                else:
                    score = dice_coefficient(name1, i2[1])
                    # score = SequenceMatcher(lambda x: x == " ", name1, i2[1]).ratio()

                if score > maxScore:
                    maxScore = score
                    id2 = i2[0]
                    name2 = i2[1]

            match = '\t'.join((str(id2), name2, str(maxScore)))
            seen[name1] = match

        print('\t'.join((str(i1[0]), i1[1], match)))

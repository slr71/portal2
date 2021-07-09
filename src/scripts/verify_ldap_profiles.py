#!/usr/bin/env python3
from ldap3 import Server, Connection, ALL, SAFE_SYNC
import argparse
import psycopg2
import psycopg2.extras


def fetch_users(conn):
  cursor = conn.cursor(cursor_factory=psycopg2.extras.NamedTupleCursor)
  cursor.execute("SELECT id,username,first_name,last_name,email FROM account_user")
  rows = cursor.fetchall()
  return rows


def escape(s):
  s.replace("'", r"\'")


if __name__ == "__main__":
  parser = argparse.ArgumentParser()
  parser.add_argument('-lh', '--ldaphost', help='LDAP hostname')
  parser.add_argument('-lu', '--ldapuser', help='LDAP username')
  parser.add_argument('-lp', '--ldappass', help='LDAP password')
  args = parser.parse_args()

  conn = psycopg2.connect(host='', dbname='portal')
  users = fetch_users(conn)
  userIndex = {}
  for u in users:
    userIndex[u.username] = u

  server = Server(args.ldaphost)
  conn = Connection(server, args.ldapuser, args.ldappass, auto_bind=True)
  conn.search('dc=iplantcollaborative,dc=org', '(objectclass=person)', attributes=['uid', 'mail', 'givenName', 'sn'])

  for entry in conn.entries:
    if not str(entry.uid) in userIndex:
        continue

    user = userIndex[str(entry.uid)]
    #if user.first_name != escape(str(entry.givenName)):
    #    print(user.username, 'first_name/givenName', user.first_name, entry.givenName)
    #if user.last_name != escape(str(entry.sn)):
    #    print(user.username, 'last_name/sn', user.last_name, entry.sn)
    if user.email.lower() != str(entry.mail).lower():
        print(user.username, 'email/mail', user.email, entry.mail)

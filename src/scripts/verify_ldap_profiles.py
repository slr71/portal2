#!/usr/bin/env python3
from ldap3 import Server, Connection, MODIFY_REPLACE
import argparse
import psycopg2
import psycopg2.extras


def fetch_users(conn):
  cursor = conn.cursor(cursor_factory=psycopg2.extras.NamedTupleCursor)
  cursor.execute("SELECT id,username,first_name,last_name,email FROM account_user")
  rows = cursor.fetchall()
  return rows


def escape(s):
  return s.replace("'", r"\'")


if __name__ == "__main__":
  parser = argparse.ArgumentParser()
  parser.add_argument('-lh', '--ldaphost', help='LDAP hostname')
  parser.add_argument('-lu', '--ldapuser', help='LDAP username')
  parser.add_argument('-lp', '--ldappass', help='LDAP password')
  parser.add_argument('-u', '--update', action='store_true', help="Update mismatched attributes in LDAP")
  parser.add_argument('--host', default='', help='the database host name or IP address')
  parser.add_argument('--port', type=int, default=5432, help='the database port number')
  parser.add_argument('--user', default='portal', help='the database username')
  parser.add_argument('--database', default='portal', help='the database name')
  args = parser.parse_args()

  conn = psycopg2.connect(host=args.host, port=args.port, user=args.user, dbname=args.database)
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
    #if escape(user.first_name) != str(entry.givenName):
    #  print(user.username, 'first_name/givenName', user.first_name, entry.givenName)
    #if escape(user.last_name) != str(entry.sn):
    #  print(user.username, 'last_name/sn', user.last_name, entry.sn)
    if user.email.lower() != str(entry.mail).lower():
      print(user.username, 'email/mail', user.email, entry.mail)
      if args.update:
        result = conn.modify('uid='+user.username+',ou=People,dc=iplantcollaborative,dc=org',
                            {'mail': [(MODIFY_REPLACE, [user.email])]})

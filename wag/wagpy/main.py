# README https://developer.yahoo.com/fantasysports/guide/
from yahoo_oauth import OAuth2
oauth = OAuth2(None, None, from_file='oauth2.json')
if not oauth.token_is_valid():
  oauth.refresh_access_token()
#code from yahoo: vgf9sud
# url = "https://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=79.l.******, 101.l.******, 124.l.******, 153.l.******,175.l.******, 199.l.******, 222.l.******, 242.l.******,257.l.******, 273.l.******, 314.l.******, 331.l.******,348.l.******, 359.l.******, 371.l.******/standings"
# url = "https://fantasysports.yahooapis.com/fantasy/v2/game/nfl"
# url = "https://fantasysports.yahooapis.com/fantasy/v2/games;game_keys=399"
url = "https://fantasysports.yahooapis.com/fantasy/v2/team/"
r = oauth.session.get(url)
print(r.status_code)
print(r.content)

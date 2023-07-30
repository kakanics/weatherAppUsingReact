# send an API request
import requests

# store the URL in a variable
url1 = 'https://api.openweathermap.org/data/3.0/onecall?lat={0}&lon={0}&exclude{current, minutely, hourly, alerts}&appid={5fb2fb0fb6b8b2aaa07163a6997f91c4}'
url2 = 'https://api.openweathermap.org/data/2.5/weather?q=Lahore,Pakistan&APPID=5fb2fb0fb6b8b2aaa07163a6997f91c4'
url = 'http://dataservice.accuweather.com/forecasts/v1/daily/5day/260622?apikey=wKWy56S8oAlkTjrALbfyYhTT7CCxN5dN&metric=true'
# send a GET request to the URL
response = requests.get(url)
print(response.json())

from lib.config_manager import get_configurations
import requests

def get(url):
    data = None
    config = get_configurations()
    shop_id = config["shop_id"]

    headers = {
        "shop_id": shop_id
    }

    try:
       data = requests.get(url, headers=headers).json()['data']
    except:
       print('Error while making API request')
    
    return data
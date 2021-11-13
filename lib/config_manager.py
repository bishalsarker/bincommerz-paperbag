import json

def get_configurations():
    config = None
    config_file = 'appconfig.json'

    with open(config_file) as fh:
        config = json.load(fh)
    
    return config
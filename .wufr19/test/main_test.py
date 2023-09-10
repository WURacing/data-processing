# note- files with format RUNXX1X.csv are intended to be pass cases
# files with format RUN XX0X.csv are intended to be fail cases

import requests

# fail due to name

with open('files/LOG0010.csv', 'rb') as f:
    r = requests.post('http://127.0.0.1:4000/process/files/2019.1.0/mohela',
                      files={'LOG0010.csv': f})
    print(r.status_code)

#!/usr/bin/env python3
import glob
import csv
import re
import requests
import os

location = "MOHELA"
runpattern = re.compile(r"RUN(\d+).+")

for file in os.listdir("./data/processed"):
    good = False
    no = int(runpattern.match(file).group(1))
    with open(f'./data/processed/{file}', newline='') as fd:
        reader = csv.DictReader(fd)
        for row in reader:
            val = float(row['sig_val'])
            if row['sig_name'] == "EngineSpeed" and val > 1000:
                good = True
                break
    if good:
        with open(f'./data/processed/{file}', "rb") as fd:
            print(file)
            print(no)
            r = requests.post("http://apps.connor.money/data/api/runs",
                files={"file": fd}, data={"location": location, "runofday": no})
            if r.status_code != 201:
                print(r.text)
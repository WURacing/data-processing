import datetime
import os

for filename in os.listdir('./data'):
    with open(f'./converted/{filename}', 'w+') as output:
        with open(f'./data/{filename}', 'r') as inp:
            print(filename)
            first_line = True
            for line in inp.readlines():
                if first_line:
                    output.write(f'timestamp,id,data\n')
                    first_line = False
                else:
                    data = line.rstrip().split(',')
                    if len(data) != 9:
                        continue
                    dt=datetime.datetime.strptime(f'{data[0]},{data[1]},{data[2]},{data[3]},{data[4]},{data[5]},{data[6]}','%Y,%m,%d,%H,%M,%S,%f')
                    timestamp = dt.timestamp()
                    # print(timestamp)
                    output.write(f'{int(round(timestamp))},{data[7]},{data[8]}\n')
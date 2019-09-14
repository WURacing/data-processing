import datetime

dirname = os.path.dirname(__file__)

can_folder = os.path.join(dirname, 'data', folder,'raw')
	#can_folder = './data/{}/raw'.format(folder)

	for logfile in os.listdir(can_folder):
		with open (logfile, 'w') as f:
            timestamp = datetime
            # TODO- WIP
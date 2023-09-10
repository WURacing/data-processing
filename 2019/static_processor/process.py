import sys
sys.path.insert(0,'..')

import datetime
import os
import re

import canparser

pattern = re.compile('LOG(GER)?(\d+).CSV')
dbc_file = '/Users/etshr/Documents/Git/DataProcessing/static_processor/dbc/2019.1.0.dbc'

def getTimeStr(timestamp):
	dt = datetime.datetime.fromtimestamp(timestamp/1000.0)
	epochstr = dt.strftime('%Y-%m-%d %H:%M:%S.%f')
	return epochstr

if __name__ == "__main__":
	# folder = sys.argv[1]

	can_folder = os.path.join('data', 'raw')

	for logfile in os.listdir(can_folder):
		match = pattern.match(logfile)
		if match is None:
			continue
		run = match.group(2)

		f = None
		parser = canparser.CSVCANParser(dbc_file,os.path.join(can_folder,logfile))

		up_fire_id = ('RIGHT_CAN_CONTROLLER','RightController0','CGAccUpFirewall')
		from_fire_id = ('RIGHT_CAN_CONTROLLER','RightController0','CGAccFromFirewall')
		neg_x_id = ('Filter','Filter','CGAccNegX','acceleration:G')
		neg_z_id = ('Filter','Filter','CGAccNegZ','acceleration:G')
		x_id = ('Filter','Filter','CGAccX','acceleration:G')
		z_id = ('Filter','Filter','CGAccZ','acceleration:G')

		load_id = ('AEM_EMS_4','AEMEngine0','EngineLoad')
		map_id = ('Filter','Filter','ManifoldPressure','pressure:kpa')

		rotate_acc = canparser.Rotate2DFilter(
			input_signals=[from_fire_id,up_fire_id],
			output_signals=[neg_x_id,neg_z_id],
			theta=-0.92
			)
		flip_x = canparser.LinearComboFilter(
			input_signals=[neg_x_id[:-1]],
			output_signal=x_id,
			coeffs=[-1,0]
			)
		flip_z = canparser.LinearComboFilter(
			input_signals=[neg_z_id[:-1]],
			output_signal=z_id,
			coeffs=[-1,0]
			)
		scale_load = canparser.LinearComboFilter(
			input_signals=[load_id],
			output_signal=map_id,
			coeffs=[1.1489,0]
			)

		pfiltered = canparser.ParserFilter(
			signal_filters=[],
			parser=parser
			)

		for signal in pfiltered.filtered_signals():
			if f is None:
				epochstr = ''
				if signal['epoch']:
					dt = datetime.datetime.fromtimestamp(signal['timestamp']/1000.0)
					epochstr = dt.strftime('_%Y-%m-%d_%H-%M-%S_%f')
				filename = 'RUN'+run+epochstr+'.csv'
				filename = os.path.join('data', 'processed' , filename)
				print(filename)
				f = open(filename,'w')
				f.write('timestamp,datetime,sender,msg_name,sig_name,sig_val,units\n')

			logstr = ','.join([
				str(signal['timestamp']),
				getTimeStr(signal['timestamp']),
				signal['sender'],
				signal['msg_name'],
				signal['sig_name'],
				str(signal['sig_val']),
				signal['units']
			])+'\n'
			f.write(logstr)

		if f is not None:
			f.close()
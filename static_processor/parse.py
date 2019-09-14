import os
import canparser

DBC_VERSION = '2019.1.0'

for filename in os.listdir('./converted'):
    with open(f'./parsed/{filename}', 'w+') as output:
        with open(f'./converted/{filename}', 'r') as inp:
            data = ''.join(inp.readlines())
            print(filename)
            output.write('timestamp, msg_name, sig_name, sig_val, units\n')
            #parser = canparser.LogFileCANParser(os.path.abspath(f'./dbc/{DBC_VERSION}.dbc'), os.path.abspath(f'./converted/{filename}'))
            parser = canparser.BytesCANParser(f'./dbc/{DBC_VERSION}.dbc',
                                            str(data))
            up_fire_id = ('RIGHT_CAN_CONTROLLER', 'RightController0',
                        'CGAccUpFirewall')
            from_fire_id = ('RIGHT_CAN_CONTROLLER', 'RightController0',
                            'CGAccFromFirewall')
            neg_x_id = ('Filter', 'Filter', 'CGAccNegX', 'acceleration:G')
            neg_z_id = ('Filter', 'Filter', 'CGAccNegZ', 'acceleration:G')
            x_id = ('Filter', 'Filter', 'CGAccX', 'acceleration:G')
            z_id = ('Filter', 'Filter', 'CGAccZ', 'acceleration:G')

            load_id = ('AEM_EMS_4', 'AEMEngine0', 'EngineLoad')
            map_id = ('Filter', 'Filter', 'ManifoldPressure', 'pressure:kpa')

            rotate_acc = canparser.Rotate2DFilter(
                input_signals=[from_fire_id, up_fire_id],
                output_signals=[neg_x_id, neg_z_id],
                theta=-0.92)
            flip_x = canparser.LinearComboFilter(input_signals=[neg_x_id[:-1]],
                                                    output_signal=x_id,
                                                    coeffs=[-1, 0])
            flip_z = canparser.LinearComboFilter(input_signals=[neg_z_id[:-1]],
                                                    output_signal=z_id,
                                                    coeffs=[-1, 0])
            scale_load = canparser.LinearComboFilter(input_signals=[load_id],
                                                        output_signal=map_id,
                                                        coeffs=[1.1489, 0])

            pfiltered = canparser.ParserFilter(
                signal_filters=[rotate_acc, flip_z, flip_x, scale_load],
                parser=parser)

            for signal in pfiltered.filtered_signals():
                output.write(f"{signal['timestamp']}, {signal['msg_name']}, {signal['sig_name']}, {signal['sig_val']}, {signal['units']}\n")
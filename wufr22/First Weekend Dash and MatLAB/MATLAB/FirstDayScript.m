FuelPressureArray = table2array(readtable('~/Desktop/averages_csv_1/FuelPressure.csv'));
WaterTempArray = table2array(readtable('~/Desktop/averages_csv_1/CoolantTemp.csv'));
GearPositionArray = table2array(readtable('~/Desktop/averages_csv_1/GearPosition.csv'));
OilPressureArray = table2array(readtable('~/Desktop/averages_csv_1/OilPressure.csv'));
OilTempArray = table2array(readtable('~/Desktop/averages_csv_1/OilTemperature.csv'));
RPMArray = table2array(readtable('~/Desktop/averages_csv_1/RPMRate.csv'));

x_FuelPressure = FuelPressureArray(:,1);
y_FuelPressure = FuelPressureArray(:,2);
x_WaterTemp = WaterTempArray(:,1);
y_WaterTemp = WaterTempArray(:,2);
x_GearPosition = GearPositionArray(:,1);
y_GearPosition = GearPositionArray(:,2);
x_OilPressure = OilPressureArray(:,1);
y_OilPressure = OilPressureArray(:,2);
x_OilTemp = OilTempArray(:,1);
y_OilTemp = OilTempArray(:,2);
x_RPM = RPMArray(:,1);
y_RPM = RPMArray(:,2);


%FuelPressureGraph = plot(x_FuelPressure,y_FuelPressure,'r');
%WaterTempGraph = plot(x_WaterTemp,y_WaterTemp,'o');
%GearPositionGraph = plot(x_GearPosition,y_GearPosition,'cy');
%OilPressureGraph = plot(x_OilPressure,y_OilPressure,'p');
%OilTempGraph = plot(x_OilTemp,y_OilTemp,'bl');
%RPMGraph = plot(x_RPM,y_RPM,'r');
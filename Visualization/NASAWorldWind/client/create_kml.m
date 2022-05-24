%creating flight_data.kml file from flight_data.mat file
%for rendering trajectory on Google Earth

clc; close all;

%set indexes for coordinates in flight_data
latitude_index = 3;
longitude_index = 4;
altitude_index = 5;

%set dimensions
flight_data_size = size(flight_data);
params_dimension = flight_data_size(1);
data_dimensions = flight_data_size(2);

%open, write and close *.kml file
file_kml = fopen("flight_ideal.kml", 'w');
fprintf(file_kml, "<?xml version='1.0' encoding='UTF-8'?>\n");
fprintf(file_kml, "<kml xmlns='http://earth.google.com/kml/2.2'>\n");
fprintf(file_kml, "<Document>\n");
fprintf(file_kml, "<Placemark>\n");
fprintf(file_kml, "   <name>flight</name>\n");
fprintf(file_kml, "   <LineString>\n");
fprintf(file_kml, "       <extrude>1</extrude>\n");
fprintf(file_kml, "       <altitudeMode>absolute</altitudeMode>\n");
fprintf(file_kml, "       <coordinates>\n");

for i = 1:1:data_dimensions
    fprintf(file_kml, "        %f,%f,%f\n", rad2deg(flight_data(longitude_index, i)), rad2deg(flight_data(latitude_index, i)), flight_data(altitude_index, i));
end

fprintf(file_kml, "       </coordinates>\n");
fprintf(file_kml, "   </LineString>\n");
fprintf(file_kml, "</Placemark>\n");
fprintf(file_kml, "</Document>");
fprintf(file_kml, "</kml>\n");
fclose(file_kml);
function create_kml_file(filename, lat_arr, lon_arr, alt_arr)
    %creating kml file from mat file
    %for rendering trajectory on virtual globe
    clc; close all;

    %set size
    data_size = length(lat_arr);

    %open, write and close *.kml file
    file = sprintf("../client/kml/%s.kml", filename);
    file_kml = fopen(file, 'w');
    fprintf(file_kml, "<?xml version='1.0' encoding='UTF-8'?>\n");
    fprintf(file_kml, "<kml xmlns='http://earth.google.com/kml/2.2'>\n");
    fprintf(file_kml, "<Document>\n");
    fprintf(file_kml, "<Placemark>\n");
    fprintf(file_kml, "   <name>flight</name>\n");
    fprintf(file_kml, "   <LineString>\n");
    fprintf(file_kml, "       <extrude>1</extrude>\n");
    fprintf(file_kml, "       <altitudeMode>absolute</altitudeMode>\n");
    fprintf(file_kml, "       <coordinates>\n");

    for i = 1:1:data_size
        fprintf(file_kml, "        %f,%f,%f\n", lon_arr(i), lat_arr(i), alt_arr(i));
    end

    fprintf(file_kml, "       </coordinates>\n");
    fprintf(file_kml, "   </LineString>\n");
    fprintf(file_kml, "</Placemark>\n");
    fprintf(file_kml, "</Document>");
    fprintf(file_kml, "</kml>\n");
    fclose(file_kml);

end